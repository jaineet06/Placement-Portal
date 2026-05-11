
import News from "../models/news.model.js";
import AppError from "../utils/AppError.js";

export const addNewsService = async ({ headline, tag, link }) => {
  await News.create({ headline, tag, link: link || "" });
};

export const deleteNewsService = async (newsId) => {
  const news = await News.findByIdAndDelete(newsId);
  if (!news) throw new AppError("No news found with this ID", 404);
};

export const fetchAllVisibleNewsService = async () => {
  const news = await News.find({ isVisible: true }).sort({ createdAt: -1 });
  if (!news.length) throw new AppError("No visible news available", 200);
  return news;
};

export const fetchAllNewsService = async () => {
  const news = await News.find({}).sort({ createdAt: -1 });
  if (!news.length) throw new AppError("No news available", 200);
  return news;
};

export const changeVisibilityService = async (newsId) => {
  const news = await News.findById(newsId);
  if (!news) throw new AppError("No news found with this ID", 404);
  news.isVisible = !news.isVisible;
  await news.save();
  return news;
};