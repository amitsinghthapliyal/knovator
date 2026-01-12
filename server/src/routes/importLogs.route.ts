import { Router } from "express";
import { getImportLogs } from "../controllers/importLog.controller";

const router = Router();

router.get("/", getImportLogs);

export default router;
