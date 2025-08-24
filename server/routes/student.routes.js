import express from 'express'
import { authorizeRoles, authUser } from '../middlewares/auth.js'
import { createStudent, getStudent, getStudentFiles, getStudents, getStudentVefrification, studentExist, uploadStudentFiles } from '../controllers/student.controller.js'
import upload from '../middlewares/multer.js'

const studentRouter = express.Router()

studentRouter.post('/create', authUser, createStudent)
studentRouter.get('/get-all', authUser, authorizeRoles('admin'), getStudents)
studentRouter.get('/get', authUser, getStudent)
studentRouter.post('/upload-files', authUser, upload.fields([{ name: "resume", maxCount: 1 }, { name: "profilePath", maxCount: 1 }]), uploadStudentFiles)
studentRouter.get('/is-verifed', authUser, getStudentVefrification)
studentRouter.get('/is-student', authUser, studentExist)
studentRouter.get('/get-files', authUser, getStudentFiles)

export default studentRouter
