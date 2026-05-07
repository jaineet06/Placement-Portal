import Education from "../models/education.model.js";
import Student from "../models/student.model.js";

export const addOrUpdateEducationService = async (userId, data) => {
    const { ssc, hsc, diploma, spi, cpi, cgpa } = data;

    const student = await Student.findOne({ user: userId });
    if (!student) {
        return { error: "No student found for this user" };
    }

    let education = await Education.findOne({ user: userId });

    if (!education) {
        education = new Education({
            user: userId,
            ssc,
            hsc,
            diploma,
            spi,
            cpi,
            cgpa,
        });

        await education.save();

        return { created: true, education };
    } else {

        if (ssc !== undefined) education.ssc = ssc;
        if (hsc !== undefined) education.hsc = hsc;
        if (diploma !== undefined) education.diploma = diploma;

        if (spi) education.spi = spi;

        if (cpi !== undefined) education.cpi = cpi;
        if (cgpa !== undefined) education.cgpa = cgpa;

        await education.save();

        return { created: false, education };
    }
};


export const getEducationService = async (userId) => {
    const education = await Education.findOne({ user: userId });
    return education;
};