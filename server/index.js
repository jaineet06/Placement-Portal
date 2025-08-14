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

connectDB()
connectCloudinary()

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(cookieParser())
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }))

//Api endpoints
app.get('/', (req, res) => {
    res.send("Api is working")
})
app.use('/api/auth', userRouter)
app.use('/api/student', studentRouter)
app.use('/api/address', addresRouter)
app.use('/api/education', educationRouter)

app.listen(port, () => {
    console.log(`App is listening on http://localhost:${port}`)
})