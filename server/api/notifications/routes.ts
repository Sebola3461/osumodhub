import { Router } from "express";
import ClearUserNotifications from "../users/ClearUserNotifications";
import GetUserNotifications from "./GetUserNotifications";

const router = Router();

// ? =============== GET REQUESTS
router.get("/", GetUserNotifications);

// ? =============== DELETE REQUESTS
router.delete("/", ClearUserNotifications);

export const NotificationsRouter = router;
