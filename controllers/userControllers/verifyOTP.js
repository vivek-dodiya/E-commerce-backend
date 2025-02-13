import { catchAsyncErrors } from '../../utils/catchAsyncErrorHandler.js'
import { ErrorHandler } from '../../utils/errorHandler.js'
import { User } from '../../models/userModel.js'
import { responseHandler } from '../../utils/responseHandler.js'
import { verifyToken } from '../../utils/verifyToken.js'

export const verifyOTP = catchAsyncErrors(async (req, res, next) => {
    const { otp } = req.body
    if (!otp) {
        return next(new ErrorHandler(400, 'Please enter OTP'))
    }
    try {
        const token = req.cookies.token
        const decoded = await verifyToken(token);
        const user = await User.findById(decoded._id)
        if (!user) {
            return next(new ErrorHandler(404, "User not found"))
        }
        if (user.verificationCode !== otp) {
            return next(new ErrorHandler(400, "Invalid OTP"))
        }
        user.verificationCode = null;
        user.accountVerified = true
        user.verificationCodeExpire = null
        await user.save()
        return next(
            new responseHandler(200, "Account verified successfully")
        )
    } catch (error) {
        return next(new ErrorHandler(500, error.message))
    }
})