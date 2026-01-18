import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useAppContext } from "../context/AppContext";
import Spinner from "./Spinner";
import { MapPin, Navigation, Copy, Save, Globe } from "lucide-react";

const defaultAddressData = {
  permanent: {
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  },
  current: { address: "", city: "", state: "", pincode: "", country: "India" },
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
      toast.error("Failed to load address data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (verified) loadData();
  }, [verified]);

  const handleChange = (type, field, value) => {
    setAddressFormData((prev) => ({
      ...prev,
      [type]: { ...prev[type], [field]: value },
    }));
  };

  const copyPermanentToCurrent = () => {
    setAddressFormData((prev) => ({
      ...prev,
      current: { ...prev.permanent },
    }));
    toast.success("Address copied successfully");
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
      toast.success("Addresses updated successfully.");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Spinner />
        <p className="mt-4 text-slate-500 font-medium animate-pulse">
          Locating records...
        </p>
      </div>
    );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
          <Navigation size={24} />
        </div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          Residential Details
        </h2>
      </div>

      {["permanent", "current"].map((type) => (
        <div key={type} className="group">
          <div className="flex justify-between items-center mb-6 border-b border-slate-50 pb-2">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary block"></span>
              {type} Residence
            </h3>
            {type === "current" && (
              <button
                type="button"
                onClick={copyPermanentToCurrent}
                className="flex items-center gap-2 text-[11px] font-black text-primary uppercase tracking-wider bg-primary/5 px-3 py-1.5 rounded-lg hover:bg-primary hover:text-white transition-all duration-300 shadow-sm shadow-primary/5"
              >
                <Copy size={12} /> Same as Permanent
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">
                Street Address
              </label>
              <input
                type="text"
                value={addressFormData[type].address}
                onChange={(e) => handleChange(type, "address", e.target.value)}
                placeholder="House No, Street, Landmark"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-slate-300"
              />
            </div>

            {Object.entries({
              city: "City",
              state: "State",
              pincode: "Pincode",
              country: "Country",
            }).map(([field, label]) => (
              <div key={field} className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                  {field === "country" && <Globe size={12} />} {label}
                </label>
                <input
                  type="text"
                  value={addressFormData[type][field]}
                  onChange={(e) => handleChange(type, field, e.target.value)}
                  placeholder={label}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-slate-300"
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="pt-6 border-t border-slate-50 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="flex items-center gap-2 px-10 py-4 bg-primary text-white rounded-2xl font-bold text-sm hover:bg-primary-dull hover:shadow-xl hover:shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
        >
          {saving ? (
            <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Save size={18} /> Update Addresses
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AddressForm;
