import { NextFunction, Request, Response } from "express";
import { queues } from "./../../database";

export default async (req: Request, res: Response, next: NextFunction) => {
  if (
    req.headers["user-agent"] !=
    "Mozilla/5.0 (compatible; Discordbot/2.0; +https://discordapp.com)"
  )
    return next();

  if (req.path.includes("queue")) return sendQueueEmbed();

  async function sendQueueEmbed() {
    const queue_id = req.path.split("/").pop();
    const queue = await queues.findById(queue_id);

    const typeColors: { [key: string]: string } = {
      modder: "#2196f3",
      BN: "#a347eb",
      NAT: "#eb8c47",
    };

    if (queue == null)
      return res.status(404).send(`<html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="osu!modhub | Queue not found!">
      <meta property="og:site_name" content="osu!modhub">
      <meta property="og:url" content="https://osumodhub.com/">
      <meta property="og:description" content="osu!modhub provides mapping & modding tools for osu!">
      <meta property="og:type" content="profile">
      <meta content="${
        typeColors[queue.type]
      }" data-react-helmet="true" name="theme-color" />
      <meta name="twitter:card" content="summary_large_image">
      <title>osu!modhub | Queue not found!</title>
    </head>
  </html>`);

    res.status(200).send(`<html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta property="og:title" content="osu!modhub | Sebola's queue">
          <meta property="og:site_name" content="osu!modhub">
          <meta property="og:url" content="https://osumodhub.com/queue/${
            queue._id
          }">
          <meta content="${
            typeColors[queue.type]
          }" data-react-helmet="true" name="theme-color" />
          <meta content="https://osumodhub.herokuapp.com/api/queues/${
            queue._id
          }/og?nonce=${crypto.randomUUID()}" property="og:image" />
          <meta name="twitter:card" content="summary_large_image">
          <meta property="og:description" content="osu!modhub provides mapping & modding tools for osu!">
          <meta property="og:type" content="profile">
          <title>osu!modhub | ${queue.name}'s queue</title>
        </head>
      </html>`);
  }
};
