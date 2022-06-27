import { Request, Response } from "express";
import { queues, users } from "../../../database";
import osuApi from "../../helpers/osuApi";
import getHighestUsergroup from "../helpers/getHighestUsergroup";

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

  if (queue == null)
    return res.status(404).send({
      status: 404,
      message: "You don't have a queue!",
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
      message:
        "You don't have a osu! account or you're restricted. (Or osu!api sucks)",
    });

  const type = getHighestUsergroup(user.data);

  queue.banner = user.data.cover.url;
  queue.name = user.data.username;
  queue.type = type;

  if (queue.modes.length < 1) {
    const modesInt: any[] = ["osu", "taiko", "fruits", "mania"];

    queue.modes = [modesInt.findIndex((m) => m == user.data.playmode)];
  }

  await queues.findByIdAndUpdate(author.id, queue);

  // ? Add bn flag to user
  if (["BN", "NAT"].includes(type)) {
    author.isBn = true;
    await users.findByIdAndUpdate(user.data.id, user);
  }

  res.status(200).send({
    status: 200,
    message: "Queue data updated!",
  });
};
