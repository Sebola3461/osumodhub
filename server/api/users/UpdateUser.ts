import { Request, Response } from "express";
import { users } from "../../../database";
import { UserSettingsManager } from "../helpers/UserSettingsManager";

export default async (req: Request, res: Response) => {
  try {
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

    const rawTarget = req.query.target;

    const editable = ["color"];

    if (!rawTarget || rawTarget.toString().toLowerCase().trim() == "")
      return res.status(400).send({
        status: 400,
        message: "Invalid target provided",
      });

    const target = rawTarget.toString().toLowerCase().trim();

    if (!editable.includes(target))
      return res.status(400).send({
        status: 400,
        message: "Invalid target provided",
      });

    if (!req.body || !Object.keys(req.body).includes("value"))
      return res.status(400).send({
        status: 400,
        message: "Invalid form body!",
      });

    const manager = new UserSettingsManager(user);

    let result;
    switch (target) {
      case "color": {
        result = await manager.updateColor(req.body.value);

        break;
      }
    }

    return res.status(result.error ? 400 : 200).send({
      status: result.error ? 400 : 200,
      message: result.message,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).send({
      status: 500,
      message:
        "Can't save settings: Internal server error (Contact Sebola#3461)",
    });
  }
};
