import { Router } from "express";
import { protectRoute } from "../middleware/authMiddleware.js";
import { getAllProducts } from "../controllers/adminController.js";
import { getProductById } from "../controllers/productController.js";

const router = Router();
router.use(protectRoute);

router.get('/', getAllProducts);
router.post('/:id',getProductById);

export default router;