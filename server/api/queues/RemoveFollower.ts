import { Request, Response } from "express";
import { followers, queues, users } from "../../../database";
import crypto from "crypto";

export default async (req: Request, res: Response) => {
  const id = req.params["queue"];
  const authorization = req.headers.authorization;
  const queue = await queues.findById(id);

  if (!authorization)
    return res.status(404).send({
      status: 404,
      message: "Missing authorization",
    });

  if (!queue)
    return res.status(404).send({
      status: 404,
      message: "Queue not found!",
    });

  const user = await users.findOne({ account_token: authorization });

  if (!user)
    return res.status(404).send({
      status: 404,
      message: "User not found!",
    });

  const follower = await followers.findOne({
    _user: user._id,
    _queue: queue._id,
  });

  if (!follower)
    return res.status(404).send({
      status: 403,
      message: "You are not following this user!",
    });

  await followers.deleteOne({ _id: follower._id });

  return res.status(200).send({
    status: 200,
    message: `You're not following ${queue.name} anymore!`,
  });
};
