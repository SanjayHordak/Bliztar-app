import cloudinary from '../config/cloudinary.js'
import { Product } from '../models/productmodel.js';
import { Order } from '../models/ordermodel.js';
import { User } from '../models/usermodel.js';


export async function createProduct(req,res){
     try {
        const {name,description,price,stock,category} = req.body;
        if(!name || !description || !price || !stock || !category){
            return res.status(400).json({message:"All fields are required"});
        }
        if(!req.files || req.files.length===0){
            return res.status(400).json({message:"At least one product image is required"});
        }

        if(req.files.length>3){
            return res.status(400).json({message:"Maximum 3 images are allowed"});
        }

        const uploadPromises = req.files.map((file)=>{
            return cloudinary.uploader.upload(file.path,{
                 folder:"products"
                });
        })
        const uploadResults = await Promise.all(uploadPromises);

        //secure image urls
        const imageUrls = uploadResults.map((result) => result.secure_url);

        //create product in db
        const product = await Product.create({
            name,
            description,
            price:parseFloat(price),
            stock:parseInt(stock),
            category,
            images:imageUrls
        });
        res.status(201).json({message:"Product created successfully",product});

     } catch (error) {
        res.status(500).json({message:"Product creation failed",error:error.message});
     }
}

export async function getAllProducts(_,res){
   try {
    //-1 means descending order:most recent first
    const products = await Product.find().sort({createdAt:-1});
    res.status(200).json({products});
   } catch (error) {
    res.status(500).json({message:"Failed to fetch products",error:error.message});
   }
}

export async function updateProduct(req,res){
   try {
    const {id} = req.params;
    const {name,description,price,stock,category} = req.body;
    const product = await Product.findById(id);
    if(!product){
        return  res.status(404).json({message:"Product not found"});
    }
    //update fields if provided
    if(name) product.name = name;
    if(description) product.description = description;
    if(price) product.price = parseFloat(price);
    if(stock !== undefined) product.stock = parseInt(stock);
    if(category) product.category = category;

    //handle new images if provided
    if(req.files && req.files.length>0){
        if(req.files.length>3){
            return res.status(400).json({message:"Maximum 3 images are allowed"});
        }
        const uploadPromises = req.files.map((file)=>{
            return cloudinary.uploader.upload(file.path,{
                 folder:"products"
                });
        })
        const uploadResults = await Promise.all(uploadPromises);
        product.images = uploadResults.map((result) => result.secure_url);
    }

    await product.save();
    res.status(200).json({message:"Product updated successfully",product});
   } catch (error) {
    res.status(500).json({message:"Product update failed",error:error.message});
   }
}

export async function getAllOrders(req,res){
    try {

        const orders = (await Order.find().populate("user","name email").populate("orderItems.product")).sort({createdAt:-1});
        res.status(200).json({orders});

    } catch (error) {
        res.status(500).json({message:"Failed to fetch orders",error:error.message});
    }
}


export async function updateOrderStatus(req,res){
    try {
        const {orderId} = req.params;
        const {status} = req.body;
        if(!["pending","shipped","delivered"].includes(status)){
            return res.status(400).json({error:"Invalid status value"});
        }
        const order =  await Order.findById(orderId);
        if(!order){
            return res.status(404).json({message:"Order not found"});
        }
        order.status=status;
        if(status==="shipped" && !order.shippedAt){
            order.shippedAt = new Date();
        }

        if(status==="delivered" && !order.deliveredAt){
            order.deliveredAt = new Date();
        }

        await order.save();
        res.status(200).json({message:"Order status updated successfully",order});
    } catch (error) {
        res.status(500).json({message:"Failed to update order status",error:error.message});
    }
}


export async function getAllCustomers(_,res){
    try {
        const customers = (await User.find()).sort({createdAt:-1});
        res.status(200).json({customers});
    } catch (error) {
        res.status(500).json({message:"Failed to fetch customers",error:error.message});
    }
}


export async function getDashboardStats(_,res){
   try {
    const totalOrders = await Order.countDocuments();
    const revenueResult = await Order.aggregate([
        {
            $group:{
                _id:null,
                total:{$sum:"$totalPrice"},
            },
        },
    ])
    const totalRevenue = revenueResult[0]?.total || 0;
    const totalCustomers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();

    res.status(200).json({
        totalOrders,
        totalRevenue,
        totalCustomers,
        totalProducts
    });
   } catch (error) {
    res.status(500).json({message:"Failed to fetch dashboard stats",error:error.message});
   }
}