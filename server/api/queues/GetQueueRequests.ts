import { Request, Response } from "express";
import osuApi from "./../../helpers/osuApi";
import { gds, requests } from "../../../database";
import { consoleError } from "../../helpers/logger";

export default async (req: Request, res: Response) => {
  const queue = req.params["queue"];
  let r = await requests.find({ _queue: queue });
  let gd = (await gds.find()).filter((r) => r.rawQueues.includes(queue));

  console.log(gd);

  r = r.concat(gd);

  const type = req.query.type || "progress";
  const status = req.query.status || "any";
  const includeBeatmap = req.query.includeBeatmap || "false";

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

  if (validQueueStatus.includes(String(status)) && status != "any") {
    r = r.filter((r) => r.status == status);
  }

  return res.status(200).send({
    status: 200,
    data: r,
  });
};
