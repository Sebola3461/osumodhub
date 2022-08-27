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

  const { difficulty, comment } = req.body;

  if (!difficulty || !comment)
    return res.status(400).send({
      status: 400,
      message: "Missing difficulty_id or comment!",
    });

  if (comment.length > 500)
    return res.status(400).send({
      status: 400,
      message: "Comment length too big, max 400 characters!",
    });

  const target_diff = request.difficulties.find((r) => r.id == difficulty);

  if (!target_diff)
    return res.status(404).send({
      status: 404,
      message: "Difficulty not found!",
    });

  if (target_diff.user != null)
    return res.status(400).send({
      status: 400,
      message: "This difficulty is already claimed!",
    });

  const newRequest = new gdusers({
    _id: crypto.randomBytes(30).toString("hex"),
    _owner: author._id,
    _owner_name: author.username,
    comment: comment.trim(),
    beatmapset_id: request.beatmapset_id,
    beatmap: request.beatmap,
    status: "waiting",
    request_id: request._id,
    difficulty: target_diff.id,
    difficulty_data: target_diff,
    date: new Date(),
  });

  await newRequest.save();

  // const difficulty_index = request.difficulties.findIndex(
  //   (r) => r.id == difficulty
  // );

  // request.difficulties[difficulty_index].user = author._id;

  request.pending = true;
  await gds.findByIdAndUpdate(request._id, request);

  res.status(200).send({
    status: 200,
    message: "Difficulty claim request sent!",
  });
};
