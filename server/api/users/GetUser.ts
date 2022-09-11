import { Request, Response } from "express";
import { users } from "../../../database";

export default async (req: Request, res: Response) => {
  const id = req.params["user"];
  const user = await users.findById(id);
  const authorization = req.headers.authorization;

  if (!authorization) return sendPartial();

  if (authorization != user.account_token) return sendPartial();

  if (!user)
    return res.status(404).send({
      status: 404,
      message: "User not found!",
    });

  function sendPartial() {
    return res.status(200).send({
      status: 200,
      data: {
        _id: user._id,
        username: user.username,
        isBn: user.isBn,
        hasQueue: user.hasQueue,
        banner: user.banner,
        country: user.country,
      },
    });
  }

  return res.status(200).send({
    status: 200,
    data: user,
  });
};
