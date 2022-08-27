import { Router } from "express";
import ClaimGDRequest from "./ClaimGDRequest";
import CreateGDRequest from "./CreateGDRequest";
import GetGDRequest from "./GetGDRequest";
import GetGDRequestClaims from "./GetGDRequestClaims";

const router = Router();

// ? =============== GET REQUESTS
router.get("/gd/:id", GetGDRequest);
router.get("/gd/:id/claim", GetGDRequestClaims);

// ? =============== POST REQUESTS
router.post("/gd/new", CreateGDRequest);
router.post("/gd/:id/claim", ClaimGDRequest);

// ? =============== PATCH REQUESTS
router.patch("/gd/:id", GetGDRequest);

export const GDRouter = router;
