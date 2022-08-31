import { EmbedBuilder, WebhookClient } from "discord.js";
import { Request, Response } from "express";
import { queues, users } from "../../../database";

export default async (req: Request, res: Response) => {
  try {
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

    const webhookClient = new WebhookClient({
      url: queue.webhook.url,
    });

    await webhookClient.send({
      username: `${queue.name} queue (osu!modhub)`,
      avatarURL:
        "https://cdn.discordapp.com/icons/918873494878572544/0c848260a94500ab09ad1c8bccc088f4.webp",
      embeds: [
        new EmbedBuilder({
          title: "This is a test webhook!",
          description:
            "A test was been requested from the queue panel settings",
        }).setColor("#d3025c"),
      ],
    });

    res.status(200).send({
      status: 200,
      message: "Everything is working!",
    });
  } catch (e) {
    console.error(e);

    res.status(500).send({
      status: 500,
      message: "Something is wrong with your webhook.",
    });
  }
};