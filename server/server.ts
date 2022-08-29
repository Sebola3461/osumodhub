import express, {
  Handler,
  json,
  NextFunction,
  Request,
  Response,
} from "express";
import path from "path";
import "../database";
import { queues } from "../database";
import { ApiRoutes } from "./api/routes";
import { ClientRoutes } from "./client/routes";
import { consoleCheck } from "./helpers/logger";
import DiscordEmbed from "./middlewares/DiscordEmbed";
import TimeClose from "./workers/TimeClose";
const app = express();
TimeClose();

if (process.env.NODE_ENV == "production") {
  app.use(
    "/assets",
    express.static(path.resolve(__dirname.concat("/../dist/assets/")))
  );
  app.use(
    "/static",
    express.static(path.resolve(__dirname.concat("/../src/static/")))
  );

  app.use(json());
  app.get("*", rewriteUsernameToId, DiscordEmbed);
  app.use("/api/", ApiRoutes);
  app.use("*", ClientRoutes);

  const server = app.listen(process.env.PORT || 3000, () => {
    consoleCheck("Server", "Server running!");
  });
} else {
  app.use(json());
  app.get("*", DiscordEmbed);
  app.use("/api/", ApiRoutes);
}

async function rewriteUsernameToId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const target = req.params.queue;

  if (isNaN(Number(target))) return rewrite();

  async function rewrite() {
    const targetQueue = await queues.findOne({ name: target });

    if (!targetQueue)
      return res.status(404).send({
        status: 404,
        message: "Queue not found!",
      });

    req.params.queue = targetQueue._id;

    return next();
  }

  return next();
}

export default app;
export const handler: Handler = app;
