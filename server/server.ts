import express, { Handler, json } from "express";
import path from "path";
import "../database";
import { ApiRoutes } from "./api/routes";
import { ClientRoutes } from "./client/routes";
import { consoleCheck } from "./helpers/logger";
import DiscordEmbed from "./middlewares/DiscordEmbed";

const app = express();

if (process.env.NODE_ENV == "development") {
  app.use(
    "/assets",
    express.static(path.resolve(__dirname.concat("/../dist/assets/")))
  );
  app.use(
    "/static",
    express.static(path.resolve(__dirname.concat("/../src/static/")))
  );

  app.use(json());
  app.get("*", DiscordEmbed);
  app.use("/api/", ApiRoutes);

  app.listen(process.env.PORT || 3000, () => {
    consoleCheck("Server", "Server running!");
  });
} else {
  app.use(json());
  app.get("*", DiscordEmbed);
  app.use("/api/", ApiRoutes);
  app.use("/", ClientRoutes);
}

export default app;
export const handler: Handler = app;
