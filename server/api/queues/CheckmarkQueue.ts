import { Request, Response } from "express";
import { queues, requests, users } from "../../../database";

export default async (req: Request, res: Response) => {
  const authorization = req.headers.authorization;
  const id = req.params.id;

  if (!authorization)
    return res.status(403).send({
      status: 403,
      message: "Missing authorization",
    });

  const targetQueue = await queues.findById(id);

  if (!targetQueue)
    return res.status(404).send({
      status: 404,
      message: "Queue not found!",
    });

  const author = await users.findById(targetQueue.owner);

  if (author == null)
    return res.status(404).send({
      status: 404,
      message: "User not found!",
    });

  if (authorization != author.account_token)
    return res.status(400).send({
      status: 401,
      message: "Unauthorized",
    });

  await queues.updateOne(
    { _id: targetQueue._id },
    {
      lastSeen: new Date(),
    }
  );

  res.status(200).send({
    status: 200,
    message: "Queue unarchived!",
  });
};
