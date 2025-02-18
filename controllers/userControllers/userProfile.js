import { User } from "../../models/userModel.js";
import { catchAsyncErrors } from "../../utils/catchAsyncErrorHandler.js";
import { ErrorHandler } from "../../utils/errorHandler.js";
import { responseHandler } from "../../utils/responseHandler.js";

export const getUserProfile = catchAsyncErrors(async (req, res, next) => {
    const userId = req.user._id;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return next(new ErrorHandler(404, 'User not found'));
        }
        const userProfile = await User.aggregate([
            { $match: { _id: userId } },
            {
                $lookup: {
                    from: "products",
                    localField: "purchasedProduct",
                    foreignField: "_id",
                    as: "purchasedProduct"
                }
            },
            {
                $lookup: {
                    from: "products",
                    localField: "createdProducts",
                    foreignField: "_id",
                    as: "createdProducts"
                }
            },
            {
                $lookup: {
                    from: "products",
                    localField: "cart",
                    foreignField: "_id",
                    as: "cart"
                }
            },
            {
                $lookup: {
                    from: "orders",
                    localField: "order",
                    foreignField: "_id",
                    as: "YourOrder"
                }
            },
            {
                $lookup: {
                    from: "orders",
                    localField: "cancledOrder",
                    foreignField: "_id",
                    as: "cancledOrder"
                }
            },
            {
                $project: {
                    password: 0,
                    accountVerified: 0,
                    verificationCode: 0,
                    verificationCodeExpire: 0,
                    resetPasswordToken: 0,
                    resetPasswordExpires: 0,
                    order: 0,
                    createdAt: 0,
                    updatedAt: 0,
                    __v: 0,

                    "purchasedProduct._id": 0,
                    "purchasedProduct.__v": 0,

                    "createdProducts._id": 0,
                    "createdProducts.__v": 0,
                    
                    "cart._id": 0,
                    "cart.__v": 0,

                    "cancledOrder.paymentStatus": 0,
                    "cancledOrder.user": 0,
                    "cancledOrder.orderItems._id": 0,
                    "cancledOrder.createdAt": 0,
                    "cancledOrder.updatedAt": 0,
                    "cancledOrder.__v": 0,

                    "YourOrder._id": 0,
                    "YourOrder.user": 0,
                    "YourOrder.paymentStatus": 0,
                    "YourOrder.orderStatus": 0,
                    "YourOrder.createdAt": 0,
                    "YourOrder.updatedAt": 0,
                    "YourOrder.orderItems._id": 0,
                    "YourOrder.__v": 0,
                }
            }
        ]);
        return next(new responseHandler(201, "Profile Fatched SuccessFully...", userProfile))
    }
    catch (error) {
        return next(new ErrorHandler(500, error.message))
    }
})