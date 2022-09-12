import { IQueue } from "../types/queue";

export default (queue: IQueue, login: any) => {
  if (login._id == queue.owner) return true;

  if (queue.admins.includes(login._id.toString())) return true;

  return false;
};
