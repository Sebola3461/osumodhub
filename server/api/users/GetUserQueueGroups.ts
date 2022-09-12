import { Request, Response } from "express";
import { queues, users } from "../../../database";
import getUserBeatmaps from "../helpers/getUserBeatmaps";

export default async (req: Request, res: Response) => {
  const authorization = req.headers.authorization;

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

  const userGroups = await queues.find({ admins: user._id });
  const owner = await queues.find({ owner: user._id, isGroup: true });

  const response = (owner ? owner : []).concat(userGroups ? userGroups : []);

  return res.status(200).send({
    status: 200,
    message: "Found!",
    data: response,
  });
};
