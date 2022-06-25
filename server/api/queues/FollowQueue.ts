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

  if (user._id == queue._id)
    return res.status(400).send({
      status: 400,
      message: "You can't follow yourself.",
    });

  const follower = await followers.findOne({ _user: user._id, _queue: id });

  if (follower)
    return res.status(404).send({
      status: 403,
      message: "You already follow this user!",
    });

  const newFollower = new followers({
    _id: crypto.randomBytes(30).toString("hex"),
    _user: user._id,
    _queue: queue._id,
    created_at: new Date(),
  });

  await newFollower.save();

  return res.status(200).send({
    status: 200,
    message: `You're following ${queue.name} now!`,
  });
};
