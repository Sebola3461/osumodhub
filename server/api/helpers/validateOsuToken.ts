import axios from "axios";
import querystring from "querystring";

export default async (token: string) => {
  try {
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

    return {
      status: 200,
      data: req.data,
    };
  } catch (e: any) {
    console.error(e);

    return {
      status: 500,
      message: e.message,
    };
  }
};
