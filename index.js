import express from 'express';
const app = express();
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
dotenv.config();
const port = process.env.PORT ||4000;

// impot files
import { connection } from './config/dbConnection.js';


connection();

//  Globble or Commen Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
});