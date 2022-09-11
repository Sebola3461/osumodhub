import { Router } from "express";
import ListGDRequests from "./ListGDRequests";
import ClaimGDRequest from "./ClaimGDRequest";
import CreateGDRequest from "./CreateGDRequest";
import GetGDRequest from "./GetGDRequest";
import GetGDRequestClaims from "./GetGDRequestClaims";
import GetUserGDPosts from "./GetUserGDPosts";

const router = Router();

// ? =============== GET REQUESTS
router.get("/listing", ListGDRequests);
router.get("/posts", GetUserGDPosts);
router.get("/:id", GetGDRequest);
router.get("/:id/claim", GetGDRequestClaims);

// ? =============== POST REQUESTS
router.post("/new", CreateGDRequest);
router.post("/:id/claim", ClaimGDRequest);

// ? =============== PATCH REQUESTS
router.patch("/:id", GetGDRequest);

export const GDRouter = router;
