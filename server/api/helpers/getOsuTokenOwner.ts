import axios from "axios";
import { User } from "./../../../src/types/user";

export default async (token: string) => {
  try {
    const req = await axios("https://osu.ppy.sh/api/v2/me", {
      method: "get",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    let res: User = req.data;

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
