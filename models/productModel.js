import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        default: 0
    },
    numReview: {
        type: Number,
        required: true,
        default: 0
    },
    countInStock: {
        type: Number,
        required: true,
        default: 0
    }
});


export const Product = mongoose.model("Product", productSchema)