import { NextFunction, Request, Response } from "express";
import { queues, users } from "../../database";

export default async (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization;
  const queue = req.params.queue;

  if (!queue)
    return res.status(403).send({
      status: 403,
      message: "Invalid queue",
    });

  if (!authorization)
    return res.status(403).send({
      status: 403,
      message: "Missing authorization",
    });

  const queue_data = await queues.findById(queue);

  if (queue_data == null)
    return res.status(404).send({
      status: 404,
      message: "Request not found!",
    });

  const queue_owner = await users.findById(queue_data._id);

  if (queue_owner.account_token != authorization)
    return res.status(401).send({
      status: 401,
      message: "Unauthorized",
    });

  return next();
};
