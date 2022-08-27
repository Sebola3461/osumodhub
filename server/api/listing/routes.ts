import { Router } from "express";
import ListGDRequests from "./ListGDRequests";
import ListQueues from "./ListQueues";

const router = Router();

router.get("/queues", ListQueues);
router.get("/:category", ListGDRequests);

export const ListingRouter = router;
