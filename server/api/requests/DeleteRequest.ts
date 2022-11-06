import { Request, Response } from "express";
import { queues, requests, users } from "../../../database";
import isQueueManager from "../../helpers/isQueueManager";

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

  if (queue.isGroup && !isQueueManager(queue, manager, authorization))
    return res.status(401).send({
      status: 401,
      message: "Unauthorized",
    });

  await requests.deleteOne({ _id: _request });
  await queues.updateOne(
    { _id: queue._id },
    {
      lastSeen: new Date(),
    }
  );

  res.status(200).send({
    status: 200,
    message: "Request deleted!",
  });
};
