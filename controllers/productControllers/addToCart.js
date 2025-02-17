import { Product } from "../../models/productModel.js";
import { User } from "../../models/userModel.js";
import { catchAsyncErrors } from "../../utils/catchAsyncErrorHandler.js";
import { ErrorHandler } from "../../utils/errorHandler.js";
import { responseHandler } from "../../utils/responseHandler.js";


export const addToCart = catchAsyncErrors(async (req, res, next) => {
    const productId = req.params.id.trim();
    if (!productId) {
        return next(new ErrorHandler(400, 'Product ID is required'))
    }
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return next(new ErrorHandler(404, 'Product not found'))
        }
        const user = await User.findById(req.user.id);
        if (!user) {
            return next(new ErrorHandler(404, 'User not found'))
        }
        if (user.cart.includes(productId)) {
            return next(new ErrorHandler(400, 'Product already in cart'))
        }
        user.cart.push(productId);
        await user.save();
        return next(new responseHandler(201, "Product added to cart successfully", user))
    } catch (error) {
        return next(new ErrorHandler(500, error.message))
    }
})