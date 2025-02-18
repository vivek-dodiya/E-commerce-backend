import { Order } from "../../models/orderModel.js";
import { User } from "../../models/userModel.js"
import { Product } from "../../models/productModel.js";
import { catchAsyncErrors } from '../../utils/catchAsyncErrorHandler.js'
import { responseHandler } from "../../utils/responseHandler.js"
import { ErrorHandler } from "../../utils/errorHandler.js";


export const cancleOrder = catchAsyncErrors(async (req, res, next) => {
    const orderId = req.params.id.trim();
    const userId = req.user._id;

    try {
        const order = await Order.findById(orderId);
        if (!order) {
            return next(new ErrorHandler(404, 'Order not found'));
        }
        if (order.user.toString() !== userId.toString()) {
            return next(new ErrorHandler(401, 'You are not authorized to cancel this order'));
        }
        if (order.orderStatus === "Cancelled") {
            return next(new ErrorHandler(400, 'Order is already cancelled'))
        }
        if (order.orderStatus === "Delivered") {
            return next(new ErrorHandler(400, 'Order is already delivered'))
        }
        order.orderStatus = "Cancelled"
        await order.save();
        await User.findByIdAndUpdate(
            userId,
            {
                $pull: { order: order._id },
                $push:{ cancledOrder : order._id}
            },
            { new: true }
        );
        return next(new responseHandler(200, 'Order cancelled successfully'));
    }
    catch (error) {
        return next(new ErrorHandler(500, error.message))
    }
})