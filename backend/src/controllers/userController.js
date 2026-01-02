import { User } from "../models/usermodel.js";



export async function addAddress(req,res){
    try {
        const {label,fullname,streetAddress,city,state,zipCode,phoneNumber,isDefault} = req.body;
        
        const user = req.user;

        if(!label || !fullname || !streetAddress || !city || !state || !zipCode || !phoneNumber){
            return res.status(400).json({message:"All address fields are required"});
        }

        //If isDefault is true, set all other addresses to false

        if(isDefault){
            user.addresses.forEach(addr=>{addr.isDefault=false;});

        }

        user.addresses.push({
            label,
            fullname,
            streetAddress,
            city,
            state,
            zipCode,
            phoneNumber,
            isDefault: isDefault || false
        })
        await user.save();
        res.status(201).json({message:"Address added successfully",addresses:user.addresses});
    } catch (error) {
        res.status(500).json({ message: "Failed to add address", error: error.message });
    }
}


export async function getAddresses(req,res){
    try {
        const user = req.user;
        res.status(200).json({addresses:user.addresses});
        
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch addresses", error: error.message });
    }
}


export async function updateAddress(req,res){
    try {
        const {addressId} = req.params;
        const {label,fullname,streetAddress,city,state,zipCode,phoneNumber,isDefault} = req.body;
        const user = req.user;
        const address = user.addresses.id(addressId);
        if(!address){
            return res.status(404).json({message:"Address not found"});
        }

        if(isDefault){
            user.addresses.forEach(addr=>{addr.isDefault=false;});

        }

        address.label=label || address.label;
        address.fullname=fullname || address.fullname;
        address.streetAddress=streetAddress || address.streetAddress;
        address.city=city || address.city;
        address.state=state || address.state;
        address.zipCode=zipCode || address.zipCode;
        address.phoneNumber=phoneNumber || address.phoneNumber;
        address.isDefault=isDefault!==undefined ? isDefault : address.isDefault;

        await user.save();
        res.status(200).json({message:"Address updated successfully",address});

        
    } catch (error) {
        res.status(500).json({ message: "Failed to update address", error: error.message });
    }
}


export async function deleteAddress(req,res){
    try {
        const {addressId} = req.params;
        const user = req.user;
        user.addresses.pull(addressId);
        await user.save();
        res.status(200).json({message:"Address deleted successfully",addresses:user.addresses});
    } catch (error) {
        res.status(500).json({ message: "Failed to delete address", error: error.message });
    }
}

// wishlist controllers to be added here

export async function addToWishlist(req,res){
    try {
        const {productId} = req.body;
        const user = req.user;

       //check whether product already in wishlist
       if(user.wishlist.includes(productId)){
        return res.status(400).json({message:"Product already in wishlist"});
       }
       user.wishlist.push(productId);
         await user.save();
         res.status(201).json({message:"Product added to wishlist",wishlist:user.wishlist});

    } catch (error) {
        res.status(500).json({ message: "Failed to add product to wishlist", error: error.message });
    }
}
export async function getWishlist(req,res){
    try {
        //We are using populate,because wishlist is just an array of product IDs
        const user = await User.findById(req.user._id).populate("wishlist");
        res.status(200).json({wishlist:user.wishlist});
    } catch (error) {
        res.status(500).json({message:"Failed to fetch wishlist",error:error.message});  
    }
}
export async function removeFromWishlist(req,res){
    try {
        const {productId} = req.params;
        const user = req.user;
        if(!user.wishlist.includes(productId)){
            return res.status(404).json({message:"Product not found in wishlist"});
        }
        user.wishlist.pull(productId);
        await user.save();
        res.status(200).json({message:"Product removed from wishlist",wishlist:user.wishlist});
    } catch (error) {
        res.status(500).json({ message: "Failed to remove product from wishlist", error: error.message });
    }
}