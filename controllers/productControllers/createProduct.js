import { Product } from "../../models/productModel.js";
import { User } from "../../models/userModel.js";
import { catchAsyncErrors } from "../../utils/catchAsyncErrorHandler.js";
import { ErrorHandler } from "../../utils/errorHandler.js";
import { responseHandler } from "../../utils/responseHandler.js";

export const createProduct = catchAsyncErrors(async (req, res, next) => {
    const { name, price, description, image, category } = req.body;
    if (!name || !price || !description || !image || !category) {
        return next(new ErrorHandler(400, 'Please fill in all fields'))
    };
    try {
        const product = await Product.create({
            name,
            price,
            description,
            image,
            category
        });
        await User.findByIdAndUpdate({
            _id: req.user._id
        },
            {
                $push: {
                    createdProducts: product._id
                }
            },
            {
                new: true
            }
        )
        return next(new responseHandler(201, "Product Created Successfully...", product))
    } catch (error) {
        return next(new ErrorHandler(500, error.message));
    }
})