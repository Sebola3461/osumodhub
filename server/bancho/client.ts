import { BanchoClient } from "bancho.js";

export const Chat = new BanchoClient({
  username: process.env.IRC_USERNAME || "",
  password: process.env.IRC_PASSWORD || "password",
  port: Number(process.env.IRC_PORT),
  apiKey: process.env.OSU_API_KEY || "KEY",
});

Chat.connect().then(() => {
  console.log("Bancho client running!");
});
