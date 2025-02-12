import { ErrorHandler } from "./errorHandler.js";
import { responseHandler } from "./responseHandler.js";

export const sendToken = async (user, statusCode, message, res, next) => {
    try {
        const token = await user.generateToken();
        console.log(token)
        res.cookie("token", token, {
            httpOnly: true,
            expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        })
        return next(new responseHandler(statusCode, message));
    }
    catch (err) {
        return next(new ErrorHandler(500, err.message));
    }
}

