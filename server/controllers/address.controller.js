import Address from "../models/address.model.js";
import Student from "../models/student.model.js";

// Add Address
const addAddress = async (req, res) => {

    const { type, address, city, state, pincode, country } = req.body;
    const { id } = req.user;

    try {
        const isStudentExist = await Student.findOne({ user: id });
        if (!isStudentExist) {
            return res.status(404).json({ success: false, message: "No Student exists with this ID" });
        }

        if (!type || !address || !city || !state || !pincode || !country) {
            return res.status(400).json({ success: false, message: "Provide all required address fields" });
        }

        const studentAddress = new Address({
            user: id,
            address,
            city,
            type,
            state,
            pincode,
            country,
        });

        await studentAddress.save();

        return res.status(201).json({ success: true, message: "Address added successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Update Address
const updateAddress = async (req, res) => {
    const { type, address, city, state, pincode, country } = req.body;
    const { id } = req.user;

    try {
        const isStudentExist = await Student.findOne({ user: id });
        if (!isStudentExist) {
            return res.status(404).json({ success: false, message: "No Student exists with this ID" });
        }

        if (!type || !address || !city || !state || !pincode || !country) {
            return res.status(400).json({ success: false, message: "Provide all required address fields" });
        }

        const existingAddress = await Address.findOne({ user: id });
        if (!existingAddress) {
            return res.status(404).json({ success: false, message: "Address not found. Please add address first." });
        }

        existingAddress.type = type;
        existingAddress.address = address;
        existingAddress.city = city;
        existingAddress.state = state;
        existingAddress.pincode = pincode;
        existingAddress.country = country;

        await existingAddress.save();

        return res.status(200).json({ success: true, message: "Address updated successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

export { addAddress, updateAddress };
