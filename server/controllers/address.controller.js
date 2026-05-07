import { addOrUpdateAddressService, getAddressesService } from "#services/address.service.js";

const addOrUpdateAddress = async (req, res) => {
    const { id } = req.user;    

    try {
        const result = await addOrUpdateAddressService(id, req.validatedData);

        if (result?.error) {
            return res.status(404).json({
                success: false,
                message: result.error
            });
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
        const formatted = await getAddressesService(id);

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