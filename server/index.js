import express from 'express'
import 'dotenv/config'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import userRouter from './routes/user.routes.js'
import connectDB from '#configs/mongoDB.js'
import studentRouter from './routes/student.routes.js'
import connectCloudinary from './configs/cloudinary.js'
import addresRouter from './routes/address.route.js'
import educationRouter from './routes/education.routes.js'
import adminRouter from './routes/admin.routes.js'
import newsRouter from './routes/news.router.js'
import jobRouter from './routes/job.routes.js'
import AppError from './utils/AppError.js';
import errorHandler from './middlewares/errorHandler.js';
import {globalRateLimiter} from "#middlewares/rateLimiter.js";
import helmet from "helmet";
import mongoose from "mongoose";

connectDB()
connectCloudinary()

const app = express()
const port = process.env.PORT
const allowedOrigins = [process.env.FRONTEND_URL, process.env.ADMIN_URL]

app.use(helmet())
app.use(express.json())
app.use(cookieParser())
app.use(cors({ origin: allowedOrigins, credentials: true }))
app.use(globalRateLimiter)


app.get('/', (req, res) => {
    res.send("Api is working")
})

app.use('/api/auth', userRouter)
app.use('/api/student', studentRouter)
app.use('/api/address', addresRouter)
app.use('/api/education', educationRouter)
app.use('/api/admin', adminRouter)
app.use('/api/news', newsRouter)
app.use('/api/job', jobRouter)

app.get('/health', (req, res) => {
    const dbConnected = mongoose.connection.readyState === 1

    const health = {
        success: dbConnected,
        status: dbConnected ? "UP" : "DOWN",
        uptime: `${Math.floor(process.uptime())} seconds`,
        timestamp: new Date().toISOString(),
        database: {
            status: dbConnected ? "CONNECTED" : "DISCONNECTED"
        }
    }

    res.status(dbConnected ? 200 : 503).json(health)
})

app.all('*splat', (req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

app.use(errorHandler);

app.listen(port, () => {
    console.log(`App is listening on http://localhost:${port}`)
})