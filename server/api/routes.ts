import { Router } from "express";
import CreateNewQueue from "./queues/CreateNewQueue";
import CreateRequest from "./queues/CreateRequest";
import DeleteRequest from "./queues/DeleteRequest";
import FollowQueue from "./queues/FollowQueue";
import GetFollowers from "./queues/GetFollowers";
import GetQueue from "./queues/GetQueue";
import GetQueueRequests from "./queues/GetQueueRequests";
import ListQueues from "./queues/ListQueues";
import RemoveFollower from "./queues/RemoveFollower";
import SyncQueue from "./queues/SyncQueue";
import UpdateQueue from "./queues/UpdateQueue";
import UpdateRequest from "./queues/UpdateRequest";
import AuthenticateUser from "./users/AuthenticateUser";
import GetUserBeatmaps from "./users/GetUserBeatmaps";
const api = Router();

api.get("/", (req, res) => res.status(200).send({ status: 200, message: "" }));

// ? put
api.put("/requests/:request", UpdateRequest);

// ? Get
api.get("/queues/:queue/follow", GetFollowers);
api.get("/queues/listing", ListQueues);
api.get("/queues/:id", GetQueue);
api.get("/queues/:queue/requests", GetQueueRequests);
api.get("/users/:user/beatmaps", GetUserBeatmaps);
api.get("/validate/", AuthenticateUser);

// ? post
api.post("/queues/new", CreateNewQueue);
api.post("/queues/sync", SyncQueue);
api.post("/queues/:queue/requests", CreateRequest);
api.post("/queues/:queue/follow", FollowQueue);

api.post("/queues/update", UpdateQueue);

// ? Delete
api.delete("/queues/:queue/follow", RemoveFollower);
api.delete("/requests/:request", DeleteRequest);

export const ApiRoutes = api;
