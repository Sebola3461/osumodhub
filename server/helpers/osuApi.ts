import axios from "axios";
import {
  beatmap,
  beatmapset,
  featuredBeatmapsets,
  beatmapsetDiscussionPost,
  beatmapsetDiscussionVotes,
  userBeatmaps,
} from "./fetcher/beatmap";
import { user, userRecent } from "./fetcher/user";
const osu_client_id = process.env.OSU_CLIENT_ID;
const osu_client_secret = process.env.OSU_CLIENT_SECRET;

async function connect() {
  console.log("Refreshing server authorization token");

  let tokens: any = {};

  try {
    let _t = await axios("https://osu.ppy.sh/oauth/token", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        client_id: osu_client_id,
        client_secret: osu_client_secret,
        grant_type: "client_credentials",
        scope: "public",
      },
    });

    tokens = _t.data;

    // Auto-Refresh token
    setTimeout(connect, Number(tokens.expires_in) * 1000);

    process.env.OSU_API_ACCESS_TOKEN = tokens.access_token;

    console.log(tokens.access_token);

    console.log("Server authorization token refreshed");

    return tokens;
  } catch (e: any) {
    console.error("Error during token refresh:\n");
    console.error(e);

    setTimeout(connect, 5000);
    return tokens;
  }
}

connect();

export default {
  fetch: {
    beatmap: beatmap,
    beatmapset: beatmapset,
    featuredBeatmapsets: featuredBeatmapsets,
    beatmapsetDiscussionPost: beatmapsetDiscussionPost,
    beatmapsetDiscussionVotes: beatmapsetDiscussionVotes,
    user: user,
    userBeatmaps: userBeatmaps,
    userRecent: userRecent,
  },
};
