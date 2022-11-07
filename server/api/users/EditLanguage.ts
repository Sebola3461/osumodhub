import { Request, Response } from "express";
import { users } from "../../../database";
import { UserSettingsManager } from "../helpers/UserSettingsManager";
import validLanguages from "./../../localization/list";

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

    const language = req.body.language;

    if (
      !language ||
      typeof language != "string" ||
      !validLanguages.includes(language)
    )
      return res.status(400).send({
        status: 400,
        message: "Invalid language provided",
      });

    await users.updateOne(
      { _id: user._id },
      {
        language: language.trim(),
      }
    );

    return res.status(200).send({
      status: 200,
      message: "Language set!",
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
