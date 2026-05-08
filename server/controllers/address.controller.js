
import { addOrUpdateAddressService, getAddressesService } from "#services/address.service.js";

const addOrUpdateAddress = async (req, res, next) => {
  const { id } = req.user;

  try {
    const result = await addOrUpdateAddressService(id, req.validatedData);
    res.status(200).json({
      success: true,
      message: "Address added/updated successfully",
      address: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAddresses = async (req, res, next) => {
  const { id } = req.user;

  try {
    const address = await getAddressesService(id);
    res.status(200).json({
      success: true,
      address,
    });
  } catch (error) {
    next(error);
  }
};

export { addOrUpdateAddress, getAddresses };