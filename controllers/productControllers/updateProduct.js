import { Product } from "../../models/productModel.js";
import { User } from "../../models/userModel.js";
import { catchAsyncErrors } from "../../utils/catchAsyncErrorHandler.js";
import { ErrorHandler } from "../../utils/errorHandler.js";
import { responseHandler } from "../../utils/responseHandler.js";


export const updateProduct = catchAsyncErrors(async (req, res, next) => {
    const productId = req.params.id;
    if (!productId) {
        return next(new ErrorHandler(400, 'Product id Required'))
    };
    const { name, price, description, image, category } = req.body;
    if (!name && !price && !description && !image && !category) {
        return next(new ErrorHandler(400, 'Please fill in all fields'));
    };
    try {
        const productExist = await Product.findById(productId);
        if (!productExist) {
            return next(new ErrorHandler(404, 'Product not found'))
        };
        const updateProduct = await Product.findByIdAndUpdate({ _id: productId }, {
            name,
            price,
            description,
            image,
            category
        }, {
            new: true,
            runValidators: true
        });
        if (!updateProduct) {
            return next(new ErrorHandler(404, 'Product not found'))
        };
        if (updateProduct) {
            await User.findByIdAndUpdate(
                { _id: req.user._id },
                { $addToSet: { createdProducts: updateProduct._id } },
                { new: true }
            )
        }
        return next(new responseHandler(200, 'Product updated successfully', updateProduct))
    } catch (error) {
        return next(new ErrorHandler(500, error.message));
    }
})