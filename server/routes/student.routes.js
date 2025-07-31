import express from 'express'
import { authorizeRoles, authUser } from '../middlewares/auth.js'
import { createStudent, getStudent, getStudents, getStudentVefrification, updateStudentFiles } from '../controllers/student.controller.js'
import upload from '../middlewares/multer.js'

const studentRouter = express.Router()

studentRouter.post('/create', authUser, upload.fields([{ name: "resume", maxCount: 1 }, { name: "profilePath", maxCount: 1 }]), createStudent)
studentRouter.get('/get-all', authUser, authorizeRoles('teacher'), getStudents)
studentRouter.get('/get/:enrollmentNo', authUser, getStudent)
studentRouter.post('/update-files/:enrollmentNo', authUser, upload.fields([{ name: "resume", maxCount: 1 }, { name: "profilePath", maxCount: 1 }]), updateStudentFiles)
studentRouter.get('/is-verifed', authUser, getStudentVefrification)

export default studentRouter
