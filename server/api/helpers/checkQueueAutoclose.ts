import { queues, requests } from "../../../database";

export default async (queue: any) => {
  if (!queue.autoclose.enable) return void {};

  const queue_requests = await requests.find({
    _queue: queue._id,
    status: "pending",
  });

  if (queue_requests.length >= queue.autoclose.size)
    await queues.updateOne(
      { _id: queue._id },
      {
        open: false,
      }
    );

  return void {};
};
