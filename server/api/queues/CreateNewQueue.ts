import { Request, Response } from "express";
import { queues, requests, users } from "../../../database";
import osuApi from "../../helpers/osuApi";
import crypto from "crypto";
import checkQueueAutoclose from "../helpers/checkQueueAutoclose";
import checkRequestQueueModes from "../helpers/checkRequestQueueModes";
import getHighestUsergroup from "../helpers/getHighestUsergroup";
import { GameModeName } from "../../../src/types/game_mode";

export default async (req: Request, res: Response) => {
  const authorization = req.headers.authorization;

  if (!authorization)
    return res.status(403).send({
      status: 403,
      message: "Missing authorization",
    });

  const author = await users.findOne({ account_token: authorization });
  const queue = await queues.findById(author._id);

  if (author == null)
    return res.status(404).send({
      status: 404,
      message: "User not found!",
    });

  if (queue != null)
    return res.status(404).send({
      status: 404,
      message: "You already have a queue!",
    });

  if (authorization != author.account_token)
    return res.status(400).send({
      status: 401,
      message: "Unauthorized",
    });

  const user = await osuApi.fetch.user(author._id);

  if (user.status != 200 || !user.data)
    return res.status(400).send({
      status: 400,
      message: "You don't have a osu! account or you're restricted.",
    });

  const type = getHighestUsergroup(user.data);

  const modesInt: any[] = ["osu", "taiko", "fruits", "mania"];

  const newQueue = new queues({
    _id: author._id,
    banner: user.data.cover.url,
    name: user.data.username,
    icon: `https://a.ppy.sh/${user.data.id}`,
    type: type,
    modes: [modesInt.findIndex((m) => m == user.data.playmode)],
    owner: author._id,
    country: {
      acronym: user.data.country.code,
      name: user.data.country.name,
      flag: `https://flagcdn.com/${user.data.country.code.toLowerCase()}.svg`,
    },
  });

  await newQueue.save();

  const newQueueResponse = await queues.findById(author._id);

  await users.updateOne(
    { _id: author._id },
    {
      hasQueue: true,
    }
  );

  res.status(200).send({
    status: 200,
    message: "Queue created. Welcome to osu!modhub",
    data: newQueueResponse,
  });
};
