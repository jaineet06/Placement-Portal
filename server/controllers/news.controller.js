
import {
  addNewsService,
  deleteNewsService,
  fetchAllVisibleNewsService,
  fetchAllNewsService,
  changeVisibilityService
} from "../services/news.service.js";

const addNews = async (req, res, next) => {
  try {
    await addNewsService(req.validatedData);
    res.status(201).json({ success: true, message: "News added successfully" });
  } catch (error) {
    next(error);
  }
};

const deleteNews = async (req, res, next) => {
  const { newsId } = req.validatedParams;
  try {
    await deleteNewsService(newsId);
    res.status(200).json({ success: true, message: "News deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const fetchAllVisibleNews = async (req, res, next) => {
  try {
    const news = await fetchAllVisibleNewsService();
    res.status(200).json({ success: true, message: "News fetched successfully", news });
  } catch (error) {
    next(error);
  }
};

const fetchAllNews = async (req, res, next) => {
  try {
    const news = await fetchAllNewsService();
    res.status(200).json({ success: true, message: "News fetched successfully", news });
  } catch (error) {
    next(error);
  }
};

const changeVisiblity = async (req, res, next) => {
  const { newsId } = req.validatedParams;
  try {
    const news = await changeVisibilityService(newsId);
    res.status(200).json({
      success: true,
      message: `News is now ${news.isVisible ? "Visible" : "Hidden"}`,
    });
  } catch (error) {
    next(error);
  }
};

export { addNews, deleteNews, fetchAllNews, fetchAllVisibleNews, changeVisiblity };