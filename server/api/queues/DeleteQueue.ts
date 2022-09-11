import { Request, Response } from "express";
import { queues, requests, users } from "../../../database";
import osuApi from "../../helpers/osuApi";
import crypto from "crypto";
import getHighestUsergroup from "../helpers/getHighestUsergroup";
import axios from "axios";

export default async (req: Request, res: Response) => {
  const authorization = req.headers.authorization;
  const id = req.params.queue;

  if (!authorization)
    return res.status(403).send({
      status: 403,
      message: "Missing authorization",
    });

  const targetQueue = await queues.findById(id);

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

  await queues.deleteOne({ _id: targetQueue._id });
  requests.deleteMany({ _queue: targetQueue._id });

  res.status(200).send({
    status: 200,
    message: "Group deleted!",
  });
};
