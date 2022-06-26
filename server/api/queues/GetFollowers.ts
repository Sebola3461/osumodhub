import { Request, Response } from "express";
import { followers, queues, users } from "../../../database";
import crypto from "crypto";

export default async (req: Request, res: Response) => {
  const id = req.params["queue"];
  const queue = await queues.findById(id);
  const authorization = req.headers["authorization"];

  if (!queue)
    return res.status(404).send({
      status: 404,
      message: "Queue not found!",
    });

  const _followers = await followers.find({ _queue: queue._id });

  const response: { size: number; mutual: null | boolean } = {
    size: _followers.length,
    mutual: null,
  };

  if (authorization) {
    const user = await users.findOne({ account_token: authorization });

    if (user == null)
      return res.status(404).send({
        status: 404,
        message: "User not found!",
      });

    if (_followers.find((f) => f._user == user._id)) {
      response.mutual = true;
    } else {
      response.mutual = false;
    }
  }

  return res.status(200).send({
    status: 200,
    data: response,
  });
};
