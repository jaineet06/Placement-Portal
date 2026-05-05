import News from "../models/news.model.js"


const addNews = async (req, res) => {

    // ✅ from middleware
    const { headline, tag, link } = req.validatedData;

    try {
        const news = new News({
            headline,
            tag,
            link: link || ""
        })

        await news.save();

        return res.json({ success: true, message: "News Added Succesfully" })
    } catch (error) {
        console.log("Add News Error: " + error.message)
        res.json({ success: false, message: 'Internal Server error' });
    }
}


const deleteNews = async (req, res) => {

    // ✅ from middleware
    const { newsId } = req.validatedParams;

    try {
        const news = await News.findByIdAndDelete(newsId);

        if (!news) {
            return res.json({ success: false, message: "No news found" })
        }

        return res.json({ success: true, message: "News Deleted Succesfully" })
    } catch (error) {
        console.log("Delete News Error: " + error.message)
        res.json({ success: false, message: 'Internal Server error' });
    }
}


const fetchAllVisibleNews = async (req, res) => {
    try {
        const news = await News.find({ isVisible: true }).sort({ createdAt: -1 });

        if (news.length === 0) {
            return res.json({ success: false, message: "No news available" })
        }

        return res.json({ success: true, message: "News Fetched Succesfully", news })
    } catch (error) {
        console.log("Fetch Visible News Error: " + error.message)
        res.json({ success: false, message: 'Internal Server error' });
    }
}


const fetchAllNews = async (req, res) => {
    try {
        const news = await News.find({}).sort({ createdAt: -1 });

        if (news.length === 0) {
            return res.json({ success: false, message: "No news available" })
        }

        return res.json({ success: true, message: "News Fetched Succesfully", news })
    } catch (error) {
        console.log("Fetch News Error: " + error.message)
        res.json({ success: false, message: 'Internal Server error' });
    }
}


const changeVisiblity = async (req, res) => {

    // ✅ from middleware
    const { newsId } = req.validatedParams;

    try {
        const news = await News.findById(newsId);

        if (!news) {
            return res.json({ success: false, message: "No news found" })
        }

        news.isVisible = !news.isVisible
        await news.save()

        return res.json({
            success: true,
            message: `News is now ${news.isVisible ? 'Visible' : 'Hidden'}`,
        });
    } catch (error) {
        console.log("Change Visiblity Error: " + error.message)
        res.json({ success: false, message: 'Internal Server error' });
    }
}

export { addNews, deleteNews, fetchAllNews, fetchAllVisibleNews, changeVisiblity }