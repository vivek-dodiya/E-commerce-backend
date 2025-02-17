import { User } from "../../models/userModel.js";
import { catchAsyncErrors } from "../../utils/catchAsyncErrorHandler.js";
import { ErrorHandler } from "../../utils/errorHandler.js";
import { responseHandler } from "../../utils/responseHandler.js";

export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
    try {
        const users = await User.find({
            role : {
                $not : /admin/i
            }
        });
        return next(new responseHandler(201, "Users Fatched Successfully....", users))
    }
    catch (err) {
        return next(new ErrorHandler(500, err.message))
    }
})