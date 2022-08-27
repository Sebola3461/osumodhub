import { Request, Response } from "express";
import { gds, gdusers, queues, requests, users } from "../../../database";
import osuApi from "../../helpers/osuApi";
import crypto from "crypto";

export default async (req: Request, res: Response) => {
  let target = req.params.id;
  let type = "id";

  if (isNaN(Number(target))) {
    type = "id";
  } else {
    type = "beatmap_id";
  }

  const request =
    type == "id"
      ? await gds.findById(target)
      : await gds.findOne({ beatmapset_id: target });

  if (!request)
    return res.status(404).send({
      status: 404,
      message: "Not found!",
    });

  const claims = await gdusers.find({ request_id: request._id });

  res.status(200).send({
    status: 200,
    data: claims,
  });
};
