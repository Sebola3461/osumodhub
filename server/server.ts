import express, { json } from "express";
import "../database";
import { ApiRoutes } from "./api/routes";
import { consoleCheck } from "./helpers/logger";
import DiscordEmbed from "./middlewares/DiscordEmbed";

const app = express();

app.use(json());
app.get("*", DiscordEmbed);
app.use("/api/", ApiRoutes);

app.listen(process.env.PORT || 3000, () => {
  consoleCheck("Server", "API running!");
});

export default app;
