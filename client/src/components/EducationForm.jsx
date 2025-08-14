import React, { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";

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

  // Load existing education data
  const loadData = async () => {
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
      console.error(err);
      toast.error("Failed to load education data.");
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

  // Validation with toasts
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

    for (let i = 0; i < educationFormData.spi.length; i++) {
      const score = educationFormData.spi[i];
      if (score && (score < 0 || score > 10)) {
        toast.error(`SPI Semester ${i + 1} must be between 0 and 10`);
        return false;
      }
    }

    if (
      educationFormData.cpi &&
      (educationFormData.cpi < 0 || educationFormData.cpi > 10)
    ) {
      toast.error("CPI must be between 0 and 10");
      return false;
    }

    if (
      educationFormData.cgpa &&
      (educationFormData.cgpa < 0 || educationFormData.cgpa > 10)
    ) {
      toast.error("CGPA must be between 0 and 10");
      return false;
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

      const isHscFilled = payload.hsc.percentage > 0;
      const isDiplomaFilled = payload.diploma.percentage > 0;
      if (isHscFilled && isDiplomaFilled) {
        toast.error("Please provide either HSC or Diploma, not both.");
        setSaving(false);
        return;
      }
      if (!isHscFilled) delete payload.hsc;
      if (!isDiplomaFilled) delete payload.diploma;

      await axios.post("/api/education/add", payload);
      toast.success("Education details saved successfully.");
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
      <h2 className="text-xl font-semibold text-gray-800 border-b pb-3 mb-4">
        Education Details
      </h2>

      {/* SSC / HSC / Diploma */}
      {["ssc", "hsc", "diploma"].map((section) => (
        <div key={section} className="mb-6">
          <h3 className="text-lg font-medium text-gray-700 uppercase mb-3">
            {section}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="Percentage"
              value={educationFormData[section].percentage}
              onChange={(e) =>
                handleChange(section, "percentage", e.target.value)
              }
              min="0"
              max="100"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 "
            />
            <input
              type="number"
              placeholder="Passout Year"
              value={educationFormData[section].passoutYear}
              onChange={(e) =>
                handleChange(section, "passoutYear", e.target.value)
              }
              min="1900"
              max={new Date().getFullYear() + 1}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 "
            />
          </div>
        </div>
      ))}

      {/* SPI Scores */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-700 uppercase mb-3">
          SPI Scores
        </h3>
        {educationFormData.spi.map((score, idx) => (
          <div key={idx} className="flex items-center gap-2 mb-2">
            <input
              type="number"
              placeholder={`SPI Semester ${idx + 1}`}
              value={score}
              onChange={(e) => {
                const newSpi = [...educationFormData.spi];
                newSpi[idx] = e.target.value;
                setEducationFormData((prev) => ({ ...prev, spi: newSpi }));
              }}
              min="0"
              max="10"
              step="0.01"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {educationFormData.spi.length > 1 && (
              <button
                type="button"
                onClick={() => {
                  const newSpi = educationFormData.spi.filter(
                    (_, i) => i !== idx
                  );
                  setEducationFormData((prev) => ({
                    ...prev,
                    spi: newSpi.length ? newSpi : [""],
                  }));
                }}
                className="text-red-500 font-bold text-xl leading-none px-2 hover:text-red-700"
              >
                &times;
              </button>
            )}
          </div>
        ))}
        {educationFormData.spi.length < 8 &&
          educationFormData.spi[educationFormData.spi.length - 1] !== "" && (
            <button
              type="button"
              onClick={() =>
                setEducationFormData((prev) => ({
                  ...prev,
                  spi: [...prev.spi, ""],
                }))
              }
              className="mt-2 text-blue-600 hover:underline"
            >
              + Add SPI Semester
            </button>
          )}
      </div>

      {/* CPI / CGPA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input
          type="number"
          placeholder="CPI"
          value={educationFormData.cpi}
          onChange={(e) =>
            setEducationFormData({ ...educationFormData, cpi: e.target.value })
          }
          min="0"
          max="10"
          step="0.01"
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          placeholder="CGPA"
          value={educationFormData.cgpa}
          onChange={(e) =>
            setEducationFormData({ ...educationFormData, cgpa: e.target.value })
          }
          min="0"
          max="10"
          step="0.01"
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          className="px-5 py-2 rounded-lg text-white text-sm font-medium shadow-md transition bg-blue-600 hover:bg-blue-700"
        >
          {saving ? "Saving..." : "Save Details"}
        </button>
      </div>
    </div>
  );
};

export default EducationForm;
