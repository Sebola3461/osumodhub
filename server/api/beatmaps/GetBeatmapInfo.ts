import { Request, Response } from "express";
import { users } from "../../../database";
import osuApi from "../../helpers/osuApi";

export default async (req: Request, res: Response) => {
  const authorization = req.headers.authorization;
  const requestedBeatmap = req.params["id"];

  if (!authorization)
    return res.status(403).send({
      status: 403,
      message: "Missing authorization",
    });

  const user = await users.findOne({ account_token: authorization });

  if (user == null)
    return res.status(404).send({
      status: 404,
      message: "User not found!",
    });

  if (authorization != user.account_token)
    return res.status(400).send({
      status: 401,
      message: "Unauthorized",
    });

  const beatmap = await osuApi.fetch.beatmapset(requestedBeatmap);

  if (beatmap.status != 200 || !beatmap.data)
    return res.status(beatmap.status).send({
      status: beatmap.status,
      message: "Something is wrong.",
    });

  return res.status(200).send({
    status: 200,
    message: "Found!",
    data: beatmap.data,
  });
};
