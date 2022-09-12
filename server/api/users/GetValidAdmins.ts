import { Request, Response } from "express";
import { users } from "../../../database";

export default async (req: Request, res: Response) => {
  const allUsers = await users.find();

  function getPartial(user: any) {
    return {
      _id: user._id,
      username: user.username,
      isBn: user.isBn,
    };
  }

  const partialUsers = allUsers.map((u) => getPartial(u));

  return res.status(200).send({
    status: 200,
    data: partialUsers,
  });
};
