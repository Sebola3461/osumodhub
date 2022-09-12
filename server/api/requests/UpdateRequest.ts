import { Request, Response } from "express";
import { queues, requests, users } from "../../../database";
import { IQueueRequest } from "../../../src/types/queue";
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

  const request: IQueueRequest | null = await requests.findById(_request);

  if (request == null)
    return res.status(404).send({
      status: 404,
      message: "Request not found!",
    });

  const manager = await users.findOne({ account_token: authorization });

  if (manager == null)
    return res.status(404).send({
      status: 404,
      message: "User not found!",
    });

  const queue = await queues.findById(request._queue);

  if (queue == null)
    return res.status(404).send({
      status: 404,
      message: "Queue not found!",
    });

  if (manager._id != queue.owner && !queue.isGroup)
    return res.status(401).send({
      status: 401,
      message: "Unauthorized",
    });

  if (
    queue.isGroup &&
    queue.owner != manager._id &&
    !queue.admins.includes(manager._id)
  )
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

  if (requestedStatus.bn && !manager.isBn)
    return res.status(400).send({
      status: 400,
      message: "You can't use this status!",
    });

  const requestBeatmap = await osuApi.fetch.beatmapset(
    request.beatmapset_id.toString()
  );

  function updateStatus() {
    if (!request) return;

    const currentPostIndex = request._managers.findIndex(
      (p) => p.userId == manager._id
    );

    if (currentPostIndex != -1) {
      request._managers.push({
        feedback: reply ? reply.toString().trim().toLowerCase() : null,
        status: status.toLowerCase(),
        userId: manager._id,
        username: manager.username,
      });
    } else {
      request._managers[currentPostIndex] = {
        feedback: reply ? reply.toString().trim().toLowerCase() : null,
        status: status.toLowerCase(),
        userId: manager._id,
        username: manager.username,
      };
    }
  }

  function getMostStatus() {
    const pool: any = {};

    for (const manager of request?._managers || []) {
      if (!pool[manager.status]) pool[manager.status] = 0;

      pool[manager.status]++;
    }

    const poolArray: any[] = [];

    Object.keys(pool).forEach((key) => {
      poolArray.push({ status: key, size: pool[key] });
    });

    poolArray.sort((a, b) => b.size - a.size);

    console.log(poolArray);
    return poolArray[0];
  }

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

  if (queue.isGroup) {
    updateStatus();
    request.status = getMostStatus().status;
  } else {
    request.status = status.toLowerCase();
    request._managers = [
      {
        feedback: reply ? reply.toString().trim().toLowerCase() : null,
        status: status.toLowerCase(),
        userId: manager._id,
        username: manager.username,
      },
    ];
  }

  await requests.findByIdAndUpdate(_request, request);

  EmitNewRequestUpdate(request);

  res.status(200).send({
    status: 200,
    message: "Request updated!",
  });
};
