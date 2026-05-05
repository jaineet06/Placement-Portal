import express from 'express'
import { addOrUpdateAddress, getAddresses } from '../controllers/address.controller.js'
import { authUser } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import { addressSchema } from '../validations/address.validation.js'

const addresRouter = express.Router()


addresRouter.get("/get", authUser, getAddresses);

addresRouter.post('/save', authUser, validate(addressSchema), addOrUpdateAddress)



export default addresRouter