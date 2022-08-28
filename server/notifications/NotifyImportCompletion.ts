import { notifications } from "../../database";
import { IQueue } from "../../src/types/queue";
import crypto from "crypto";
import { consoleCheck, consoleLog } from "../helpers/logger";

export default async (queue: IQueue | any, size: number) => {
  consoleLog(
    "NotifyImportCompletion",
    `Generating new import notification for ${queue.name} (${queue._id})`
  );

  const id = crypto.randomBytes(30).toString("hex");

  const notification = new notifications({
    _id: id,
    _user: queue._id,
    _user_name: queue.name || queue.username,
    content: `${size} requests are imported from your osumod queue!`,
    type: "queue:request",
    created_at: new Date(),
  });

  await notification.save();

  consoleCheck(
    "NotifyImportCompletion",
    `Import notification for ${queue.name || queue.username} (${
      queue._id
    }) generated!`
  );
};
