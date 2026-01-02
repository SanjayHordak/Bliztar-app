import { Order } from "../models/ordermodel.js";
import { Product } from "../models/productmodel.js";

export async function createOrder(req,res){
    try {
        const user = req.user;
        const {orderItems,shippingAddress,paymentResult,totalPrice} = req.body;

        if(!orderItems || orderItems.length===0){
            return res.status(400).json({message:"No order items"});
        }

         //validate product and stock
         for(const item of orderItems){
            const product = await Product.findById(item.product._id);
            if(!product){
                return res.status(404).json({error:`Product ${item.name} not found`});
            }
            if(product.stock < item.quantity){
                return res.status(400).json({error:`Insufficient stock for ${item.name}`});
            }
            const order = await Order.create({
                user: user._id,
                clerkId:user.clerkId,
                orderItems,
                shippingAddress,
                paymentResult,
                totalPrice
            });
            //deduct stock
            for(const item of orderItems){
                await Product.findByIdAndUpdate(item.product._id,{
                    $inc:{stock:-item.quantity},
                });
            }

         }
         res.status(201).json({message:"Order created successfully",order});

    } catch (error) {
        res.status(500).json({message:"Failed to create order",error:error.message});
    }
}
export async function getUserOrders(req,res){
    try {
        const orders = await Order.find({clerkId:req.user.clerkId})
        .populate("orderItems.product")
        .sort({createdAt:-1});

        //check if each order has been reviewed by the user
        const orderIds = orders.map(order => order._id);
        const reviews = await Review.find({orderId: {$in: orderIds}});
        const reviewedOrderIds = new Set(reviews.map(review => review.orderId.toString()));
        const ordersWithReviewStatus = await Promise.all(
            orders.map(async(order)=>{
            return {
                ...order.toObject(),
                hasReviewed: reviewedOrderIds.has(order._id.toString()),
            };
        })
    );

        res.status(200).json({orders: ordersWithReviewStatus});
    } catch (error) {
        res.status(500).json({message:"Failed to fetch orders",error:error.message});
    }
}