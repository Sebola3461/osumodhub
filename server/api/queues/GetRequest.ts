import { Request, Response } from "express";
import { queues, requests, users } from "../../../database";
import { beatmapset } from "../../helpers/fetcher/beatmap";

export default async (req: Request, res: Response) => {
  const _request = req.params["request"];

  const request = await requests.findById(_request);

  if (request == null)
    return res.status(404).send({
      status: 404,
      message: "Request not found!",
    });

  if (req.query.includeBeatmap == "true") {
    const s = await beatmapset(request.beatmapset_id);

    if (s.data && s.status == 200 && s.data.beatmaps) {
      request.beatmap = s.data;
    }
  }

  res.status(200).send({
    status: 200,
    data: request,
  });
};
