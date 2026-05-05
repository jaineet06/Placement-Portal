import Address from "../models/address.model.js";
import Student from "../models/student.model.js";

const addOrUpdateAddress = async (req, res) => {
    const { id } = req.user;    
    try {
        const { type, address, city, state, pincode, country } = req.validatedData;
        
        const studentExists = await Student.findOne({ user: id });
        if (!studentExists) {
            return res.status(404).json({
                success: false,
                message: "No Student exists with this ID"
            });
        }

        const existing = await Address.findOne({ user: id, type });

        if (existing) {
            existing.address = address;
            existing.city = city;
            existing.state = state;
            existing.pincode = pincode;
            existing.country = country;
            await existing.save();
        } else {
            const newAddress = new Address({
                user: id,
                type,
                address,
                city,
                state,
                pincode,
                country,
            });
            await newAddress.save();
        }

        return res.status(200).json({
            success: true,
            message: "Address added/updated successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};


const getAddresses = async (req, res) => {
    const { id } = req.user;
    try {
        const addresses = await Address.find({ user: id }).select(
            "type address city state pincode country"
        );

        const formatted = {
            permanent: {},
            current: {},
        };

        for (let addr of addresses) {
            const cleanAddr = {
                type: addr.type,
                address: addr.address,
                city: addr.city,
                state: addr.state,
                pincode: addr.pincode,
                country: addr.country
            };

            if (addr.type === "permanent") formatted.permanent = cleanAddr;
            if (addr.type === "current") formatted.current = cleanAddr;
        }

        return res.status(200).json({
            success: true,
            address: formatted,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

export { addOrUpdateAddress, getAddresses };