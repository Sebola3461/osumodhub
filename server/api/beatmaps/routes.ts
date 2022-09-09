import { Router } from "express";
import GetBeatmapInfo from "./GetBeatmapInfo";

const router = Router();

router.get("/:id", GetBeatmapInfo);

export const BeatmapsRouter = router;
