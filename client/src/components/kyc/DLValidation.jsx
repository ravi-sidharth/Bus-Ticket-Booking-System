import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
 

export default function DLValidation() {
  const navigate = useNavigate();
  const [frontImage, setFrontImage] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!frontImage ) return alert("Upload Driving Licence.");

    const formData = new FormData();
    formData.append("image", frontImage);
    formData.append("countryId", "ind");
    formData.append("documentId", "dl1");

    setLoading(true);
    setStatus("Validating Driving Licence...");

    try {
      const res = await axiosInstance.post("/readId", formData);
      console.log("DL Validation Response:", res.data);

      const  expiryDate  = res.data?.result?.details[0]?.fieldsExtracted?.dateOfExpiry?.value || {};
      const today = new Date();
      const expiry = expiryDate ? new Date(expiryDate) : null;

      if (expiry && expiry < today) {
        setStatus("DL Expired. Cannot proceed.");
        navigate('/kyc/fail')
        
        return;
      }

      setStatus("DL Validated Successfully");

      setTimeout(() => navigate("/kyc/id-validation"), 1500);
    } catch (err) {
      console.error(err);
      setStatus("DL Validation Failed");
      navigate('/kyc/fail')
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg p-6 rounded-xl space-y-4">
      <h2 className="text-2xl font-semibold text-center text-blue-600">
        Driving Licence Validation
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <p className="font-semibold">Front Side</p>
          <input type="file" accept=".jpg,.png,.jpeg, pdf" onChange={(e) => setFrontImage(e.target.files[0])} />
        </div>

        <button
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg"
        >
          {loading ? "Processing..." : "Validate DL"}
        </button>
      </form>

      {status && <p className="text-center text-sm text-gray-700">{status}</p>}
    </div>
  );
}
