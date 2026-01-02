import { Router } from "express";
import { protectRoute } from "../middleware/authMiddleware.js";
import { createOrder, getUserOrders } from "../controllers/orderController.js";


const router = Router();
router.use(protectRoute);// Protect all order routes


router.post('/',createOrder);
router.get('/',getUserOrders);


export default router;