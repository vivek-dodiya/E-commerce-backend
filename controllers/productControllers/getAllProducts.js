import { Product } from "../../models/productModel.js";
import { catchAsyncErrors } from "../../utils/catchAsyncErrorHandler.js";
import { ErrorHandler } from "../../utils/errorHandler.js";
import { responseHandler } from "../../utils/responseHandler.js";


export const getAllProducts = catchAsyncErrors(async (req, res, next) => {
    try {
        const products = await Product.find();
        return next(new responseHandler(200, "Products retrieved successfully", products))
    } catch (error) {
        return next(new ErrorHandler(500, error.message))
    }
})