import { notifications } from "../../database";
import { IQueue } from "../../src/types/queue";
import crypto from "crypto";
import { consoleCheck, consoleLog } from "../helpers/logger";

export default async (queue: IQueue) => {
  consoleLog(
    "NotifyNewRequest",
    `Generating queue inactive notification for ${queue.name} (${queue._id})`
  );

  const id = crypto.randomBytes(30).toString("hex");

  const contents = {
    personalQueue: `Your personal queue is archived because it's inactive! Go to Settings > General > Unarchive queue to fix!`,
    otherQueue: `Your queue ${queue.name} is archived because it's inactive! Go to Settings > General > Unarchive queue to fix!`,
  };

  const notification = new notifications({
    _id: id,
    _user: queue.owner,
    _user_name: "$$system",
    content: contents[queue.isGroup ? "otherQueue" : "personalQueue"],
    type: "queue:alert",
    created_at: new Date(),
    extra: {
      queue: queue._id,
    },
  });

  await notification.save();

  consoleCheck(
    "NotifyNewRequest",
    `Queue inactive notification for ${queue.name} (${queue._id}) generated!`
  );
};
