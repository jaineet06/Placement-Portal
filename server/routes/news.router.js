import express from "express"
import { authorizeRoles, authUser } from "../middlewares/auth.js"
import { addNews, changeVisiblity, deleteNews, fetchAllNews, fetchAllVisibleNews } from "../controllers/news.controller.js"

const newsRouter = express.Router()

newsRouter.post("/add", authUser, authorizeRoles("admin"), addNews)
newsRouter.delete("/delete/:newsId", authUser, authorizeRoles("admin"), deleteNews)
newsRouter.get("/get-all", authUser, authorizeRoles("admin"), fetchAllNews)
newsRouter.get("/get-all/visible", fetchAllVisibleNews)
newsRouter.put("/visibility/:newsId", authUser, authorizeRoles("admin"), changeVisiblity)

export default newsRouter

