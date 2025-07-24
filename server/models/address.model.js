import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true, index: true },
    type: { type: String, enum: ['permanent', 'current'], default: 'permanent' },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: Number, required: true },
    country: { type: String, default: "India" }
}, { timestamps: true })

const Address = mongoose.model('address', addressSchema)

export default Address