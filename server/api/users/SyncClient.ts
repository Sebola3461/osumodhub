import { Request, Response } from "express";
import { notifications, queues, users } from "../../../database";
import { RelativeDay } from "../../../src/helpers/RelativeDay";
import osuApi from "../../helpers/osuApi";
import NotifyQueueInactive from "../../notifications/NotifyQueueInactive";
import getHighestUsergroup from "../helpers/getHighestUsergroup";

export default async (req: Request, res: Response) => {
  const authorization = req.headers.authorization;

  const params = {
    hasQueue: false,
  };

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

  const queue = await queues.findById(author._id);

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

  if (queue != null) {
    params.hasQueue = true;
  }

  const user = await osuApi.fetch.user(author._id);

  if (user.status != 200 || !user.data)
    return res.status(400).send({
      status: 400,
      message:
        "We can't sync your account! You don't have a osu! account or you're restricted. (Or osu!api sucks)",
    });

  const type = getHighestUsergroup(user.data);

  author.username = user.data.username;
  author.hasQueue = params.hasQueue;

  await queues.findByIdAndUpdate(author.id, queue);

  // ? Add bn flag to user
  if (["BN", "NAT"].includes(type)) {
    author.isBn = true;
    await users.findByIdAndUpdate(user.data.id, user);
  }

  const userQueues = await queues.find({ owner: author._id });

  function isInactive(queue: any) {
    if (RelativeDay(new Date(queue.lastSeen), new Date()) > 1) return true;

    return false;
  }

  const userNotifications = await notifications.find({ user: author._id });

  userQueues.forEach((q) => {
    if (isInactive(q)) {
      if (!userNotifications.find((n) => n.extra && n.extra.queue == q._id)) {
        NotifyQueueInactive(q);
      }
    }
  });

  res.status(200).send({
    status: 200,
    message: "User data updated!",
    data: {
      hasQueue: params.hasQueue,
      isBn: author.isBn,
      color: author.color,
      language: author.language,
      username: author.username,
    },
  });
};
