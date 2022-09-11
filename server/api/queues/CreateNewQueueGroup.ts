import { Request, Response } from "express";
import { queues, requests, users } from "../../../database";
import osuApi from "../../helpers/osuApi";
import crypto from "crypto";
import NotifyQueueAdminAdd from "../../notifications/NotifyQueueAdminAdd";

export default async (req: Request, res: Response) => {
  try {
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

    const modesInt: any[] = ["osu", "taiko", "fruits", "mania"];

    const admins = req.body.admins;

    if (!admins)
      return res.status(400).send({
        status: 400,
        message: "You should provide at last one admin!",
      });

    if (typeof admins != "object" || !admins.length)
      return res.status(400).send({
        status: 400,
        message: "Invalid admins!",
      });

    if (admins.length > 20 || admins.length < 1)
      return res.status(400).send({
        status: 400,
        message: "Groups queues can have up to 20 administrators!",
      });

    const sanitizedAdmins: string[] = [];

    for (const id of admins) {
      const userdb = await users.findById(id);

      if (userdb) sanitizedAdmins.push(id);
    }

    if (sanitizedAdmins.length < 1)
      return res.status(400).send({
        status: 400,
        message: "Invalid admins!",
      });

    let icon = req.body.icon;

    if (!icon || icon.toString().trim().length == 0)
      icon = "https://a.ppy.sh/".concat(
        crypto.randomBytes(10).toString("hex").slice(10)
      );

    let banner = req.body.banner;

    if (!banner || banner.toString().trim().length == 0)
      banner =
        "https://raw.githubusercontent.com/ppy/osu-web/master/public/images/headers/generic%402x.jpg";

    const name = req.body.name;

    if (
      !name ||
      typeof req.body.name != "string" ||
      req.body.name.trim() == "" ||
      req.body.name.length > 30
    )
      return res.status(400).send({
        status: 400,
        message:
          "Invalid queue name! Group names can have up to 30 characters.",
      });

    const queueId = crypto.randomBytes(10).toString("hex").slice(10);

    const newQueue = new queues({
      _id: queueId,
      owner: author._id,
      isGroup: true,
      banner: banner,
      name: name,
      icon: icon,
      type: "group",
      modes: [modesInt.findIndex((m) => m == user.data.playmode)],
      admins: sanitizedAdmins,
      country: {
        acronym: "",
        name: "",
        flag: "",
      },
    });

    await newQueue.save();

    const newQueueResponse = await queues.findById(queueId);

    sanitizedAdmins.forEach(async (admin) => {
      const user = await users.findById(admin);

      if (user) {
        NotifyQueueAdminAdd(newQueueResponse, user, author.username);
      }
    });

    res.status(200).send({
      status: 200,
      message: "Queue created!",
      data: newQueueResponse,
    });
  } catch (e) {
    console.error(e);

    res.status(500).send({
      status: 500,
      message: "Internal server error",
    });
  }
};
