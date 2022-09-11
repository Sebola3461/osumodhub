import { notifications } from "../../database";
import { IQueue } from "../../src/types/queue";
import crypto from "crypto";
import { consoleCheck, consoleLog } from "../helpers/logger";

export default async (queue: IQueue, user: any, requestOwner: any) => {
  consoleLog(
    "NotifyNewRequest",
    `Generating new request notification for ${queue.name} (${queue._id})`
  );

  const id = crypto.randomBytes(30).toString("hex");

  const notification = new notifications({
    _id: id,
    _user: user._id,
    _user_name: user.username,
    content: queue.isGroup
      ? `Check the new request by **${requestOwner.username}** in your group **${queue.name}**!.`
      : `Check the new request by **${requestOwner.username}** in your queue!.`,
    type: "queue:request",
    created_at: new Date(),
  });

  await notification.save();

  consoleCheck(
    "NotifyNewRequest",
    `Request notification for ${queue.name} (${queue._id}) generated!`
  );
};
