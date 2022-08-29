import { Router } from "express";
import ClaimGDRequest from "./gd/ClaimGDRequest";
import CreateGDRequest from "./gd/CreateGDRequest";
import GetGDRequest from "./gd/GetGDRequest";
import GetGDRequestClaims from "./gd/GetGDRequestClaims";
import ListGDRequests from "./listing/ListGDRequests";
import ListQueues from "./listing/ListQueues";
import { QueuesRouter } from "./queues/routes";
import AuthenticateUser from "./users/AuthenticateUser";
import GetBeatmapInfo from "./users/GetBeatmapInfo";
import { UserRouter } from "./users/routes";
import { RequestsRouter } from "./requests/routes";
import { NotificationsRouter } from "./notifications/routes";
import { ListingRouter } from "./listing/routes";
const api = Router();

import ws from "ws";
const wsSrv = new ws.Server({ noServer: true });

api.get("/", (req, res) =>
  res.status(200).send({ status: 200, message: "osu!modhub api v1" })
);

api.use("/users/", UserRouter);
api.use("/queues/", QueuesRouter);
api.use("/requests/", RequestsRouter);
api.use("/notifications/", NotificationsRouter);
api.use("/listing", ListingRouter);

// TODO: Create a category for this
api.get("/validate/", AuthenticateUser);

export const ApiRoutes = api;
export const websocketServer = wsSrv;
