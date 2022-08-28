import axios from "axios";
import { Request, Response } from "express";
import { requests, users } from "../../../database";
import { beatmapset } from "../../helpers/fetcher/beatmap";
import { consoleCheck, consoleLog } from "../../helpers/logger";
import crypto from "crypto";

export default async (req: Request, res: Response) => {
  try {
    const queueOwner = await users.findOne({
      account_token: req.headers.authorization,
    });

    if (!queueOwner)
      return res.status(404).send({
        status: 404,
        message: "Queue not found!",
      });

    const osumodData: any[] = (
      await axios(
        encodeURI(
          `https://osumod.com/api/requests?archived=false&target=${queueOwner.username}`
        )
      )
    ).data;

    const queueRequests = await requests.find({ _queue: queueOwner._id });

    for (const request of osumodData) {
      if (!queueRequests.find((r) => r.beatmapset_id == request.mapsetId)) {
        try {
          importRequest(request);
        } catch (e) {
          console.error(e);
        }
      }
    }

    async function importRequest(request: any) {
      consoleLog("OsumodImport", `Importing request ${request._id}`);
      const b_data = await beatmapset(request.mapsetId);

      if (!b_data.data || b_data.status != 200 || !b_data.data.beatmaps) return;

      function isCross() {
        return b_data.data.user_id.toString() == request.user.toString();
      }

      const r = new requests({
        _id: crypto.randomBytes(30).toString("hex").slice(30),
        _queue: queueOwner._id,
        _owner: request.user,
        _owner_name: request.creator,
        comment: request.comment,
        status: request.status.toLowerCase(),
        beatmapset_id: request.mapsetId,
        date: request.requestDate,
        cross: !isCross(),
        reply: request.feedback,
        beatmap: {
          id: b_data.data.id,
          artist: b_data.data.artist,
          title: b_data.data.title,
          covers: b_data.data.covers,
          creator: b_data.data.creator,
        },
      });

      await r.save();

      consoleCheck("OsumodImport", `Request ${request._id} imported!`);
    }

    res.status(200).send({
      status: 200,
      message: "Import started! This can take some minutes...",
    });
  } catch (e) {
    console.error(e);

    res.status(500).send({
      status: 500,
      message: "Internal server error",
    });
  }
};