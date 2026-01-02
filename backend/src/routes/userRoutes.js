import { Router } from "express";
import { 
         addAddress,
         addToWishlist,
         deleteAddress,
         getAddresses,
         getWishlist,
         removeFromWishlist,
         updateAddress 
        } from "../controllers/userController.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const router = Router();
router.use(protectRoute); // Protect all user routes


//address routes
router.post("/addresses",addAddress)
router.get("/addresses",getAddresses)
router.put("/addresses/:addressId",updateAddress)
router.delete("/addresses/:addressId",deleteAddress)

// wishlist routes

router.post("/wishlist",addToWishlist)
router.get("/wishlist",getWishlist)
router.delete("/wishlist/:productId",removeFromWishlist)


export default router;