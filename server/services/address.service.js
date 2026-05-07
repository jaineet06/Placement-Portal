import Address from "../models/address.model.js";
import Student from "../models/student.model.js";

export const addOrUpdateAddressService = async (userId, data) => {
    const { type, address, city, state, pincode, country } = data;

    const studentExists = await Student.findOne({ user: userId });
    if (!studentExists) {
        return { error: "No Student exists with this ID" };
    }

    const existing = await Address.findOne({ user: userId, type });

    if (existing) {
        existing.address = address;
        existing.city = city;
        existing.state = state;
        existing.pincode = pincode;
        existing.country = country;
        await existing.save();
    } else {
        const newAddress = new Address({
            user: userId,
            type,
            address,
            city,
            state,
            pincode,
            country,
        });
        await newAddress.save();
    }

    return { success: true };
};


export const getAddressesService = async (userId) => {
    const addresses = await Address.find({ user: userId }).select(
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

    return formatted;
};