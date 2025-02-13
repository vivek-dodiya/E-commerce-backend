import { catchAsyncErrors } from "../utils/catchAsyncErrorHandler.js";
import { User } from "../models/userModel.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import { verifyToken } from "../utils/verifyToken.js";

export const auth = catchAsyncErrors(async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) return next(new ErrorHandler(401, "Please login to access this route"));
        const decoded = await verifyToken(token);
        const user = await User.findById(
            decoded._id
        );
        if (!user) return next(new ErrorHandler(401, "User not found"));
        req.user = user;
        next();
    } catch (error) {
        return next(new ErrorHandler(401, error.message));
    }
})