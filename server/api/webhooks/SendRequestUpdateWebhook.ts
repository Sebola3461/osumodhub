import { EmbedBuilder, WebhookClient } from "discord.js";
import { consoleLog, consoleCheck } from "../../helpers/logger";

export default async (queue: any, request: any, reply: string) => {
  consoleLog(
    "SendRequestUpdateWebhook",
    `Sending request update webhook for (${queue._id})`
  );

  const webhookClient = new WebhookClient({
    url: queue.webhook.url,
  });

  const texts = {
    accepted: "has been accepted!",
    rejected: "has been rejected!",
    finished: "has been finished!",
    ranked: "has been ranked!",
    archived: "has been archived!",
    waiting: "is waiting another nominator!",
    rechecking: "need to be rechecked!",
    nominated: "has been nominated!",
  };

  const colors = {
    rechecking: "#cf3274",
    accepted: "#25ca6a",
    finished: "#259bca",
    nominated: "#259bca",
    ranked: "#259bca",
    rejected: "#d4152f",
    waiting: "#f44336",
  };

  if (!queue.webhook.url) return;

  const embed = new EmbedBuilder({
    title: `📝 Request status updated!`,
    description: `Beatmap [**${request.beatmap.artist} - ${
      request.beatmap.title
    }**](https://osumodhub.xyz/queue/${queue._id}?r=${request._id}) by ${
      request._owner_name
    } **${texts[request.status]}**`,
    thumbnail: {
      url: `https://b.ppy.sh/thumb/${request.beatmapset_id}l.jpg`,
    },
    timestamp: new Date(),
  }).setColor(colors[request.status]);

  if (reply) {
    embed.addFields({
      name: "Feedback",
      value: reply,
    });
  }

  await webhookClient.send({
    username: `${queue.name} queue (osu!modhub)`,
    avatarURL:
      "https://cdn.discordapp.com/icons/918873494878572544/0c848260a94500ab09ad1c8bccc088f4.webp",
    embeds: [embed],
  });

  consoleCheck(
    "SendRequestUpdateWebhook",
    `Request update webhook sent for (${queue._id})`
  );
};
