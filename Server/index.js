import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import testRoute from './Routes/testRoute.js'

dotenv.config();

mongoose
    .connect(process.env.MONGO_DB_API)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.log('Error : ', err);
    });

const app = express();

app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000'); // Replace this with the actual origin of your client application
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    res.header(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, PATCH, DELETE, OPTIONS'
    );
    res.header('Access-Control-Allow-Credentials', 'true'); // Allow credentials

    // Respond to preflight requests
    if (req.method === 'OPTIONS') {
        res.header(
            'Access-Control-Allow-Methods',
            'GET, POST, PUT, PATCH, DELETE, OPTIONS'
        );
        res.sendStatus(200);
    } else {
        next();
    }
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT} :)`);
});

app.use(cookieParser());

app.get('/test', (req, res) => {
    res.json({
        message: 'Hello World !'
    });
});

app.use('/test', testRoute)

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
});
