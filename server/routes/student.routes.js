import express from 'express'
import { authorizeRoles, authUser } from '../middlewares/auth.js'
import { applyToJob, createStudent, fetchAllAppliedJobs, fetchAllJobs, fetchJobById, getStudent, getStudentFiles, getStudents, getStudentVefrification, studentExist, uploadStudentFiles } from '../controllers/student.controller.js'
import upload from '../middlewares/multer.js'

const studentRouter = express.Router()

studentRouter.post('/create', authUser, createStudent)
studentRouter.get('/get-all', authUser, authorizeRoles('admin'), getStudents)
studentRouter.get('/get', authUser, getStudent)
studentRouter.post('/upload-files', authUser, upload.fields([{ name: "resume", maxCount: 1 }, { name: "profilePath", maxCount: 1 }]), uploadStudentFiles)
studentRouter.get('/is-verifed', authUser, getStudentVefrification)
studentRouter.get('/is-student', authUser, studentExist)
studentRouter.get('/get-files', authUser, getStudentFiles)


studentRouter.get('/job/get-all', authUser, fetchAllJobs)

studentRouter.get('/job/:jobId', authUser, fetchJobById)



studentRouter.post('/job/apply/:jobId', authUser, applyToJob)

studentRouter.get('/job/apply/get-all/:userId', authUser, fetchAllAppliedJobs)

export default studentRouter
