import { Request, Response } from "express";
import { queues, users } from "../../../database";
import isQueueManager from "../../helpers/isQueueManager";

export default async (req: Request, res: Response) => {
  const id = req.params["queue"];
  const authorization = req.headers.authorization;
  let queue = await queues.findById(id);

  if (!queue)
    return res.status(404).send({
      status: 404,
      message: "Queue not found!",
    });

  if (!authorization) removeSensitiveData();

  const manager = await users.findOne({ owner: queue.owner });

  if (manager == null) removeSensitiveData();

  if (manager._id != queue.owner && !queue.isGroup) removeSensitiveData();

  if (queue.isGroup && !isQueueManager(queue, manager, authorization || ""))
    removeSensitiveData();

  function removeSensitiveData() {
    queue.webhook = null;
  }

  if (!queue.webhook) {
    queue.webhook = {
      url: "",
      notify: [],
    };
  }

  function isInactive() {
    if (
      queue.lastSeen != null &&
      new Date().getDay() - new Date(queue.lastSeen).getDay() >= 30
    )
      return true;

    return false;
  }

  const _queue = JSON.parse(JSON.stringify(queue));

  _queue.inactive = isInactive();

  return res.status(200).send({
    status: 200,
    data: _queue,
  });
};
