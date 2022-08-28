import { EmbedBuilder, WebhookClient } from "discord.js";
import { consoleLog, consoleCheck } from "../../helpers/logger";

export default async (queue: any) => {
  consoleLog(
    "SendQueueUpdateWebhook",
    `Sending queue update webhook for (${queue._id})`
  );

  const webhookClient = new WebhookClient({
    url: queue.webhook.url,
  });

  if (!queue.webhook.url) return;

  await webhookClient.send({
    username: `${queue.name} queue (osu!modhub)`,
    avatarURL:
      "https://cdn.discordapp.com/icons/918873494878572544/0c848260a94500ab09ad1c8bccc088f4.webp",
    embeds: [
      new EmbedBuilder({
        title: `${queue.open ? "🟢" : "🔴"} Queue status changed!`,
        description: `${queue.name} ${
          queue.open
            ? "is accepting requests now!"
            : "isn't accepting requests anymore"
        }`,
        thumbnail: {
          url: `https://a.ppy.sh/${queue._id}`,
        },
        timestamp: new Date(),
      }).setColor(queue.open ? "#25ca6a" : "#d4152f"),
    ],
  });

  consoleCheck(
    "SendQueueUpdateWebhook",
    `Queue update webhook sent for (${queue._id})`
  );
};
