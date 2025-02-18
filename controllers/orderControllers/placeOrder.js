import { Order } from "../../models/orderModel.js";
import { User } from "../../models/userModel.js"
import { Product } from "../../models/productModel.js";
import { catchAsyncErrors } from '../../utils/catchAsyncErrorHandler.js'
import { responseHandler } from "../../utils/responseHandler.js"
import { ErrorHandler } from "../../utils/errorHandler.js";


export const placeOrder = catchAsyncErrors(async (req, res, next) => {
    const userId = req.user._id;
    const { shippingAddress, quantity = 1 } = req.body;
    const productId = req.params.id.trim();
    if (!productId) {
        return next(new ErrorHandler(400, 'Product ID is required'))
    }
    if (!shippingAddress) {
        return next(new ErrorHandler(400, 'Shipping Address is required'))
    }
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return responseHandler(res, 404, "Product not found");
        }
        const user = await User.findById(userId)

        const orderItems = {
            product: product._id,
            name: product.name,
            price: product.price,
            quantity: quantity
        }

        const totalAmount = product.price * quantity;

        const order = await Order.create({
            user: userId,
            orderItems: [orderItems],
            shippingAddress,
            totalAmount
        });
        await user.updateOne({
            $addToSet: {
                purchasedProduct: product._id,
                order: order._id
            }
        });
        return next(new responseHandler(201, "Order placed successfully", order))
    } catch (error) {
        return next(new ErrorHandler(500, error.message))
    }
})