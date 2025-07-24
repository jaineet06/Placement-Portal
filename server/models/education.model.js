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


// Custom validation to enforce either HSC or Diploma (but not both)
educationSchema.pre('validate', function (next) {
    const education = this;

    // HSC and Diploma - mutually exclusive
    if (education.hsc.percentage && education.diploma.percentage) {
        return next(new Error("Provide either HSC or Diploma, not both."));
    }

    // One of HSC or Diploma must be present
    if (!education.hsc.percentage && !education.diploma.percentage) {
        return next(new Error("Either HSC or Diploma is required."));
    }

    // SPI must contain at least one value
    if (!education.spi || education.spi.length === 0) {
        return next(new Error("Provide at least one SPI value."));
    }

    next();
});

const Education = mongoose.model('education', educationSchema);
export default Education;
