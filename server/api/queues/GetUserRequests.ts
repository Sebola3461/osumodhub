import { Request, Response } from "express";
import osuApi from "../../helpers/osuApi";
import { queues, requests } from "../../../database";
import { consoleError } from "../../helpers/logger";
import { Beatmapset } from "../../../src/types/beatmap";

export default async (req: Request, res: Response) => {
  const user = req.params["user"];
  let r = await requests.find({ _owner: user });

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

  if (validQueueStatus.includes(String(status)) && status != "archived") {
    r = r.filter((r) => r.status == status.toString());
  }

  // TODO: Add typing
  r.sort((a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf());

  return res.status(200).send({
    status: 200,
    data: r,
  });
};
