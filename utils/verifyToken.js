import jwt from "jsonwebtoken";


export const verifyToken = async (token)=>{
    return await jwt.decode(
        token,
        process.env.JWT_SECRET_KEY
    )
}