import mongoose from "mongoose";

export const connection = ()=>{
    mongoose.connect(process.env.MONGO_CONNECTION_URL).then(()=>{
        console.log("Connected to MongoDB");
    }).catch((error)=>{
        console.log("Error connecting to MongoDB");
    })
}