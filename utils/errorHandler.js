export class ErrorHandler extends Error {
    constructor(statusCode, message = "Somthing Went Wrong", errors = [], statck = "") {
        super(message);
        this.statusCode = statusCode;
        this.success = false;
        this.errors = errors;
        if (this.statck) {
            this.stack = this.statck;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}