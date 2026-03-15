import express from 'express'
import 'dotenv/config'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import userRouter from './routes/user.routes.js'
import connectDB from './configs/mondoDB.js'
import studentRouter from './routes/student.routes.js'
import connectCloudinary from './configs/cloudinary.js'
import addresRouter from './routes/address.route.js'
import educationRouter from './routes/education.routes.js'
import adminRouter from './routes/admin.routes.js'
import newsRouter from './routes/news.router.js'
import jobRouter from './routes/job.routes.js'
import { success } from 'zod'


connectDB()
connectCloudinary()

const app = express()
const port = process.env.PORT
const allowedOrigins = [process.env.FRONTEND_URL, process.env.ADMIN_URL]

app.use(express.json())
app.use(cookieParser())
app.use(cors({ origin: allowedOrigins, credentials: true }))


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

app.use((_, res) => {
    res.status(404).json({ success: false, message: "Page not found" })
})

app.listen(port, () => {
    console.log(`App is listening on http://localhost:${port}`)
})