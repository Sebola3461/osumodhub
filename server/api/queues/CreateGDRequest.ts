import { Request, Response } from "express";
import { gds, queues, requests, users } from "../../../database";
import osuApi from "../../helpers/osuApi";
import crypto from "crypto";
import checkQueueAutoclose from "../helpers/checkQueueAutoclose";
import checkRequestQueueModes from "../helpers/checkRequestQueueModes";
import NotifyNewRequest from "../../notifications/NotifyNewRequest";
import SendNewRequestWebhook from "../webhooks/SendNewRequestWebhook";
import EmitNewRequest from "../websocket/EmitNewRequest";
import isQueueManager from "../../helpers/isQueueManager";
import checkGDRequestQueueModes from "../helpers/checkGDRequestQueueModes";

export default async (req: Request, res: Response) => {
  try {
    const authorization = req.headers.authorization;
    const requestedQueue = req.params["queue"];

    if (!authorization)
      return res.status(403).send({
        status: 403,
        message: "Missing authorization",
      });

    const author = await users.findOne({ account_token: authorization });
    const queue = await queues.findById(requestedQueue);

    if (queue == null)
      return res.status(404).send({
        status: 404,
        message: "Queue not found!",
      });

    const queueOwner = await users.findById(queue.owner);

    if (queueOwner == null)
      return res.status(404).send({
        status: 404,
        message: "Queue owner not found!",
      });

    if (author == null)
      return res.status(404).send({
        status: 404,
        message: "User not found!",
      });

    if (!queue.open && !isQueueManager(queue, author, authorization))
      return res.status(403).send({
        status: 403,
        message: "This queue is closed!",
      });

    let { comment, beatmapset_id, difficulties } = req.body;

    difficulties = sanitizeDifficulties();

    function sanitizeDifficulties() {
      const diffs = difficulties;

      if (typeof diffs != "object" || !diffs.length || diffs.length > 30)
        return [];

      const sanitized: any[] = [];

      diffs.forEach((d) => {
        if (
          !isNaN(d.mode) &&
          d.mode > -1 &&
          d.mode < 4 &&
          typeof d.name == "string" &&
          d.name.trim() != "" &&
          !isNaN(d.starRating) &&
          d.starRating > 0.0 &&
          d.starRating < 20.0
        ) {
          const diff_id = crypto.randomBytes(10).toString("hex").slice(10);

          sanitized.push({
            id: diff_id,
            name: d.name.trim(),
            starRating: d.starRating,
            mode: d.mode,
            user: {
              name: null,
              id: null,
            },
            claimed: false,
          });
        }
      });

      return sanitized;
    }

    const requestedBeatmapset = await osuApi.fetch.beatmapset(beatmapset_id);

    if (
      requestedBeatmapset.status != 200 ||
      !requestedBeatmapset.data ||
      !requestedBeatmapset.data.beatmaps
    )
      return res.status(requestedBeatmapset.status).send({
        status: requestedBeatmapset.status,
        message: "Invalid beatmap",
      });

    if (!queue.allow.cross && author._id != requestedBeatmapset.data.user_id) {
      // ? Bypass queue owner
      if (!isQueueManager(queue, author, authorization))
        return res.status(403).send({
          status: 403,
          message: "This queue does not allow cross requests!",
        });
    }

    if (!comment) comment = "";

    comment = comment.trim();

    if (
      !["pending", "graveyard", "wip"].includes(requestedBeatmapset.data.status)
    )
      return res.status(400).send({
        status: 400,
        message: `You can't request a beatmap with this status!`,
      });

    // ? Check queue requirements
    if (
      (!queue.allow.graveyard &&
        requestedBeatmapset.data.status == "graveyard") ||
      (!queue.allow.wip && requestedBeatmapset.data.status == "wip")
    )
      return res.status(400).send({
        status: 400,
        message: `This queue does not allow ${requestedBeatmapset.data.status} beatmaps!`,
      });

    if (!checkGDRequestQueueModes(queue, difficulties))
      return res.status(400).send({
        status: 400,
        message: `This queue does not allow beatmaps of this mode!`,
      });

    if (difficulties.length == 0)
      return res.status(400).send({
        status: 400,
        message: `Invalid difficulties provided!`,
      });

    const pending_request = await gds.findOne({
      _owner: author._id,
      beatmapset_id: requestedBeatmapset.data.id,
    });

    // if (
    //   pending_request != null &&
    //   pending_request.queues.find((q) => q.id == queue._id)
    // )
    //   return res.status(403).send({
    //     status: 403,
    //     message: `You already requested this beatmap here!`,
    //   });

    const currentRequest = await gds.findOne({
      beatmapset_id: requestedBeatmapset.data.id,
    });

    let request;
    if (currentRequest == null) {
      // ? Create request
      const request_id = crypto.randomBytes(10).toString("hex").slice(10);
      request = new gds({
        _id: request_id,
        _queue: queue._id,
        _owner: author._id,
        _owner_name: author.username,
        comment: comment,
        beatmapset_id: requestedBeatmapset.data.id,
        date: new Date(),
        cross: requestedBeatmapset.data.user_id != author._id,
        queues: [{ id: queue._id, status: "pending" }],
        rawQueues: [queue._id],
        beatmap: {
          id: requestedBeatmapset.data.id,
          artist: requestedBeatmapset.data.artist,
          title: requestedBeatmapset.data.title,
          covers: requestedBeatmapset.data.covers,
          creator: requestedBeatmapset.data.creator,
          bpm: requestedBeatmapset.data.beatmaps[0].bpm,
          duration: requestedBeatmapset.data.beatmaps[0].total_length,
          beatmaps: requestedBeatmapset.data.beatmaps.map((d) => {
            return {
              version: d.version,
              difficulty_rating: d.difficulty_rating,
              user_id: d.user_id,
              mode: d.mode,
            };
          }),
        },
        difficulties,
      });

      await request.save();
    } else {
      currentRequest.queues.push({
        id: queue._id,
        status: "pending",
      });

      currentRequest.rawQueues.push(queue._id);

      request = currentRequest;
    }

    await checkQueueAutoclose(queue);

    NotifyNewRequest(queue, queueOwner, author);
    queue.admins.forEach(async (admin_id) => {
      const user = await users.findById(admin_id);
      if (user) {
        NotifyNewRequest(queue, user, user);
      }
    });

    res.status(200).send({
      status: 200,
      message: "Guest Difficulty requested!",
      data: request,
    });

    EmitNewRequest(request);
    request.beatmap = requestedBeatmapset.data;

    if (queue.webhook) {
      if (queue.webhook.notify.includes("request:new"))
        SendNewRequestWebhook(queue, request);
    }
  } catch (e) {
    console.error(e);

    res.status(500).send({
      status: 500,
      message: "Internal server error!",
    });
  }
};
