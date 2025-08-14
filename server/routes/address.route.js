import express from 'express'
import { addOrUpdateAddress, getAddresses } from '../controllers/address.controller.js'
import { authUser } from '../middlewares/auth.js'

const addresRouter = express.Router()

addresRouter.post('/save', authUser, addOrUpdateAddress)
addresRouter.get("/get", authUser, getAddresses);


export default addresRouter