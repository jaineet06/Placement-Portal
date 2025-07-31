import express from 'express'
import { authUser } from '../middlewares/auth.js'
import { addNewEducation, updateEducation } from '../controllers/education.controller.js'

const educationRouter = express.Router()


educationRouter.post('/add', authUser, addNewEducation)
educationRouter.post('/update', authUser, updateEducation)


export default educationRouter