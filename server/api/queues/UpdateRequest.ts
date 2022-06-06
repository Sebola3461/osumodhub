import { Request, Response } from "express";
import { queues, requests, users } from "../../../database";

export default async (req: Request, res: Response) => {
  const authorization = req.headers.authorization;
  const _request = req.params["request"];

  if (!authorization)
    return res.status(403).send({
      status: 403,
      message: "Missing authorization",
    });

  const target = await requests.findById(_request);

  if (target == null)
    return res.status(404).send({
      status: 404,
      message: "Request not found!",
    });

  const queue_owner = await users.findById(target._queue);
  const queue = await users.findById(target._queue);

  if (queue_owner == null)
    return res.status(404).send({
      status: 404,
      message: "User not found!",
    });

  if (queue == null)
    return res.status(404).send({
      status: 404,
      message: "Queue not found!",
    });

  if (authorization != queue_owner.account_token)
    return res.status(400).send({
      status: 400,
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
    { name: "waiting", bn: true },
    { name: "rechecking", bn: true },
    { name: "nominated", bn: true },
  ];

  const requestedStatus = valid_status.find(
    (s) => s.name == status.toLowerCase()
  );

  if (!requestedStatus)
    return res.status(400).send({
      status: 400,
      message: "Invalid status provided",
    });

  if (requestedStatus.bn && !["nominator", "nat"].includes(queue.type))
    return res.status(400).send({
      status: 400,
      message: "You can't use this status!",
    });

  target.status = status.toLowerCase();
  target.reply = reply;

  await requests.findByIdAndUpdate(target._id, target);

  res.status(200).send({
    status: 200,
    message: "Request updated!",
  });
};
