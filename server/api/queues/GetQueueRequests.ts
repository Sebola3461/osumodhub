import { Request, Response } from "express";
import { requests } from "../../../database";

export default async (req: Request, res: Response) => {
  const queue = req.params["queue"];
  let r = await requests.find({ _queue: queue });

  const type = req.query.type || "progress";
  const status = req.query.status || "any";

  if (type == "archived") {
    r = r.filter((r) => r.status == "archived");
  } else {
    r = r.filter((r) => r.status != "archived");
  }

  const validQueueStatus = [
    "pending",
    "archived",
    "accepted",
    "rejected",
    "waiting",
    "rechecking",
    "nominated",
    "finished",
  ];

  if (validQueueStatus.includes(String(status))) {
    r = r.filter((r) => r.status == status);
  }

  return res.status(200).send({
    status: 200,
    data: r,
  });
};
