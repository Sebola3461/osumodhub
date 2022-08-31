import { Router } from "express";
import ClaimGDRequest from "./ClaimGDRequest";
import CreateGDRequest from "./CreateGDRequest";
import GetGDRequest from "./GetGDRequest";
import GetGDRequestClaims from "./GetGDRequestClaims";

const router = Router();

// ? =============== GET REQUESTS
router.get("/:id", GetGDRequest);
router.get("/:id/claim", GetGDRequestClaims);

// ? =============== POST REQUESTS
router.post("/new", CreateGDRequest);
router.post("/:id/claim", ClaimGDRequest);

// ? =============== PATCH REQUESTS
router.patch("/:id", GetGDRequest);

export const GDRouter = router;
