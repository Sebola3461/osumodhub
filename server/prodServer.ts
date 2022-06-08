import express, { Handler, json } from "express";
import path from "path";
import "../database";
import { ApiRoutes } from "./api/routes";
import DiscordEmbed from "./middlewares/DiscordEmbed";

const app = express();

app.use(json());
app.get("*", DiscordEmbed);
app.get("/", (req, res) => {
  res.status(200).sendFile(path.resolve(__dirname.concat("./../index.html")));
});
app.use("/api/", ApiRoutes);

export default app;
export const handler: Handler = app;
