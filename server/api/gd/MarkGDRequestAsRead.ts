import { Request, Response } from "express";
import { gds, gdusers, queues, requests, users } from "../../../database";
import crypto from "crypto";

export default async (req: Request, res: Response) => {
  let target = req.params.id;
  const authorization = req.headers.authorization;

  if (!authorization)
    return res.status(403).send({
      status: 403,
      message: "Missing authorization",
    });

  const author = await users.findOne({ account_token: authorization });

  if (author == null)
    return res.status(404).send({
      status: 404,
      message: "User not found!",
    });

  if (authorization != author.account_token)
    return res.status(401).send({
      status: 401,
      message: "Unauthorized",
    });

  const request = await gds.findById(target);

  if (!request)
    return res.status(404).send({
      status: 404,
      message: "Not found!",
    });

  request.pending = false;
  await gds.findByIdAndUpdate(request._id, request);

  res.status(200).send({
    status: 200,
  });
};
