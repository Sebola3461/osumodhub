import { Router } from "express";
import CreateRequest from "./queues/CreateRequest";
import GetQueue from "./queues/GetQueue";
import GetQueueRequests from "./queues/GetQueueRequests";
import ListQueues from "./queues/ListQueues";
import UpdateRequest from "./queues/UpdateRequest";
import AuthenticateUser from "./users/AuthenticateUser";
import GetUserBeatmaps from "./users/GetUserBeatmaps";
const api = Router();

api.get("/queues/listing", ListQueues);
api.get("/queues/:id", GetQueue);
api.get("/queues/:queue/requests", GetQueueRequests);
api.post("/queues/:queue/requests", CreateRequest);
api.get("/users/:user/beatmaps", GetUserBeatmaps);
api.get("/validate/", AuthenticateUser);

// ? put
api.put("/requests/:request", UpdateRequest);

export const ApiRoutes = api;
