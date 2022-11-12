import { notifications, users } from "../../database";
import { IQueue } from "../../src/types/queue";
import { Chat } from "../bancho/client";
import { consoleCheck, consoleLog } from "../helpers/logger";

export default async (queue: IQueue, request: any, status: string) => {
  const requestOwner = await users.findById(request._owner);

  if (!requestOwner) return;

  consoleLog(
    "BanchoRequestNotificationUpdate",
    `Generating new user request notification for ${requestOwner.name} (${requestOwner._id})`
  );

  const texts = {
    accepted: "is accepted",
    rejected: "is rejected",
    finished: "is finished",
    ranked: "is ranked",
    archived: "is archived",
    waiting: "is waiting for another nominator to be ranked",
    rechecking: "need to be rechecked",
    nominated: "is nominated",
  };

  function getFeedback() {
    if (request._managers.length == 0) return "";

    const r = request._managers[request._managers.length - 1];

    if (!r) return "";

    if (!r.feedback.trim()) return "";

    return `Feedback: "${r.feedback.trim()}"`;
  }

  Chat.getUserById(Number(request._owner)).then((u) => {
    u.sendMessage(
      `[osu!modhub Notification] Your beatmap [https://osu.ppy.sh/s/${
        request.beatmapset_id
      } ${request.beatmap.title} - ${request.beatmap.artist}] ${
        texts[request.status]
      } on [https://osumodhub.xyz/queue/${queue._id} ${
        queue.name
      }] queue. ${getFeedback()}`
    );
  });

  consoleCheck(
    "BanchoRequestNotificationUpdate",
    `User request notification for ${requestOwner.name} (${requestOwner._id}) generated!`
  );
};
