import { Router } from "express";
import { createProduct,
    getAllCustomers,
    getAllOrders,
    getAllProducts,
    getDashboardStats,
    updateOrderStatus,
    updateProduct
    } from "../controllers/adminController.js";
import { adminOnly, protectRoute } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/multerMiddleware.js";

const router = Router();

router.use(protectRoute,adminOnly); // Protect all admin routes

router.post("/products",upload.array("images",3),createProduct);
router.get("/products",getAllProducts);
router.put("/products/:id",upload.array("images",3),updateProduct);

router.get("/orders",getAllOrders);
router.patch("/orders/:orderId/status",updateOrderStatus);

router.get("/customers",getAllCustomers);
router.get("/stats",getDashboardStats);

export default router;