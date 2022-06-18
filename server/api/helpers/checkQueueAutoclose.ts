import { queues, requests } from "../../../database";
import NotifyQueueClose from "../../notifications/NotifyQueueClose";

export default async (queue: any) => {
  if (!queue.autoclose.enable) return void {};

  const queue_requests = await requests.find({
    _queue: queue._id,
    status: "pending",
  });

  if (queue_requests.length >= queue.autoclose.size) {
    if (!queue.open) {
      NotifyQueueClose(queue);
    }

    await queues.updateOne(
      { _id: queue._id },
      {
        open: false,
      }
    );
  }

  return void {};
};
