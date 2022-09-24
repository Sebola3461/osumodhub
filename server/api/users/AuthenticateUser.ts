import { Request, Response } from "express";
import { queues, users } from "../../../database";
import createNewUser from "../../../database/helpers/createNewUser";
import getOsuTokenOwner from "../helpers/getOsuTokenOwner";
import validateOsuToken from "../helpers/validateOsuToken";
import { consoleCheck, consoleLog } from "../../helpers/logger";

export default async (req: Request, res: Response) => {
  try {
    consoleLog(
      "AuthenticateUser",
      "New authentication requested! Waiting for token validation...",
      req
    );

    const code = req.query.code;

    if (!code)
      return res.status(400).send({
        status: 400,
        message: "Invalid code provided",
      });

    const osuTokens = await validateOsuToken(code.toString());

    if (osuTokens.status != 200)
      return res.status(osuTokens.status).send({
        status: osuTokens.status,
        message: osuTokens.message,
      });

    const tokenOwner = await getOsuTokenOwner(osuTokens.data.access_token);

    if (tokenOwner.status != 200 || !tokenOwner.data)
      return res.status(tokenOwner.status).send({
        status: tokenOwner.status,
        message: tokenOwner.message,
      });

    let user_db = await users.findById(tokenOwner.data.id);

    if (user_db == null) {
      const newUser = await createNewUser(tokenOwner.data);

      if (newUser.status != 200)
        res.status(tokenOwner.status).send({
          status: tokenOwner.status,
          message: tokenOwner.message,
        });

      user_db = newUser.data;
    }

    const userQueue = await queues.findById(user_db._id);

    if (userQueue) {
      users.findByIdAndUpdate(user_db._id, { hasQueue: true });
    }

    consoleCheck(
      "AuthenticateUser",
      `New user authenticated! ${user_db.username} (${user_db._id})`,
      req
    );

    const params = new URLSearchParams();

    params.set("id", user_db._id);
    params.set("username", user_db.username);
    params.set("hasQueue", user_db.hasQueue);
    params.set("account_token", user_db.account_token);

    return res.redirect(`/api/identify?${params.toString()}`);
  } catch (e: any) {
    console.error(e);

    return res.status(500).send({
      status: 500,
      message: "Internal server error",
    });
  }
};
