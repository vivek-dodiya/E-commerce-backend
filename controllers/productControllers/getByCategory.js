import { Product } from "../../models/productModel.js";
import { catchAsyncErrors } from "../../utils/catchAsyncErrorHandler.js";
import { ErrorHandler } from "../../utils/errorHandler.js";
import { responseHandler } from "../../utils/responseHandler.js";

export const getByCategory = catchAsyncErrors(async (req, res, next) => {
    const category = req.params.category.trim();
    if (!category) {
        return next(new ErrorHandler(400, "Enter category Name"));
    }
    try {
        const products = await Product.find({
            category: new RegExp(category , 'i')
        });
        if (products.length === 0) {
            return next(new ErrorHandler(404, 'No category Found'));
        };
        return next(new responseHandler(200, "Products Fatch Successfully", products))
    } catch (error) {
        return next(new ErrorHandler(500, error.message))
    }
})