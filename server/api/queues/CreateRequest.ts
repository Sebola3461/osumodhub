import { Request, Response } from "express";
import { queues, requests, users } from "../../../database";
import osuApi from "../../helpers/osuApi";
import crypto from "crypto";
import checkQueueAutoclose from "../helpers/checkQueueAutoclose";
import checkRequestQueueModes from "../helpers/checkRequestQueueModes";
import NotifyNewRequest from "../../notifications/NotifyNewRequest";
import SendNewRequestWebhook from "../webhooks/SendNewRequestWebhook";
import EmitNewRequest from "../websocket/EmitNewRequest";

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

    if (author == null)
      return res.status(404).send({
        status: 404,
        message: "User not found!",
      });

    if (authorization != author.account_token)
      return res.status(400).send({
        status: 401,
        message: "Unauthorized",
      });

    if (!queue.open && author._id != queue._id)
      return res.status(403).send({
        status: 403,
        message: "This queue is closed!",
      });

    let { comment, beatmapset_id } = req.body;

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

    if (requestedBeatmapset.data.user_id != author._id && !queue.allow.cross) {
      // ? Bypass queue owner
      if (author._id != queue._id)
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

    if (!checkRequestQueueModes(queue, requestedBeatmapset.data))
      return res.status(400).send({
        status: 400,
        message: `This queue does not allow beatmaps of this mode!`,
      });

    const pending_request = await requests.findOne({
      _owner: author._id,
      _queue: queue._id,
      beatmapset_id: requestedBeatmapset.data.id,
      status: "pending",
    });

    if (pending_request != null)
      return res.status(403).send({
        status: 403,
        message: `You already requested this beatmap here!`,
      });

    // ? Create request
    const request_id = crypto.randomBytes(10).toString("hex").slice(10);
    const request = new requests({
      _id: request_id,
      _queue: queue._id,
      _owner: author._id,
      _owner_name: author.username,
      comment: comment,
      status: "pending",
      beatmapset_id: requestedBeatmapset.data.id,
      date: new Date(),
      cross: requestedBeatmapset.data.user_id != author._id,
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
    });

    await request.save();

    queue.statistics[0] = queue.statistics[0] + 1;
    await queues.findByIdAndUpdate(queue._id, queue);

    await checkQueueAutoclose(queue);
    NotifyNewRequest(queue, author);

    EmitNewRequest(request);
    request.beatmap = requestedBeatmapset.data;

    if (queue.webhook) {
      if (queue.webhook.notify.includes("request:new"))
        SendNewRequestWebhook(queue, request);
    }

    res.status(200).send({
      status: 200,
      message: "Beatmap requested!",
      data: request,
    });
  } catch (e) {
    console.error(e);

    res.status(500).send({
      status: 500,
      message: "Internal server error!",
    });
  }
};
