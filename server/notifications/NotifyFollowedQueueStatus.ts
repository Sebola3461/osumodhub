import { notifications } from "../../database";
import { IQueue } from "../../src/types/queue";
import crypto from "crypto";
import { consoleLog, consoleCheck } from "../helpers/logger";

export default async (queue: IQueue, request: any) => {
  consoleLog(
    "NotifyFollowedQueueStatus",
    `Generating new queue open notification for (${queue._id}) followers`
  );

  const id = crypto.randomBytes(30).toString("hex");

  const notification = new notifications({
    _id: id,
    _user: request._user,
    _user_name: "$$system",
    content: `You're following ${queue.name}, and his queue is open!`,
    type: "queue:openfollow",
    created_at: new Date(),
    extra: {
      queue_id: queue._id,
    },
  });

  await notification.save();

  consoleCheck(
    "NotifyFollowedQueueStatus",
    `Queue open notification for (${queue._id}) followers generated!`
  );
};
