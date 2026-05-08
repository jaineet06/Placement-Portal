import express from "express"
import { authorizeRoles, authUser } from "../middlewares/auth.js"
import {
    addNews,
    changeVisiblity,
    deleteNews,
    fetchAllNews,
    fetchAllVisibleNews
} from "../controllers/news.controller.js"

import { validate } from "../middlewares/validate.js"
import { validateParams } from "../middlewares/validateParams.js"
import { newsSchema, newsIdParamSchema } from "../validations/news.validation.js"

const newsRouter = express.Router()

// ✅ body validation
newsRouter.post(
    "/add",
    authUser,
    authorizeRoles("admin"),
    validate(newsSchema),
    addNews
)

// ✅ params validation
newsRouter.delete(
    "/delete/:newsId",
    authUser,
    authorizeRoles("admin"),
    validateParams(newsIdParamSchema),
    deleteNews
)

newsRouter.get(
    "/get-all",
    authUser,
    authorizeRoles("admin"),
    fetchAllNews
)

newsRouter.get(
    "/get-all/visible",
    fetchAllVisibleNews
)

// ✅ params validation
newsRouter.put(
    "/visibility/:newsId",
    authUser,
    authorizeRoles("admin"),
    validateParams(newsIdParamSchema),
    changeVisiblity
)

export default newsRouter