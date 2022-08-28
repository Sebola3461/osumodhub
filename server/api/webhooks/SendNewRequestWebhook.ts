import { EmbedBuilder, WebhookClient } from "discord.js";
import { consoleLog, consoleCheck } from "../../helpers/logger";

export default async (queue: any, request: any) => {
  try {
    consoleLog(
      "SendNewRequestWebhook",
      `Sending new request webhook for (${queue._id})`
    );

    if (!queue.webhook.url || queue.webhook.url.trim() == "") return;

    const webhookClient = new WebhookClient({
      url: queue.webhook.url,
    });

    await webhookClient.send({
      username: `${queue.name} queue (osu!modhub)`,
      avatarURL:
        "https://cdn.discordapp.com/icons/918873494878572544/0c848260a94500ab09ad1c8bccc088f4.webp",
      embeds: [
        new EmbedBuilder({
          title: "📬 New beatmap requested!",
          description: `${request._owner_name} has requested the beatmap [**${request.beatmap.artist} - ${request.beatmap.title}**](https://osu.ppy.sh/s/${request.beatmapset_id})!`,
          image: {
            url: request.beatmap.covers["cover@2x"],
          },
          thumbnail: {
            url: `https://a.ppy.sh/${request._owner}`,
          },
          timestamp: new Date(),
        }).setColor("#ff7c00"),
      ],
    });

    consoleCheck(
      "SendNewRequestWebhook",
      `New request webhook sent for (${queue._id})`
    );
  } catch (e) {
    console.error(e);
  }
};
