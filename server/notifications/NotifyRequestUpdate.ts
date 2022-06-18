import { notifications, users } from "../../database";
import { IQueue } from "../../src/types/queue";
import crypto from "crypto";
import { consoleCheck, consoleLog } from "../helpers/logger";

export default async (queue: IQueue, request: any, status: string) => {
  const requestOwner = await users.findById(request._owner);

  if (!requestOwner) return;

  consoleLog(
    "NotifyNewRequest",
    `Generating new user request notification for ${requestOwner.name} (${requestOwner._id})`
  );

  const texts = {
    accepted: "has accepted",
    rejected: "has rejected",
    finished: "has finished",
    archived: "has archived",
    waiting: "is waiting another nominator for",
    rechecking: "need to recheck",
    nominated: "nominated",
  };

  const id = crypto.randomBytes(30).toString("hex");

  const notification = new notifications({
    _id: id,
    _user: requestOwner._id,
    _user_name: requestOwner.username,
    content: `[${queue.name}](/queue/${queue._id}) ${texts[status]} your beatmap ${request.beatmap.artist} - ${request.beatmap.title}.`,
    type: "request:update",
    created_at: new Date(),
    extra: {
      queue_id: queue._id,
    },
  });

  await notification.save();

  consoleCheck(
    "NotifyNewRequest",
    `User request notification for ${requestOwner.name} (${requestOwner._id}) generated!`
  );
};
