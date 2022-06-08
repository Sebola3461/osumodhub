import { Request, Response } from "express";
import { followers, queues, users } from "../../../database";
import crypto from "crypto";

export default async (req: Request, res: Response) => {
  const id = req.params["queue"];
  const queue = await queues.findById(id);

  if (!queue)
    return res.status(404).send({
      status: 404,
      message: "Queue not found!",
    });

  const _followers = await followers.find({ _queue: queue._id });

  return res.status(200).send({
    status: 200,
    data: _followers,
  });
};
