import express, { Handler, json } from "express";
import "../database";
import { ApiRoutes } from "./api/routes";
import DiscordEmbed from "./middlewares/DiscordEmbed";
const app = express();

app.use(json());
app.get("*", DiscordEmbed);
app.use("/api/", ApiRoutes);

export default app;
export const handler: Handler = app;
