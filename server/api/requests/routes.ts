import { Router } from "express";
import DeleteRequest from "./DeleteRequest";
import EditRequestComment from "./EditRequestComment";
import GetRequest from "./GetRequest";
import UpdateRequest from "./UpdateRequest";

const router = Router();

// ? =============== GET REQUESTS
router.get("/:request", GetRequest);

// ? =============== POST REQUESTS
router.post("/:request/edit", EditRequestComment);

// ? =============== PUT REQUESTS
router.put("/:request", UpdateRequest);

// ? =============== DELETE REQUESTS
router.delete("/:request", DeleteRequest);

export const RequestsRouter = router;
