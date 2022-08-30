import { Router } from "express";
import DeleteRequest from "./DeleteRequest";
import EditRequestComment from "./EditRequestComment";
import GetRequest from "./GetRequest";
import SyncRequest from "./SyncRequest";
import UpdateRequest from "./UpdateRequest";

const router = Router();

// ? =============== GET REQUESTS
router.get("/:request", GetRequest);

// ? =============== POST REQUESTS
router.post("/:request/edit", EditRequestComment);
router.post("/:request/sync", SyncRequest);

// ? =============== PUT REQUESTS
router.put("/:request", UpdateRequest);

// ? =============== DELETE REQUESTS
router.delete("/:request", DeleteRequest);

export const RequestsRouter = router;
