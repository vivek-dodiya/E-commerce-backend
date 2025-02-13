import { catchAsyncErrors } from '../../utils/catchAsyncErrorHandler.js'
import { ErrorHandler } from '../../utils/errorHandler.js'
import { responseHandler } from '../../utils/responseHandler.js'

export const userLogout = catchAsyncErrors(async (req, res, next) => {
    try {
        res.clearCookie("token");
        return next(new responseHandler(201, "Loged Out SuccessFully"))
    }
    catch (error) {
        return (new ErrorHandler(500, error.message))
    }
})