import { Router } from "express";
import upload from "../middleware/uploadMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";
import { uploadDocument } from "../controllers/documentController.js";

const router = Router();

router.post(
    "/upload",
    protect,
    upload.single("file"),
    uploadDocument
);

export default router;