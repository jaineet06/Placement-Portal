import express from 'express'
import { authUser } from '../middlewares/auth.js'
import { addOrUpdateEducation, getEducation } from '../controllers/education.controller.js'

const educationRouter = express.Router()


educationRouter.post('/add', authUser, addOrUpdateEducation)
educationRouter.get("/get", authUser, getEducation);


export default educationRouter