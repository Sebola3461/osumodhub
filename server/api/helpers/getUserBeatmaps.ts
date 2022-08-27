import axios from "axios";
import { Beatmapset } from "../../../src/types/beatmap";

export default async (
  user_id: string,
  status?: string,
  offset?: string | number
) => {
  try {
    const req = await axios(
      `https://osu.ppy.sh/api/v2/users/${user_id}/beatmapsets/${
        status || "pending"
      }?limit=100&offset=${offset}`,
      {
        method: "get",
        headers: {
          authorization: `Bearer ${process.env.OSU_API_ACCESS_TOKEN}`,
        },
      }
    );

    let res: Beatmapset[] = req.data;

    return {
      status: 200,
      data: res,
    };
  } catch (e: any) {
    console.error(e);

    return {
      status: 500,
      message: e.message,
    };
  }
};
