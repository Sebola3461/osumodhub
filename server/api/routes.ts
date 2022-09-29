import { Router } from "express";
import ClaimGDRequest from "./gd/ClaimGDRequest";
import CreateGDRequest from "./queues/CreateGDRequest";
import GetGDRequest from "./gd/GetGDRequest";
import GetGDRequestClaims from "./gd/GetGDRequestClaims";
import ListGDRequests from "./gd/ListGDRequests";
import ListQueues from "./listing/ListQueues";
import { QueuesRouter } from "./queues/routes";
import AuthenticateUser from "./users/AuthenticateUser";
import { UserRouter } from "./users/routes";
import { RequestsRouter } from "./requests/routes";
import { NotificationsRouter } from "./notifications/routes";
import { ListingRouter } from "./listing/routes";
const api = Router();
import { WebSocketServer } from "ws";
import { GDRouter } from "./gd/routes";
import { BeatmapsRouter } from "./beatmaps/routes";
import path from "path";

const wsSrv = new WebSocketServer({
  port: 3001,
});

wsSrv.on("listening", console.log);

wsSrv.on("error", console.error);

api.get("/", (req, res) =>
  res.status(200).send({ status: 200, message: "osu!modhub api v1" })
);

api.use("/users/", UserRouter);
api.use("/queues/", QueuesRouter);
api.use("/requests/", RequestsRouter);
api.use("/notifications/", NotificationsRouter);
api.use("/listing", ListingRouter);
api.use("/gd/", GDRouter);
api.use("/beatmaps/", BeatmapsRouter);

// TODO: Create a category for this
api.get("/validate/", AuthenticateUser);
api.get("/identify", (req, res) => {
  res.sendFile(path.resolve("./server/api/assets/LoginTemplate.html"));
});

export const ApiRoutes = api;
export const websocketServer = wsSrv.clients;
