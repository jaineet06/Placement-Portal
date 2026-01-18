import React, { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";
import Spinner from "./Spinner";
import {
  GraduationCap,
  BookOpen,
  Plus,
  Trash2,
  Save,
  Info,
} from "lucide-react";

const defaultEducationData = {
  ssc: { percentage: "", passoutYear: "" },
  hsc: { percentage: "", passoutYear: "" },
  diploma: { percentage: "", passoutYear: "" },
  spi: [""],
  cpi: "",
  cgpa: "",
};

const EducationForm = () => {
  const [educationFormData, setEducationFormData] =
    useState(defaultEducationData);
  const [saving, setSaving] = useState(false);
  const { axios, verified } = useAppContext();
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/education/get");
      setEducationFormData({
        ...defaultEducationData,
        ...data.education,
        ssc: { ...defaultEducationData.ssc, ...(data.education?.ssc || {}) },
        hsc: { ...defaultEducationData.hsc, ...(data.education?.hsc || {}) },
        diploma: {
          ...defaultEducationData.diploma,
          ...(data.education?.diploma || {}),
        },
        spi: Array.isArray(data.education?.spi) ? data.education.spi : [""],
      });
    } catch (err) {
      toast.error("Failed to load education data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (verified) loadData();
  }, [verified]);

  const handleChange = (section, field, value) => {
    setEducationFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const validate = () => {
    for (let section of ["ssc", "hsc", "diploma"]) {
      const { percentage, passoutYear } = educationFormData[section];
      if (percentage && (percentage < 0 || percentage > 100)) {
        toast.error(`${section.toUpperCase()} percentage must be 0–100`);
        return false;
      }
      if (
        passoutYear &&
        (!/^\d{4}$/.test(passoutYear) ||
          passoutYear < 1900 ||
          passoutYear > new Date().getFullYear() + 1)
      ) {
        toast.error(`${section.toUpperCase()} passout year is invalid`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = {
        ...educationFormData,
        ssc: {
          ...educationFormData.ssc,
          percentage: Number(educationFormData.ssc.percentage) || 0,
          passoutYear: Number(educationFormData.ssc.passoutYear) || null,
        },
        hsc: {
          ...educationFormData.hsc,
          percentage: Number(educationFormData.hsc.percentage) || 0,
          passoutYear: Number(educationFormData.hsc.passoutYear) || null,
        },
        diploma: {
          ...educationFormData.diploma,
          percentage: Number(educationFormData.diploma.percentage) || 0,
          passoutYear: Number(educationFormData.diploma.passoutYear) || null,
        },
        spi: educationFormData.spi.map((v) => Number(v) || 0),
        cpi: Number(educationFormData.cpi) || 0,
        cgpa: Number(educationFormData.cgpa) || 0,
      };

      if (payload.hsc?.percentage > 0 && payload.diploma?.percentage > 0) {
        toast.error("Provide either HSC or Diploma, not both.");
        setSaving(false);
        return;
      }
      if (!payload.hsc?.percentage) delete payload.hsc;
      if (!payload.diploma?.percentage) delete payload.diploma;

      await axios.post("/api/education/add", payload);
      toast.success("Education credentials saved.");
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Spinner />
        <p className="mt-4 text-slate-500 font-medium animate-pulse">
          Analyzing academic records...
        </p>
      </div>
    );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
          <GraduationCap size={24} />
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Academic Profile
          </h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5 italic">
            Provide SSC and either HSC or Diploma
          </p>
        </div>
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {["ssc", "hsc", "diploma"].map((section) => (
            <div
              key={section}
              className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 hover:border-primary/30 transition-colors"
            >
              <h3 className="text-[11px] font-black text-primary uppercase tracking-[0.2em]">
                {section}
              </h3>
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase">
                    Percentage
                  </label>
                  <input
                    type="number"
                    value={educationFormData[section].percentage}
                    onChange={(e) =>
                      handleChange(section, "percentage", e.target.value)
                    }
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-800 focus:border-primary outline-none transition-all"
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase">
                    Year
                  </label>
                  <input
                    type="number"
                    value={educationFormData[section].passoutYear}
                    onChange={(e) =>
                      handleChange(section, "passoutYear", e.target.value)
                    }
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-800 focus:border-primary outline-none transition-all"
                    placeholder="YYYY"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white border border-slate-100 rounded-[2rem] p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
              <BookOpen size={16} className="text-primary" /> Semester SPI
              Scores
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {educationFormData.spi.map((score, idx) => (
              <div
                key={idx}
                className="relative group animate-in zoom-in-95 duration-200"
              >
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-1 block">
                  Sem {idx + 1}
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={score}
                    onChange={(e) => {
                      const newSpi = [...educationFormData.spi];
                      newSpi[idx] = e.target.value;
                      setEducationFormData((prev) => ({
                        ...prev,
                        spi: newSpi,
                      }));
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-black text-primary text-center focus:bg-white focus:border-primary outline-none transition-all"
                    placeholder="0.00"
                  />
                  {educationFormData.spi.length > 1 && (
                    <button
                      onClick={() => {
                        const newSpi = educationFormData.spi.filter(
                          (_, i) => i !== idx
                        );
                        setEducationFormData((prev) => ({
                          ...prev,
                          spi: newSpi.length ? newSpi : [""],
                        }));
                      }}
                      className="absolute -top-1 -right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <Trash2 size={10} />
                    </button>
                  )}
                </div>
              </div>
            ))}

            {educationFormData.spi.length < 8 && (
              <button
                type="button"
                onClick={() =>
                  setEducationFormData((prev) => ({
                    ...prev,
                    spi: [...prev.spi, ""],
                  }))
                }
                className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-slate-400 hover:text-primary py-2"
              >
                <Plus size={18} />
                <span className="text-[9px] font-black uppercase">Add Sem</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900 rounded-[2rem] p-8 text-white">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                Aggregate CPI
              </label>
              <Info size={12} className="text-slate-500" />
            </div>
            <input
              type="number"
              value={educationFormData.cpi}
              onChange={(e) =>
                setEducationFormData({
                  ...educationFormData,
                  cpi: e.target.value,
                })
              }
              className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-xl font-black text-primary placeholder:text-white/20 outline-none focus:bg-white/20 transition-all"
              placeholder="0.00"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                Final CGPA
              </label>
              <Info size={12} className="text-slate-500" />
            </div>
            <input
              type="number"
              value={educationFormData.cgpa}
              onChange={(e) =>
                setEducationFormData({
                  ...educationFormData,
                  cgpa: e.target.value,
                })
              }
              className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-xl font-black text-primary placeholder:text-white/20 outline-none focus:bg-white/20 transition-all"
              placeholder="0.00"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="flex items-center gap-2 px-12 py-4 bg-primary text-white rounded-2xl font-bold text-sm hover:bg-primary-dull hover:shadow-xl hover:shadow-primary/20 transition-all active:scale-95"
        >
          {saving ? (
            <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Save size={18} /> Lock Education Data
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default EducationForm;
