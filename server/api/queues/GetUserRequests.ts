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

  let requestsWithoutBeatmap = r;

  const beatmapCache: any[] = [];
  const requestsWithBeatmap: any[] = [];

  for (const req of requestsWithoutBeatmap) {
    try {
      let b = beatmapCache.find((b) => b.id == req.beatmapset_id);

      if (!b) {
        const newBeatmap = await osuApi.fetch.beatmapset(req.beatmapset_id);

        if (newBeatmap.status == 200) {
          req.beatmap = newBeatmap.data;
          beatmapCache.push(newBeatmap.data);
        } else {
          beatmapCache.push({ id: req.beatmapset_id, status: "Not Found" });
        }
      } else {
        req.beatmap = b;
      }

      requestsWithBeatmap.push(req);
    } catch (e: any) {
      consoleError("GetUserRequests", e);
    }
  }

  // TODO: Add typing
  const queueCache: any[] = [];
  const requestWithQueue: any[] = [];

  for (const req of requestsWithBeatmap) {
    try {
      const newReq = {
        _id: req._id,
        _queue: req._queue,
        _owner: req._owner,
        _owner_name: req._owner_name,
        comment: req.comment,
        beatmapset_id: req.beatmapset_id,
        beatmap: req.beatmap,
        status: req.status,
        queue: null,
      };

      let requestQueue = queueCache.find((q) => q._id == newReq._queue);

      if (!requestQueue) {
        const newQueue = await queues.findById(req._queue);
        newReq.queue = newQueue;
        queueCache.push(newQueue);
      } else {
        newReq.queue = requestQueue;
      }

      requestWithQueue.push(newReq);
    } catch (e: any) {
      console.error(e);
      consoleError("GetUserRequests", "osh caraio");
    }
  }

  return res.status(200).send({
    status: 200,
    data: requestWithQueue,
  });
};
