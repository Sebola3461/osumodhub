import express, { json } from "express";
import path from "path";
import "../database";
import { ApiRoutes } from "./api/routes";
import { ClientRoutes } from "./client/routes";
import { consoleCheck } from "./helpers/logger";
import DiscordEmbed from "./middlewares/DiscordEmbed";

const app = express();

app.use(
  "/assets",
  express.static(path.resolve(__dirname.concat("/../dist/assets/")))
);

app.use(json());
app.get("*", DiscordEmbed);
app.use("/api/", ApiRoutes);
app.use("/", ClientRoutes);

app.listen(process.env.PORT || 3000, () => {
  consoleCheck("Server", "Server running!");
});

export default app;
