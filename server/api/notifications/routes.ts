import { Router } from "express";
import ClearUserNotifications from "./ClearUserNotifications";
import GetUserNotifications from "./GetUserNotifications";
import ValidateNotification from "./ValidateNotification";

const router = Router();

// ? =============== GET REQUESTS
router.get("/", GetUserNotifications);

// ? =============== POST REQUESTS
router.post("/:notification", ValidateNotification);

// ? =============== DELETE REQUESTS
router.delete("/", ClearUserNotifications);

export const NotificationsRouter = router;
