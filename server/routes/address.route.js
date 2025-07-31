import express from 'express'
import { addAddress, updateAddress } from '../controllers/address.controller.js'
import { authUser } from '../middlewares/auth.js'

const addresRouter = express.Router()

addresRouter.post('/add', authUser, addAddress)
addresRouter.post('/update', authUser, updateAddress)

export default addresRouter