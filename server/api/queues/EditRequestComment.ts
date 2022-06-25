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

  const request = await requests.findById(_request);

  if (request == null)
    return res.status(404).send({
      status: 404,
      message: "Request not found!",
    });

  const queue = await queues.findById(request._queue);

  if (queue == null)
    return res.status(404).send({
      status: 404,
      message: "Queue not found!",
    });

  const owner = await users.findById(request._owner);

  if (owner == null)
    return res.status(404).send({
      status: 404,
      message: "User not found!",
    });

  if (authorization != owner.account_token)
    return res.status(400).send({
      status: 401,
      message: "Unauthorized",
    });

  let comment = req.query.comment;

  if (!comment)
    return res.status(400).send({
      status: 400,
      message: "Invalid comment provided",
    });

  comment = comment.toString().trim();

  await requests.updateOne(
    { _id: _request },
    {
      comment: comment,
    }
  );

  res.status(200).send({
    status: 200,
    message: "Request updated!",
  });
};
