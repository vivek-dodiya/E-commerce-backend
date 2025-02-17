import { User } from "../../models/userModel.js";
import { catchAsyncErrors } from "../../utils/catchAsyncErrorHandler.js";
import { ErrorHandler } from "../../utils/errorHandler.js";
import { responseHandler } from "../../utils/responseHandler.js";
import { verifyToken } from "../../utils/verifyToken.js";


export const userDelete = catchAsyncErrors(async (req, res, next) => {
    try {
        const token = req.cookies.token
        const decoded = await verifyToken(token);
        const user = await User.findById(decoded._id)
        if (!user) {
            return next(new ErrorHandler(404, "User Not Found"))
        };
        if (/^admin$/i.test(user.role)) {
            return next(new ErrorHandler(403, "You are not authorized to delete this user"))
        }
        await User.findByIdAndDelete({
            _id: user._id
        });
        return next(new responseHandler(201, "User deleted Success Fully..."))
    } catch (error) {
        return next(new ErrorHandler(500, error.message))
    }
})