import { NextFunction, Request, Response } from "express";
import { queues, users } from "../../database";

export default async (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization;

  if (!authorization)
    return res.status(403).send({
      status: 403,
      message: "Missing authorization",
    });

  const queue_owner = await users.findOne({ account_token: authorization });

  if (queue_owner.account_token != authorization)
    return res.status(401).send({
      status: 401,
      message: "Unauthorized",
    });

  const queue_data = await queues.findById(queue_owner._id);

  if (!queue_data)
    return res.status(401).send({
      status: 401,
      message: "You don't have a queue. Dumbass",
    });

  return next();
};
