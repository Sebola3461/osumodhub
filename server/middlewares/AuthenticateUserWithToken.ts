import { NextFunction, Request, Response } from "express";
import { queues, users } from "../../database";

export default async (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization;

  if (!authorization)
    return res.status(403).send({
      status: 403,
      message: "Missing authorization",
    });

  const user = await users.findOne({ account_token: authorization });

  if (user == null)
    return res.status(401).send({
      status: 401,
      message: "Unauthorized",
    });

  return next();
};
