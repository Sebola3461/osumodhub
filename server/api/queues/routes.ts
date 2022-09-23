import { NextFunction, Request, Response, Router } from "express";
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
import TestWebhook from "./TestWebhook";
import RemoveWebhook from "./RemoveWebhook";
import { queues } from "../../../database";
import CreateNewQueueGroup from "./CreateNewQueueGroup";
import DeleteQueue from "./DeleteQueue";
import UpdateGroup from "./UpdateGroup";
import GetGroupMembers from "./GetGroupMembers";

const router = Router();

// ? =============== POST REQUESTS
router.post("/new/group", CreateNewQueueGroup);
router.post("/new", CreateNewQueue);
router.post("/sync", SyncQueue);
router.post("/schedule", StartTimeClose);
router.post("/:queue/webhook", TestWebhook);
router.post("/:queue/requests", rewriteUsernameToId, CreateRequest);
router.post("/:queue/follow", rewriteUsernameToId, FollowQueue);
router.post("/update/group/:id", UpdateGroup);
router.post("/:id/update", UpdateQueue);
router.post("/import/osumod", AuthenticateQueue, OsumodImport);

// ? =============== GET REQUESTS
router.get("/:queue/follow", rewriteUsernameToId, GetFollowers);
router.get("/:queue/members", rewriteUsernameToId, GetGroupMembers);
router.get("/listing", ListQueues);
router.get("/:queue", rewriteUsernameToId, GetQueue);
router.get("/:queue/requests", rewriteUsernameToId, GetQueueRequests);

// ? =============== DELETE REQUESTS
router.delete("/:queue/follow", rewriteUsernameToId, RemoveFollower);
router.delete("/:queue", DeleteQueue);
router.delete("/:queue/webhook", RemoveWebhook);

// ? ========================================= UTILS
async function rewriteUsernameToId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const target = req.params.queue;

  if (isNaN(Number(target))) return rewrite();

  async function rewrite() {
    let targetQueue = await queues.findOne({ name: target });

    if (!targetQueue) targetQueue = await queues.findOne({ _id: target });

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

export const QueuesRouter = router;
