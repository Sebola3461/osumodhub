import { Request, Response } from "express";
import { queues, requests, users } from "../../../database";

export default async (req: Request, res: Response) => {
  const authorization = req.headers.authorization;

  if (!authorization)
    return res.status(403).send({
      status: 403,
      message: "Missing authorization",
    });

  const queue_owner = await users.findOne({ account_token: authorization });

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
    return res.status(400).send({
      status: 400,
      message: "Unauthorized",
    });

  queue.timeclose.scheduled = new Date();
  queue.timeclose.validated = false;

  await queues.updateOne({ _id: queue._id }, queue);

  res.status(200).send({
    status: 200,
    message: "Timer started!",
  });
};
