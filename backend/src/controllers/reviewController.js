import { Order } from "../models/ordermodel.js";
import { Product } from "../models/productmodel.js";

export async function createReview(req,res){
    try {
        const {productId,orderId,rating} = req.body;
        if(!rating || rating < 1 || rating > 5){
            return res.status(400).json({message:"Rating must be between 1 and 5"})
        }
        const user = req.user;
        const order = await Order.findById(orderId);
        if(!order){
            return res.status(404).json({message:"Order not found"});
        }
        if(order.clerkId !== user.clerkId){
            return res.status(403).json({message:"Not authorized to review this order"});
        }
        if(order.status !== "Delivered"){
            return res.status(400).json({message:"Cannot review an order that is not delivered"});
        }
        //verify if product is part of the order
        const productInOrder = order.orderItems.find((item)=>item.product.toString() === productId.toString());
        if(!productInOrder){
            return res.status(400).json({message:"Product not found in the order"});
        }
        //check if review already exists for this order and product
        const existingReview = await Review.findOne({productId,userId:user._id});
        if(existingReview){
            return res.status(400).json({message:"You have already reviewed this product"});
        }
        const review = await Review.create({
            productId,
            userId:user._id,
            orderId,
            rating,
        });
           const reviews = await Review.find({productId});
           const totalRating = reviews.reduce((sum,rev) => sum + rev.rating, 0);
           const updateProduct = await Product.findByIdAndUpdate(
            productId,
            {
                averageRating: totalRating / reviews.length,
                totalReviews: reviews.length,
            },{new:true,runValidators:true}
           );
           if(!updateProduct){
            await Review.findByIdAndDelete(review._id);
            return res.status(404).json({message:"Product not found"});
           }
           

           res.status(201).json({message:"Review created successfully",review});

    } catch (error) {
        
    }
}


export async function deleteReview(req,res){
    try {
        const {reviewId} = req.params;
        const user = req.user;
        const review = await Review.findById(reviewId);
        if(!review){
            return res.status(404).json({message:"Review not found"});
        }
        if(review.userId.toString() !== user._id.toString()){
            return res.status(403).json({message:"Not authorized to delete this review"});
        }
 
        const productId = review.productId;
        await Review.findByIdAndDelete(reviewId);

        const reviews = await Review.find({productId});
        const totalRating = reviews.reduce((sum,rev)=>sum + rev.rating, 0);
        await Product.findByIdAndUpdate(productId,{
            averageRating:reviews.length > 0 ? totalRating / reviews.length : 0,
            totalReviews:reviews.length,
        });
        res.status(200).json({message:"Review deleted successfully"});

    } catch (error) {
        res.status(500).json({message:"Failed to delete review",error:error.message});
    }
}