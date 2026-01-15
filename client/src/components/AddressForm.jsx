import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useAppContext } from "../context/AppContext";
import Spinner from "./Spinner";

const defaultAddressData = {
  permanent: {
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  },
  current: {
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  },
};

const AddressForm = () => {
  const [addressFormData, setAddressFormData] = useState(defaultAddressData);
  const [saving, setSaving] = useState(false);
  const { axios, verified } = useAppContext();
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/address/get");
      const address = data.address || {};

      setAddressFormData({
        permanent: {
          address: address.permanent?.address || "",
          city: address.permanent?.city || "",
          state: address.permanent?.state || "",
          pincode: address.permanent?.pincode || "",
          country: address.permanent?.country || "India",
        },
        current: {
          address: address.current?.address || "",
          city: address.current?.city || "",
          state: address.current?.state || "",
          pincode: address.current?.pincode || "",
          country: address.current?.country || "India",
        },
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to load address data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (verified) {
      loadData();
    }
  }, [verified]);

  const handleChange = (type, field, value) => {
    setAddressFormData((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value,
      },
    }));
  };

  const copyPermanentToCurrent = () => {
    setAddressFormData((prev) => ({
      ...prev,
      current: { ...prev.permanent },
    }));
    toast.success("Permanent address copied to current address.");
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const perm = addressFormData.permanent;
      const curr = addressFormData.current;

      await Promise.all([
        axios.post("/api/address/save", { type: "permanent", ...perm }),
        axios.post("/api/address/save", { type: "current", ...curr }),
      ]);

      toast.success("Address details saved successfully.");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setSaving(false);
    }
  };

  return loading ? (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[60vh]">
      <Spinner />
      <p className="mt-2 text-sm font-normal">Fetching details...</p>
    </div>
  ) : (
    <div className="relative max-w-3xl mx-auto">
      <div className="absolute -top-16 -right-12 w-64 h-64 rounded-full bg-gradient-to-br from-primary/20 to-blue-100/10 blur-3xl opacity-80 pointer-events-none transform rotate-12"></div>
      <div className="p-6 space-y-6 relative bg-white/30 bg-gradient-to-br from-white/30 via-white/30 to-blue-50/30 backdrop-blur-md rounded-xl shadow-xl border border-white/20 ring-1 ring-white/10">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-3 mb-4">
          Address Details
        </h2>

      {["permanent", "current"].map((type) => (
        <div key={type} className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-medium text-gray-700 capitalize">
              {type} Address
            </h3>
            {type === "current" && (
              <button
                type="button"
                onClick={copyPermanentToCurrent}
                className="text-sm text-blue-600 hover:underline cursor-pointer"
              >
                Copy from Permanent
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {Object.entries({
              address: "Address",
              city: "City",
              state: "State",
              pincode: "Pincode",
              country: "Country",
            }).map(([field, label]) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  {label}
                </label>
                <input
                  type="text"
                  value={addressFormData[type][field]}
                  onChange={(e) => handleChange(type, field, e.target.value)}
                  className="w-full rounded-lg border border-gray-300 text-sm px-3 py-2 bg-white/10 focus:border-blue-500 focus:ring focus:ring-blue-100 "
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="flex justify-end pt-4">
        <button
          onClick={handleSubmit}
          className={`px-5 py-2 rounded-lg text-white text-sm font-medium shadow-md transition cursor-pointer bg-primary hover:bg-primary-dull`}
        >
          {saving ? "Saving..." : "Save Details"}
        </button>
      </div>
    </div>
    </div>
  );
};

export default AddressForm;
