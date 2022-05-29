import { Router } from "express";
import GetQueue from "./queues/GetQueue";
import GetQueueRequests from "./queues/GetQueueRequests";
import ListQueues from "./queues/ListQueues";
import AuthenticateUser from "./users/AuthenticateUser";
const api = Router();

api.get("/queues/listing", ListQueues);
api.get("/queues/:id", GetQueue);
api.get("/queues/:queue/requests", GetQueueRequests);
api.get("/validate/", AuthenticateUser);

export const ApiRoutes = api;
