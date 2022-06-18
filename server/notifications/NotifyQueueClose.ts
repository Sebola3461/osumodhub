import { notifications } from "../../database";
import { IQueue } from "./../../src/types/queue";
import crypto from "crypto";
import { consoleLog, consoleCheck } from "../helpers/logger";

export default async (queue: IQueue) => {
  consoleLog(
    "NotifyNewRequest",
    `Generating new queue close notification for ${queue.name} (${queue._id})`
  );

  const id = crypto.randomBytes(30).toString("hex");

  const notification = new notifications({
    _id: id,
    _user: queue._id,
    _user_name: queue.name,
    content:
      "Your queue is closed because you scheduled a close using TimeClose function or selected a limit for pending requests.",
    type: "queue:state",
    created_at: new Date(),
  });

  await notification.save();

  consoleCheck(
    "NotifyNewRequest",
    `Queue close notification for ${queue.name} (${queue._id}) generated!`
  );
};
