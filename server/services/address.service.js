import Address from "../models/address.model.js";
import Student from "../models/student.model.js";
import AppError from "../utils/AppError.js";

export const addOrUpdateAddressService = async (userId, data) => {
  const { type, address, city, state, pincode, country } = data;

  const studentExists = await Student.findOne({ user: userId });
  if (!studentExists) {
    throw new AppError("No student exists with this ID", 404);
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
    await Address.create({
      user: userId,
      type,
      address,
      city,
      state,
      pincode,
      country,
    });
  }
};

export const getAddressesService = async (userId) => {
  const addresses = await Address.find({ user: userId }).select(
    "type address city state pincode country"
  );

  const formatted = { permanent: {}, current: {} };

  for (const addr of addresses) {
    const clean = {
      type: addr.type,
      address: addr.address,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      country: addr.country,
    };

    if (addr.type === "permanent") formatted.permanent = clean;
    if (addr.type === "current") formatted.current = clean;
  }

  return formatted;
};

