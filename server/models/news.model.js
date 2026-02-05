import mongoose from "mongoose";

const newsSchema = new mongoose.Schema({
    headline: { type: String, required: true },
    link: { type: String },
    tag: { type: String, required: true },
    isVisible: { type: Boolean, default: true }

}, { timestamps: true })

const News = mongoose.models.news || mongoose.model("News", newsSchema)

export default News;