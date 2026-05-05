import express from 'express'
import { authUser } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import { educationSchema } from '../validations/education.validation.js'
import { addOrUpdateEducation, getEducation } from '../controllers/education.controller.js'

const educationRouter = express.Router()

// ✅ apply validation middleware
educationRouter.post('/add', authUser, validate(educationSchema), addOrUpdateEducation)

educationRouter.get("/get", authUser, getEducation);

export default educationRouter