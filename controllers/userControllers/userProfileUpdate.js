import { User } from '../../models/userModel.js';
import { catchAsyncErrors } from '../../utils/catchAsyncErrorHandler.js'
import { ErrorHandler } from '../../utils/errorHandler.js';
import { responseHandler } from '../../utils/responseHandler.js';

export const userProfileUpdate = catchAsyncErrors(async (req, res, next) => {
    const { name, email, password } = req.body;
    const { _id } = req.user._id
    try {
        const user = await User.findById(
            _id,
        );
        if (!user) {
            return next(new ErrorHandler(400, "User not Found"))
        }
        if(name) user.name = name
        if(email) user.email = email
        if(password) {
            user.password = password;
            user.markModified('password')
        }
        await user.save()
        return next(new responseHandler(200, "User Profile Updated Successfully", user))
    } catch (error) {
        return next(new ErrorHandler(500, error.message))
    }
})