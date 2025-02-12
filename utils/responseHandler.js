export class responseHandler {
    constructor (statusCode, message, data){
        this.success = true;
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
    }
};