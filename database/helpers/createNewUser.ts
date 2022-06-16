import { users } from "..";
import { User } from "../../src/types/user";
import crypto from "crypto";

export default async (user: User) => {
  try {
    const accountToken = crypto.randomBytes(30).toString("hex");

    const newUser = new users({
      _id: user.id,
      username: user.username,
      account_token: accountToken,
      country: {
        name: user.country.code.toLowerCase(),
        code: user.country.name,
      },
    });

    await newUser.save();

    const u = users.findById(user.id);

    return {
      status: 200,
      data: u,
    };
  } catch (e: any) {
    console.error(e);

    return { status: 500, message: e.message };
  }
};
