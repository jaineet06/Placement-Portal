import express from 'express'
import { authorizeRoles, authUser } from '../middlewares/auth.js'
import { createStudent, getStudent, getStudents, updateStudent } from '../controllers/student.controller.js'
import upload from '../middlewares/multer.js'

const studentRouter = express.Router()

studentRouter.post('/create', authUser, upload.fields([{ name: "resume", maxCount: 1 }, { name: "profilePath", maxCount: 1 }]), createStudent)
studentRouter.get('/get-all', authUser, authorizeRoles('teacher'), getStudents)
studentRouter.get('/get/:studentId', authUser, getStudent)
studentRouter.post('/update', authUser, updateStudent)

export default studentRouter
