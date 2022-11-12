import { Router } from "express";
import DeleteRequest from "./DeleteRequest";
import EditRequestComment from "./EditRequestComment";
import GetRequest from "./GetRequest";
import SubscribeRequest from "./SubscribeRequest";
import SyncRequest from "./SyncRequest";
import UnsubscribeRequest from "./UnsubscribeRequest";
import UpdateRequest from "./UpdateRequest";

const router = Router();

// ? =============== GET REQUESTS
router.get("/:request", GetRequest);

// ? =============== POST REQUESTS
router.post("/:request/edit", EditRequestComment);
router.post("/:request/sync", SyncRequest);
router.post("/:request/subscribe", SubscribeRequest);

// ? =============== PUT REQUESTS
router.put("/:request", UpdateRequest);

// ? =============== DELETE REQUESTS
router.delete("/:request", DeleteRequest);
router.post("/:request/subscribe", UnsubscribeRequest);

export const RequestsRouter = router;
