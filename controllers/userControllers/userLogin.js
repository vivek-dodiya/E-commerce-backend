import { User } from '../../models/userModel.js';
import { catchAsyncErrors } from '../../utils/catchAsyncErrorHandler.js'
import { ErrorHandler } from '../../utils/errorHandler.js';
import { sendToken } from '../../utils/sendToken.js';

export const userLogin = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new ErrorHandler(400, "Email Or Password Requires"))
    }
    try {
        const user = await User.findOne({
            $or: [
                {
                    email,
                    accountVerified: true
                }
            ]
        }).select("+password");
        if (!user) {
            return next(new ErrorHandler(401, "Invalid Email Or Password"))
        }
        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            return next(new ErrorHandler(401, "Invalid Email Or Password"))
        }
        sendToken(user, 200, `${user.name} You Are Loggedin Successfully....`, res, next)
    }
    catch (error) {
        console.log(error)
        return next(new ErrorHandler(500, error.message))
    }
});
