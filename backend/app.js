import cors from 'cors';
import express from 'express';
import 'express-async-errors';
import mongoose from 'mongoose';

import { MONGODB_URI } from './utils/config.js';
const app = express()
mongoose.set('strictQuery', false);

mongoose.connect(MONGODB_URI)
    .then(result => {
        console.log('Connected to MongoDB')
    })
    .catch((error) => {
        console.log('Error connecting to MongoDB: ', error.message)
    });
app.use(cors());
app.use(express.json())

export default app