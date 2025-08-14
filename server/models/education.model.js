import mongoose from "mongoose";

const educationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true, index: true },

    ssc: {
        percentage: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
            set: val => parseFloat(val.toFixed(2))
        },
        passoutYear: { type: Number, required: true }
    },

    hsc: {
        percentage: {
            type: Number,
            min: 0,
            max: 100,
            set: val => parseFloat(val.toFixed(2))
        },
        passoutYear: { type: Number }
    },

    diploma: {
        percentage: {
            type: Number,
            min: 0,
            max: 100,
            set: val => parseFloat(val.toFixed(2))
        },
        passoutYear: { type: Number }
    },

    spi: [
        {
            type: Number,
            required: true,
            min: 0,
            max: 10,
            set: val => parseFloat(val.toFixed(2))
        }
    ],

    cpi: {
        type: Number,
        min: 0,
        max: 10,
        required: true,
        set: val => parseFloat(val.toFixed(2))
    },

    cgpa: {
        type: Number,
        min: 0,
        max: 10,
        required: true,
        set: val => parseFloat(val.toFixed(2))
    }

}, { timestamps: true });

const Education = mongoose.model('education', educationSchema);
export default Education;
