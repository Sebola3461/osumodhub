import { Request, Response } from "express";
import { users } from "../../../database";
import getUserBeatmaps from "../helpers/getUserBeatmaps";

export default async (req: Request, res: Response) => {
  const authorization = req.headers.authorization;
  const requestedUser = req.params["user"];

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
      status: 400,
      message: "Unauthorized",
    });

  const userBeatmaps = await getUserBeatmaps(user._id);

  if (userBeatmaps.status != 200 || !userBeatmaps.data)
    return res.status(userBeatmaps.status).send({
      status: userBeatmaps.status,
      message: userBeatmaps.message,
    });

  return res.status(200).send({
    status: 200,
    message: "Found!",
    data: userBeatmaps.data,
  });
};
