import News from "../models/news.model.js";

export const addNewsService = async (data) => {
    const { headline, tag, link } = data;

    const news = new News({
        headline,
        tag,
        link: link || ""
    });

    await news.save();

    return true;
};


export const deleteNewsService = async (newsId) => {
    const news = await News.findByIdAndDelete(newsId);
    return news;
};


export const fetchAllVisibleNewsService = async () => {
    const news = await News.find({ isVisible: true }).sort({ createdAt: -1 });
    return news;
};


export const fetchAllNewsService = async () => {
    const news = await News.find({}).sort({ createdAt: -1 });
    return news;
};


export const changeVisibilityService = async (newsId) => {
    const news = await News.findById(newsId);

    if (!news) return null;

    news.isVisible = !news.isVisible;
    await news.save();

    return news;
};