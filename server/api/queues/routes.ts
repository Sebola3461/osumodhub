import { Router } from "express";
import CreateNewQueue from "./CreateNewQueue";
import CreateRequest from "./CreateRequest";
import FollowQueue from "./FollowQueue";
import GetFollowers from "./GetFollowers";
import GetQueue from "./GetQueue";
import GetQueueRequests from "./GetQueueRequests";
import ListQueues from "../listing/ListQueues";
import RemoveFollower from "./RemoveFollower";
import StartTimeClose from "./StartTimeClose";
import SyncQueue from "./SyncQueue";
import UpdateQueue from "./UpdateQueue";
import OsumodImport from "./OsumodImport";

import AuthenticateQueue from "../../middlewares/AuthenticateQueue";

const router = Router();

// ? =============== POST REQUESTS
router.post("/new", CreateNewQueue);
router.post("/sync", SyncQueue);
router.post("/schedule", StartTimeClose);
router.post("/:queue/requests", CreateRequest);
router.post("/:queue/follow", FollowQueue);
router.post("/update", UpdateQueue);
router.post("/import/osumod", AuthenticateQueue, OsumodImport);

// ? =============== GET REQUESTS
router.get("/:queue/follow", GetFollowers);
router.get("/listing", ListQueues);
router.get("/:id", GetQueue);
router.get("/:queue/requests", GetQueueRequests);

// ? =============== DELETE REQUESTS
router.delete("/:queue/follow", RemoveFollower);

export const QueuesRouter = router;
