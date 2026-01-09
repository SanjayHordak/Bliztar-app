import { Router } from "express";
import { protectRoute } from "../middleware/authMiddleware.js";
import { createReview, deleteReview } from "../controllers/reviewController.js";

const router = Router();

router.use(protectRoute);

router.post('/',createReview);

//we did not implement this function in the mobile app - in the frontend
router.delete('/:reviewId',deleteReview);

export default router;