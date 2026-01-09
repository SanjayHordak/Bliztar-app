import {Cart} from '../models/cartmodel.js';
import { Product } from '../models/productmodel.js';



export async function getCart(req,res){
    try {
        let cart = await Cart.findOne({clerkId:req.user.clerkId}).populate('items.product');
        if(!cart){
            const user = req.user;
            cart = await Cart.create({
                user:user._id,
                clerkId:user.clerkId,
                items:[],
            });
        }
        res.status(200).json({cart});
    } catch (error) {
        res.status(500).json({error:"Failed to fetch cart",message:error.message});
    }}

export async function addToCart(req,res){
    try {
        const {productId,quantity = 1} = req.body;

        //Validate product if its exist and  has stock
        const product = await Product.findById(productId);
        if(!product){
            return res.status(404).json({message:"Product not found"});
        }
        if(product.stock < quantity){
            return res.status(400).json({message:"Insufficient stock"});
        }
        let cart = await Cart.findOne({clerkId:req.user.clerkId});
        if(!cart){
            cart = await Cart.create({
                user:user._id,
                clerkId:user.clerkId,
                items:[],
            });
        }

        //check if product already in cart
        const existingItem = cart.items.find((item) => item.product.toString() == productId);
        if(existingItem){
            const newQuantity = existingItem.quantity + 1 ;
            if(product.stock < newQuantity){
                return res.status(400).json({message:"Insufficient stock"});
            }
            existingItem.quantity = newQuantity;
        }else{
            //add new item to cart
            cart.items.push({product: productId, quantity});
        }
        await cart.save();
        res.status(200).json({message:"Product added to cart",cart});

    } catch (error) {
        res.status(500).json({error:"Failed to add to cart",message:error.message});
    }
}

export async function removeFromCart(req,res){
    try {
        const {productId} = req.params;

        const cart = await Cart.findOne({clerkId:req.user.clerkId});
        if(!cart){
            return res.status(404).json({message:"Cart not found"});
        }

        cart.items = cart.items.filter((item) => item.product.toString() !== productId);
        await cart.save();
        res.status(200).json({message:"Product removed from cart",cart});

    } catch (error) {
        res.status(500).json({error:"Failed to remove from cart",message:error.message});
    }
}

export async function updateCartItem(req,res){
    try {
        const {productId} = req.params;
        const {quantity} = req.body;

        if(quantity < 1){
            return res.status(400).json({message:"Quantity must be at least 1"});
        }
        const cart = await Cart.findOne({clerkId:req.user.clerkId});
        if(!cart){
            return res.status(404).json({message:"Cart not found"});
        }
        const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);
        if(itemIndex === -1){
            return res.status(404).json({message:"Product not found in cart"});
        }

        //Validate product if exists and validate stock
        const product = await Product.findById(productId);
        if(!product){
            return res.status(404).json({message:"Product not found"});
        }
        if(product.stock < quantity){
            return res.status(400).json({message:"Insufficient stock"});
        }
        cart.items[itemIndex].quantity = quantity;
        await cart.save();
        res.status(200).json({message:"Cart item updated Successfully",cart}); 
    } catch (error) {
        res.status(500).json({error:"Failed to update cart item",message:error.message});
    }
}

export async function clearCart(req,res){
    try {
        const cart = await Cart.findOne({clerkId:req.user.clerkId});
        if(!cart){
            return res.status(404).json({message:"Cart not found"});
        }
        cart.items = [];
        await cart.save();
        res.status(200).json({message:"Cart cleared successfully",cart});
    } catch (error) {
        res.status(500).json({error:"Failed to clear cart",message:error.message});
    }
}
