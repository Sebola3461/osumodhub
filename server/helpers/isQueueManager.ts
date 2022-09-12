import { IQueue } from "./../../src/types/queue";

export default (queue: IQueue, user: any, authorization: string) => {
  if (queue.isGroup) {
    if (user._id == queue.owner) return true;

    if (queue.admins.includes(user._id)) return true;
  } else {
    if (user._id != queue.owner) return false;

    if (user.account_token != authorization) return false;

    return true;
  }

  return false;
};
