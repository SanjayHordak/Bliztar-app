import { Product } from "../models/productmodel.js";

export async function getProductById(req,res){
    try {
        const {id} = req.params;
        const product = await Product.findById(id);
        if(!product){
            return res.status(404).json({message:"Product not found"});
        }
        res.status(200).json({product});
    } catch (error) {
        res.status(500).json({message:"Failed to fetch product",error:error.message});
    }
}