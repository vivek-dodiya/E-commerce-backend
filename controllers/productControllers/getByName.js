import { Product } from "../../models/productModel.js";
import { catchAsyncErrors } from "../../utils/catchAsyncErrorHandler.js";
import { ErrorHandler } from "../../utils/errorHandler.js";
import { responseHandler } from "../../utils/responseHandler.js";

export const getByName = catchAsyncErrors(async (req, res, next) => {
    const name = req.params.name.trim();
    if (!name) {
        return next(new ErrorHandler(400, "Enter item Name"));
    }
    try {
        const products = await Product.find({
            name: new RegExp(name , 'i')
        });

        if (products.length === 0) {
            return next(new ErrorHandler(404, 'No item Found'));
        };
        return next(new responseHandler(200, "Products Fatch Successfully", products))
    } catch (error) {
        return next(new ErrorHandler(500, error.message))
    }
})