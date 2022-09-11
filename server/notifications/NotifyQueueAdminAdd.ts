import { notifications } from "../../database";
import { IQueue } from "../../src/types/queue";
import crypto from "crypto";
import { consoleCheck, consoleLog } from "../helpers/logger";

export default async (queue: IQueue, user: any, ownerName: string) => {
  consoleLog(
    "NotifyQueueAdminAdd",
    `Generating notification for ${queue.name} (${queue._id})`
  );

  const id = crypto.randomBytes(30).toString("hex");

  const notification = new notifications({
    _id: id,
    _user: user._id,
    _user_name: user.username,
    content: `You're a member of <b>${queue.name}</b> group now! ${ownerName} has added you as administrator. Check "My groups" tab in your Side Menu`,
    type: "queue:update",
    created_at: new Date(),
  });

  await notification.save();

  consoleCheck(
    "NotifyQueueAdminAdd",
    `Notification for ${queue.name} (${queue._id}) generated!`
  );
};
