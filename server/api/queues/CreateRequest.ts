import { Request, Response } from "express";
import { queues, requests, users } from "../../../database";
import osuApi from "../../helpers/osuApi";
import crypto from "crypto";
import checkQueueAutoclose from "../helpers/checkQueueAutoclose";
import checkRequestQueueModes from "../helpers/checkRequestQueueModes";
import NotifyNewRequest from "../../notifications/NotifyNewRequest";
import SendNewRequestWebhook from "../webhooks/SendNewRequestWebhook";
import EmitNewRequest from "../websocket/EmitNewRequest";
import isQueueManager from "../../helpers/isQueueManager";
import { IQueue, IQueueRequest } from "../../../src/types/queue";
import { RelativeDay } from "../../../src/helpers/RelativeDay";

async function getUserCooldown(user: any, queue: IQueue) {
  const userRequests = await requests
    .find({ _owner: user._id })
    .sort({ date: 1 });

  if (userRequests) return -1;

  const lastUserRequest = userRequests[0];

  if (!lastUserRequest) return -1;

  const days = RelativeDay(new Date(lastUserRequest.date), new Date());

  if (!queue.cooldown.enable) return -1;
  if (queue.owner == user._id) return -1;
  if (queue.isGroup && queue.admins.includes(user._id)) return -1;

  return days;
}

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
    const queueOwner = await users.findById(queue.owner);

    if (queue == null)
      return res.status(404).send({
        status: 404,
        message: "Queue not found!",
      });

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

    const userCooldown = await getUserCooldown(author, queue);

    console.log(userCooldown);

    if (userCooldown <= queue.cooldown.size && userCooldown != -1)
      return res.status(400).send({
        status: 400,
        message: `You need to wait ${
          userCooldown <= 1
            ? "for a day"
            : `${queue.cooldown.size - userCooldown} days`
        } to request a beatmap here again!`,
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
      _managers: [],
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
      message: "Beatmap requested!",
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
