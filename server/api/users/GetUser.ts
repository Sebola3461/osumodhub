import { Request, Response } from "express";
import { users } from "../../../database";

export default async (req: Request, res: Response) => {
  const id = req.params["user"];
  const user = await users.findById(id);

  return res.status(200).send({
    status: 200,
    data: user,
  });
};
