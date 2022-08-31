import { Request, Response } from "express";
import { queues, requests, users } from "../../../database";
import osuApi from "../../helpers/osuApi";
import NotifyRequestUpdate from "../../notifications/NotifyRequestUpdate";
import SendRequestUpdateWebhook from "../webhooks/SendRequestUpdateWebhook";
import EmitNewRequestUpdate from "../websocket/EmitNewRequestUpdate";

export default async (req: Request, res: Response) => {
  const authorization = req.headers.authorization;
  const _request = req.params["request"];

  if (!authorization)
    return res.status(403).send({
      status: 403,
      message: "Missing authorization",
    });

  const request = await requests.findById(_request);

  if (request == null)
    return res.status(404).send({
      status: 404,
      message: "Request not found!",
    });

  const queue_owner = await users.findById(request._queue);

  if (queue_owner == null)
    return res.status(404).send({
      status: 404,
      message: "User not found!",
    });

  const queue = await queues.findById(queue_owner._id);

  if (queue == null)
    return res.status(404).send({
      status: 404,
      message: "Queue not found!",
    });

  if (authorization != queue_owner.account_token)
    return res.status(401).send({
      status: 401,
      message: "Unauthorized",
    });

  let { reply, status } = req.body;

  if (!status)
    return res.status(400).send({
      status: 400,
      message: "Invalid status provided",
    });

  if (!reply) reply = "";

  reply = reply.trim();

  const valid_status = [
    { name: "accepted", bn: false },
    { name: "rejected", bn: false },
    { name: "finished", bn: false },
    { name: "archived", bn: false },
    { name: "waiting", bn: true },
    { name: "rechecking", bn: true },
    { name: "nominated", bn: true },
    { name: "ranked", bn: true },
  ];

  const requestedStatus = valid_status.find(
    (s) => s.name == status.toLowerCase()
  );

  if (!requestedStatus)
    return res.status(400).send({
      status: 400,
      message: "Invalid status provided",
    });

  if (requestedStatus.bn && !["BN", "NAT"].includes(queue.type))
    return res.status(400).send({
      status: 400,
      message: "You can't use this status!",
    });

  request.status = status.toLowerCase();

  const requestBeatmap = await osuApi.fetch.beatmapset(request.beatmapset_id);

  if (
    !requestBeatmap.data ||
    requestBeatmap.status != 200 ||
    !requestBeatmap.data.beatmaps
  )
    return res.status(404).send({
      status: 404,
      message: "Beatmap not found!",
    });

  request.beatmap.bpm = requestBeatmap.data.beatmaps[0].bpm;
  request.beatmap.creator = requestBeatmap.data.creator;
  request.beatmap.duration = requestBeatmap.data.beatmaps[0].total_length;

  request.beatmap.beatmaps = requestBeatmap.data.beatmaps.map((d) => {
    return {
      version: d.version,
      difficulty_rating: d.difficulty_rating,
      user_id: d.user_id,
      mode: d.mode,
    };
  });

  NotifyRequestUpdate(queue, request, status.toLowerCase());

  if (queue.webhook) {
    if (queue.webhook.notify.includes("request:update"))
      if (status.toLowerCase() != "archived")
        SendRequestUpdateWebhook(queue, request, reply);
  }

  await requests.updateOne(
    { _id: _request },
    {
      reply: reply,
      status: status.toLowerCase(),
    }
  );

  request.reply = reply;
  request.status = status.toLowerCase();

  EmitNewRequestUpdate(request);

  res.status(200).send({
    status: 200,
    message: "Request updated!",
  });
};
