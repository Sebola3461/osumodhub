import { Request, Response } from "express";
import { notifications, users } from "../../../database";

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

  if (authorization != user.account_token)
    return res.status(400).send({
      status: 400,
      message: "Unauthorized",
    });

  await notifications.deleteMany({ _user: user._id });

  return res.status(200).send({
    status: 200,
    message: "Notifications cleared!",
  });
};
