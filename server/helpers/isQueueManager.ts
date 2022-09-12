import { IQueue } from "./../../src/types/queue";

export default (queue: IQueue, user: any, authorization: string) => {
  if (queue.isGroup) {
    if (user._id.toString() == queue.owner) return true;

    if (queue.admins.includes(user._id.toString())) return true;
  } else {
    if (user._id.toString() != queue.owner) return false;

    if (user.account_token != authorization) return false;

    return true;
  }

  return false;
};
