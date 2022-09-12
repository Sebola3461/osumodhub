import { Request, Response } from "express";
import { queues, users } from "../../../database";
import isQueueManager from "../../helpers/isQueueManager";

export default async (req: Request, res: Response) => {
  const id = req.params["queue"];
  const queue = await queues.findById(id);

  if (!queue)
    return res.status(404).send({
      status: 404,
      message: "Queue not found!",
    });

  const members: any[] = [];

  for (const admin of queue.admins) {
    const user = await users.findById(admin);

    if (user) {
      members.push(user);
    }
  }

  const owner = await users.findById(queue.owner);

  if (owner) {
    members.unshift({
      _id: owner._id,
      username: owner.username,
      isBn: owner.isBn,
    });
  }

  return res.status(200).send({
    status: 200,
    data: members.map((m) => {
      return { _id: m._id, username: m.username, isBn: m.isBn };
    }),
  });
};
