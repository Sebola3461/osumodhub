import { Router } from "express";
import GetUserRequests from "../queues/GetUserRequests";
import EditLanguage from "./EditLanguage";
import GetUser from "./GetUser";
import GetUserBeatmaps from "./GetUserBeatmaps";
import GetUserQueueGroups from "./GetUserQueueGroups";
import GetValidAdmins from "./GetValidAdmins";
import SyncClient from "./SyncClient";
import UpdateUser from "./UpdateUser";

const router = Router();

// ? =============== POST REQUESTS
router.post("/language", EditLanguage);
router.post("/sync", SyncClient);
router.post("/update", UpdateUser);

// ? =============== GET REQUESTS
router.get("/groups/admins", GetValidAdmins);
router.get("/groups", GetUserQueueGroups);
router.get("/:user", GetUser);
router.get("/:user/beatmaps", GetUserBeatmaps);
router.get("/:user/requests/", GetUserRequests);

export const UserRouter = router;
