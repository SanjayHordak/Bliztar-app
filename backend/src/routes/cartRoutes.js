import { Router } from "express";
import { protectRoute } from "../middleware/authMiddleware.js";
import {addToCart,
        clearCart,
        getCart,
        removeFromCart, 
        updateCartItem } from "../controllers/cartController.js";

const router = Router();
router.use(protectRoute);

router.get("/",getCart);
router.post("/",addToCart);
router.delete("/:productId",removeFromCart);
router.put("/:productId",updateCartItem);
router.delete("/",clearCart);


export default router;