import { Product } from "../../models/productModel.js";
import { catchAsyncErrors } from "../../utils/catchAsyncErrorHandler.js";
import { ErrorHandler } from "../../utils/errorHandler.js";
import { responseHandler } from "../../utils/responseHandler.js";


export const getByPriceLessThen = catchAsyncErrors(async (req, res, next) => {
    const { price } = req.body;
    if (!price || isNaN(price)) {
        return next(new ErrorHandler(400, 'Please provide price'))
    };
    try {
        const products = await Product.find({ price: { $lte: price } });
        if (products.length === 0) {
            return next(new ErrorHandler(404, 'No products found'))
        };
        return next(new responseHandler(201, "Products Fetched Successfully", products))
    } catch (error) {
        return next(new ErrorHandler(500, error.message))
    }
});


export const getByPriceGreaterThen = catchAsyncErrors(async (req, res, next) => {
    const { price } = req.body;
    if (!price || isNaN(price)) {
        return next(new ErrorHandler(400, 'Please provide price'))
    };
    try {
        const products = await Product.find({ price: { $gte: price } });
        if (products.length === 0) {
            return next(new ErrorHandler(404, 'No products found'))
        };
        return next(new responseHandler(201, "Products Fetched Successfully", products))
    } catch (error) {
        return next(new ErrorHandler(500, error.message))
    }
});