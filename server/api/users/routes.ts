import { Router } from "express";
import GetUserRequests from "../queues/GetUserRequests";
import GetUser from "./GetUser";
import GetUserBeatmaps from "./GetUserBeatmaps";
import GetUserQueueGroups from "./GetUserQueueGroups";
import GetValidAdmins from "./GetValidAdmins";
import SyncClient from "./SyncClient";

const router = Router();

// ? =============== POST REQUESTS
router.post("/sync", SyncClient);

// ? =============== GET REQUESTS
router.get("/groups/admins", GetValidAdmins);
router.get("/groups", GetUserQueueGroups);
router.get("/:user", GetUser);
router.get("/:user/beatmaps", GetUserBeatmaps);
router.get("/:user/requests/", GetUserRequests);

export const UserRouter = router;
