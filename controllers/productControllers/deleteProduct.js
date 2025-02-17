import { Product } from "../../models/productModel.js";
import { User } from "../../models/userModel.js";
import { catchAsyncErrors } from "../../utils/catchAsyncErrorHandler.js";
import { ErrorHandler } from "../../utils/errorHandler.js";
import { responseHandler } from "../../utils/responseHandler.js";


export const deleteProduct = catchAsyncErrors(async (req, res, next) => {
    const productId = req.params.id.trim();
    if (!productId) {
        return next(new ErrorHandler(400, "Enter product id"))
    };
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return next(new ErrorHandler(404, "User Not Found"))
        }
        const productCreateByLoginUser = await user.createdProducts.includes(productId);
        if (!productCreateByLoginUser) {
            return next(new ErrorHandler(404, "You are not authorized to delete this product"))
        }
        const deletedProduct = await Product.findByIdAndDelete(productId);
        if (!deletedProduct) {
            return next(new ErrorHandler(404, "Product not found"))
        }
        await User.findByIdAndUpdate(
            { _id: req.user._id },
            { $pull: { createdProducts: productId } },
            { new: true }
        )
        return next(new responseHandler(200, "Product deleted successfully", deletedProduct))
    } catch (error) {
        return next(new ErrorHandler(500, error.message))
    }
})