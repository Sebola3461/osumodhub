import { Request, Response } from "express";
import { users } from "../../../database";
import getUserBeatmaps from "../helpers/getUserBeatmaps";

export default async (req: Request, res: Response) => {
  const authorization = req.headers.authorization;
  const requestedUser = req.params["user"];
  const includeGraveyard = req.query["graveyard"];
  const includeWip = req.query["wip"];
  const offset = req.query["offset"];

  if (!authorization)
    return res.status(403).send({
      status: 403,
      message: "Missing authorization",
    });

  const user = await users.findById(requestedUser);

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

  const userBeatmaps = await getUserBeatmaps(user._id);

  if (userBeatmaps.status != 200 || !userBeatmaps.data)
    return res.status(userBeatmaps.status).send({
      status: userBeatmaps.status,
      message: userBeatmaps.message,
    });

  const result = userBeatmaps.data;

  if (
    Boolean(includeGraveyard?.toString()) == true ||
    Boolean(includeWip?.toString()) == true
  ) {
    const booleanWip = Boolean(includeWip?.toString());
    const booleanGraveyard = Boolean(includeGraveyard?.toString());

    const graveyardBeatmaps = await getUserBeatmaps(
      user._id,
      "graveyard",
      offset ? offset.toString() : 0
    );

    if (graveyardBeatmaps.status != 200 || !graveyardBeatmaps.data)
      return res.status(graveyardBeatmaps.status).send({
        status: graveyardBeatmaps.status,
        message: graveyardBeatmaps.message,
      });

    for (const b of graveyardBeatmaps.data) {
      if (booleanWip && b.status == "wip") result.push(b);
    }

    for (const b of graveyardBeatmaps.data) {
      if (booleanGraveyard && b.status == "graveyard") result.push(b);
    }
  }

  return res.status(200).send({
    status: 200,
    message: "Found!",
    data: result,
  });
};
