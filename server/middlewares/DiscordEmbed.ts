import { NextFunction, Request, Response } from "express";
import { getName } from "../helpers/general/getName";
import { queues } from "./../../database";

function Nonce(length: number) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export default async (req: Request, res: Response, next: NextFunction) => {
  if (
    req.headers["user-agent"] !=
    "Mozilla/5.0 (compatible; Discordbot/2.0; +https://discordapp.com)"
  )
    return next();

  if (req.path.includes("queue")) return sendQueueEmbed();

  async function sendQueueEmbed() {
    const queue_id = req.path.split("/").pop();
    let queue = isNaN(Number(queue_id))
      ? await queues.findOne({ name: queue_id })
      : await queues.findById(queue_id);

    const typeColors = {
      modder: "#2196f3",
      group: "#c52d61",
      BN: "#a347eb",
      NAT: "#eb8c47",
    };

    if (queue == null) queue = await queues.findById(queue_id);

    if (queue == null)
      return res.status(404).send(`<html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="osu!modhub | Queue not found!">
      <meta property="og:site_name" content="osu!modhub">
      <meta property="og:url" content="https://osumodhub.xyz/">
      <meta property="og:description" content="osu!modhub provides mapping & modding tools for osu!">
      <meta property="og:type" content="profile">
       data-react-helmet="true" name="theme-color" />
      <meta name="twitter:card" content="summary_large_image">
      <title>osu!modhub | Queue not found!</title>
    </head>
  </html>`);

    res.status(200).send(`<html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta property="og:title" content="osu!modhub | ${
            !queue.isGroup ? `${getName(queue)} queue` : queue.name
          }">
          <meta property="og:site_name" content="osu!modhub">
          <meta property="og:url" content="https://osumodhub.xyz/queue/${
            queue._id
          }">
          <meta content="${
            typeColors[queue.type]
          }" data-react-helmet="true" name="theme-color" />
          <meta content="${queue.icon}?nonce=${Nonce(
      40
    )}" property="og:image" />
          <meta property="og:description" content="osu!modhub provides mapping & modding tools for osu!">
          <meta property="og:type" content="profile">
          <title>osu!modhub | ${
            !queue.isGroup ? `${getName(queue)} queue` : queue.name
          }</title>
        </head>
      </html>`);
  }
};
