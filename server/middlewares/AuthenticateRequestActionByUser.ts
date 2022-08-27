import { NextFunction, Request, Response } from "express";
import { requests, users } from "../../database";

export default async (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization;
  const request = req.params.request;

  if (!request)
    return res.status(403).send({
      status: 403,
      message: "Invalid request",
    });

  if (!authorization)
    return res.status(403).send({
      status: 403,
      message: "Missing authorization",
    });

  const request_data = await requests.findById(request);

  if (request_data == null)
    return res.status(401).send({
      status: 401,
      message: "Queue not found!",
    });

  const request_owner = await users.findById(request_data._owner);

  if (request_owner.account_token != authorization)
    return res.status(401).send({
      status: 401,
      message: "Unauthorized",
    });

  return next();
};
