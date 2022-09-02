import axios, { AxiosError } from "axios";
import querystring from "querystring";
import { consoleCheck, consoleError, consoleLog } from "../../helpers/logger";

export default async (token: string) => {
  try {
    consoleLog("ValidateOsuToken", "Validating a new OAuth code...");

    const req = await axios("https://osu.ppy.sh/oauth/token", {
      method: "POST",
      data: querystring.stringify({
        client_id: process.env.OSU_CLIENT_ID,
        client_secret: process.env.OSU_CLIENT_SECRET,
        code: token,
        grant_type: "authorization_code",
        redirect_uri: encodeURI(process.env.OSU_REDIRECT_URI || ""),
      }),
    });

    consoleCheck("ValidateOsuToken", "Token validated!");

    return {
      status: 200,
      data: req.data,
    };
  } catch (e: any) {
    consoleError(
      "ValidateOsuToken",
      `Impossible to validate token! Request failed with code ${e.status}. Check logs below:`
    );
    console.error(e.message);

    return {
      status: 500,
      message: e.message,
    };
  }
};
