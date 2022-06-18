import { followers } from "../../../database";
import { IQueue } from "../../../src/types/queue";
import NotifyFollowedQueueStatus from "../../notifications/NotifyFollowedQueueStatus";

export default async (queue: IQueue) => {
  const qfollowers = await followers.find({ _queue: queue._id });

  for (const follower of qfollowers) {
    NotifyFollowedQueueStatus(queue, follower);
  }
};
