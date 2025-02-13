import { User } from "../models/userModel.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import { responseHandler } from "../utils/responseHandler.js";


export const onlyAdminAccess = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (user.role !== "Admin" || user.role !== "admin") {
            return next(new responseHandler(403, "Only Admin can access this route"));
        }
        next();
    } catch (error) {
        return next(new ErrorHandler(500, error.message));
    }
}