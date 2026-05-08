import express from 'express'
import { authorizeRoles, authUser } from '../middlewares/auth.js'
import {
    applyToJob,
    createStudent,
    fetchAllAppliedJobs,
    fetchAllJobs,
    fetchJobById,
    getStudent,
    getStudentFiles,
    getStudents,
    getStudentVefrification,
    studentExist,
    uploadStudentFiles
} from '../controllers/student.controller.js'

import upload from '../middlewares/multer.js'

// ✅ middleware
import { validate } from "../middlewares/validate.js"
import { validateParams } from "../middlewares/validateParams.js"

// ✅ schemas
import {
    createStudentSchema,
    jobIdParamSchema,
    applyJobSchema
} from "../validations/student.validation.js"

const studentRouter = express.Router()

// ✅ apply middleware here
studentRouter.post('/create', authUser, validate(createStudentSchema), createStudent)

studentRouter.get('/get-all', authUser, authorizeRoles('admin'), getStudents)

studentRouter.get('/get', authUser, getStudent)

studentRouter.post(
    '/upload-files',
    authUser,
    upload.fields([
        { name: "resume", maxCount: 1 },
        { name: "profilePath", maxCount: 1 }
    ]),
    uploadStudentFiles
)

studentRouter.get('/is-verifed', authUser, getStudentVefrification)

studentRouter.get('/is-student', authUser, studentExist)

studentRouter.get('/get-files', authUser, getStudentFiles)

studentRouter.get('/job/get-all', authUser, fetchAllJobs)

// ✅ params validation
studentRouter.get(
    '/job/:jobId',
    authUser,
    validateParams(jobIdParamSchema),
    fetchJobById
)

// ✅ BOTH body + params validation
studentRouter.post(
    '/job/apply/:jobId',
    authUser,
    validateParams(jobIdParamSchema),
    validate(applyJobSchema),
    applyToJob
)

studentRouter.get(
    '/job/apply/get-all/:userId',
    authUser,
    fetchAllAppliedJobs
)

export default studentRouter