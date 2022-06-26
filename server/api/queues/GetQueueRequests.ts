import { Request, Response } from "express";
import osuApi from "./../../helpers/osuApi";
import { requests } from "../../../database";
import { consoleError } from "../../helpers/logger";

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

  let requestsWithoutBeatmap = r;
  r = [];

  for (const req of requestsWithoutBeatmap) {
    try {
      if (type != "archived") {
        const b = await osuApi.fetch.beatmapset(req.beatmapset_id);

        if (b.status == 200) {
          req.beatmap = b.data;
        }
      }

      r.push(req);
    } catch (e: any) {
      consoleError("GetQueueRequests", e);
    }
  }

  return res.status(200).send({
    status: 200,
    data: r,
  });
};
