import { Request, Response } from "express";
import { queues, users } from "../../../database";

export default async (req: Request, res: Response) => {
  const id = req.params["queue"];
  const authorization = req.headers.authorization;
  const queue = await queues.findById(id);

  if (!authorization) removeSensitiveData();

  const manager = await users.findOne({ owner: queue.owner });

  if (manager == null) removeSensitiveData();

  if (manager._id != queue.owner && !queue.isGroup) removeSensitiveData();

  if (
    queue.isGroup &&
    queue.owner != manager._id &&
    !queue.admins.includes(manager._id)
  )
    removeSensitiveData();

  function removeSensitiveData() {
    queue.webhook = null;
  }

  return res.status(200).send({
    status: 200,
    data: queue,
  });
};
