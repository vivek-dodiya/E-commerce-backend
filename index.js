import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors'
const app = express();
dotenv.config({
    path: './.env'
});
const port = process.env.PORT || 4000;

// impot files
import { connection } from './config/dbConnection.js';
import { userRoutes } from './routes/userRoutes.js';
import { deleteUnverifiedAccounts } from './cronJob/deleteUserCronJob.js';
import { productRoutes } from './routes/productRoutes.js';

deleteUnverifiedAccounts()
try {
    connection();
    
} catch (error) {
    console.log(error);
}

//  Globble or Commen Middlewares
app.use(express.json({
    limit: '15kb'
}));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"))
app.use(cookieParser());
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));



// Routes 
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/product', productRoutes)

app.use((err, req, res, next) => {
    res.status(err.statusCode).json({
        success: err.success,
        message: err.message,
        data : err.data,
        errors : err.errors,
    });
});



app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});