import { Request, Response } from "express";
import { queues } from "../../../database";

export default async (req: Request, res: Response) => {
  const id = req.params["queue"];
  const queue = await queues.findById(id);

  return res.status(200).send({
    status: 200,
    data: queue,
  });
};
