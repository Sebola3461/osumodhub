import { Request, Response } from "express";
import { users } from "../../../database";
import createNewUser from "../../../database/helpers/createNewUser";
import getOsuTokenOwner from "../helpers/getOsuTokenOwner";
import validateOsuToken from "../helpers/validateOsuToken";
import path from "path";

export default async (req: Request, res: Response) => {
  try {
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

    if (tokenOwner.status != 200)
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

    return res.status(200).send(
      `<html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Please wait...</title>
        </head>
        <body><script>window.postMessage(JSON.stringify({ _id: ${user_db._id}, username: "${user_db.username}", hasQueue: ${user_db.hasQueue}, account_token: "${user_db.account_token}" }));</script></body>
      </html>`
    );
  } catch (e: any) {
    console.error(e);

    return res.status(500).send({
      status: 500,
      message: "Internal server error",
    });
  }
};
