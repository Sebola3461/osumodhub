import axios from "axios";
import { consoleCheck, consoleError, consoleLog } from "../../helpers/logger";
import { User } from "./../../../src/types/user";

export default async (token: string) => {
  try {
    consoleLog("GetOsuTokenOwner", "Fetching token owner...");

    const req = await axios("https://osu.ppy.sh/api/v2/me", {
      method: "get",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    let res: User = req.data;

    consoleCheck("GetOsuTokenOwner", "Token owner found!");

    return {
      status: 200,
      data: res,
    };
  } catch (e: any) {
    consoleError(
      "GetOsuTokenOwner",
      `Impossible to fetch token owner! Request failed with code ${e.status}. Check logs below:`
    );
    console.error(e.message);

    return {
      status: 500,
      message: e.message,
    };
  }
};
