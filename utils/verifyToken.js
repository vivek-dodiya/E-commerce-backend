import jwt from "jsonwebtoken";


export const verifyToken = async (token)=>{
    return await jwt.verify(
        token,
        process.env.JWT_SECRET_KEY
    )
}