import { Router } from "express";
import GetUserRequests from "../queues/GetUserRequests";
import GetUserBeatmaps from "./GetUserBeatmaps";
import GetUserGDPosts from "./GetUserGDPosts";
import SyncClient from "./SyncClient";

const router = Router();

// ? =============== POST REQUESTS
router.post("/sync", SyncClient);

// ? =============== GET REQUESTS
router.get("/:user/beatmaps", GetUserBeatmaps);
router.get("/:user/requests/", GetUserRequests);
router.get("/:user/posts/", GetUserGDPosts);

export const UserRouter = router;
