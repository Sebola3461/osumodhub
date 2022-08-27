import { Request, Response } from "express";
import { gds, queues, requests, users } from "../../../database";
import osuApi from "../../helpers/osuApi";
import crypto from "crypto";

export default async (req: Request, res: Response) => {
  const authorization = req.headers.authorization;

  if (!authorization)
    return res.status(403).send({
      status: 403,
      message: "Missing authorization",
    });

  const author = await users.findOne({ account_token: authorization });

  if (author == null)
    return res.status(404).send({
      status: 404,
      message: "User not found!",
    });

  if (authorization != author.account_token)
    return res.status(400).send({
      status: 401,
      message: "Unauthorized",
    });

  let { comment, beatmapset_id, difficulties, genres, tags } = req.body;

  const requestedBeatmapset = await osuApi.fetch.beatmapset(beatmapset_id);

  if (requestedBeatmapset.status != 200 || !requestedBeatmapset.data)
    return res.status(requestedBeatmapset.status).send({
      status: requestedBeatmapset.status,
      message: "Invalid beatmap",
    });

  if (!comment) comment = "";

  comment = comment.trim();

  if (
    !["pending", "graveyard", "wip"].includes(requestedBeatmapset.data.status)
  )
    return res.status(400).send({
      status: 400,
      message: `You can't post a request with a beatmap with this status!`,
    });

  const pending_request = await gds.findOne({
    _owner: author._id,
    beatmapset_id: requestedBeatmapset.data.id,
    status: "pending",
  });

  if (pending_request != null)
    return res.status(403).send({
      status: 403,
      message: `You already posted this!`,
    });

  const sanitizedDifficulties: {
    id: string;
    min_sr: number;
    max_sr: number;
    name: string;
    mode: number;
    user: null;
    updated_at: Date;
  }[] = [];

  if (
    !difficulties ||
    !difficulties.length ||
    difficulties.length > 200 ||
    difficulties.length < 1
  )
    return res.status(400).send({
      status: 400,
      message: `Invalid difficulties provided!`,
    });

  for (const difficulty of difficulties) {
    let checks = 0; // ? Need to be 4 to pass

    if (!isNaN(difficulty.min_sr) && difficulty.min_sr > 0.0) checks++;

    if (!isNaN(difficulty.max_sr) && difficulty.max_sr > 0.0) checks++;

    if (!isNaN(difficulty.mode)) {
      const modes = [0, 1, 2, 3];

      if (modes.includes(difficulty.mode)) checks++;
    }

    if (typeof difficulty.name == "string") checks++;

    if (checks == 4) {
      sanitizedDifficulties.push({
        id: crypto.randomBytes(30).toString("hex"),
        min_sr: difficulty.min_sr,
        max_sr: difficulty.max_sr,
        mode: difficulty.mode,
        name: difficulty.name,
        user: null,
        updated_at: new Date(),
      });
    }
  }

  if (sanitizedDifficulties.length == 0)
    return res.status(400).send({
      status: 400,
      message: "Invalid difficulties!",
    });

  if (genres && genres.length) {
    const sanitizedGenres = genres.filter((g: any) => typeof g == "string");

    if (sanitizedGenres.length < 0)
      return res.status(400).send({
        status: 400,
        message: "Invalid genres provided!",
      });

    genres = sanitizedGenres;
  }

  if (tags && tags.length) {
    const sanitiedTags = genres.filter((g: any) => typeof g == "string");

    if (sanitiedTags.length < 0)
      return res.status(400).send({
        status: 400,
        message: "Invalid tags provided!",
      });

    tags = sanitiedTags;
  }

  // ? Create request
  const request_id = crypto.randomBytes(30).toString("hex");
  const request = new gds({
    _id: request_id,
    _owner: author._id,
    _owner_name: author.username,
    comment: comment,
    status: "pending",
    beatmapset_id: requestedBeatmapset.data.id,
    date: new Date(),
    beatmap: {
      id: requestedBeatmapset.data.id,
      artist: requestedBeatmapset.data.artist,
      title: requestedBeatmapset.data.title,
      covers: requestedBeatmapset.data.covers,
      creator: requestedBeatmapset.data.creator,
    },
    genres,
    tags,
    difficulties: sanitizedDifficulties,
  });

  await request.save();

  request.beatmap = requestedBeatmapset.data;

  res.status(200).send({
    status: 200,
    message: "Beatmap posted!",
    data: request,
  });
};
