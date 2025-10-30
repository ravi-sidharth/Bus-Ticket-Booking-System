import React, { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function IDValidation() {
  const navigate = useNavigate();
  const [idFile, setIdFile] = useState(null);
  const [documentId,setDocumentId] = useState("pan")
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  console.log(documentId)

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!idFile) return alert("Upload an ID document.");

    const formData = new FormData();
    formData.append("image", idFile);
    formData.append("countryId", "ind");
    formData.append("documentId", documentId);
    formData.append("expectedDocumentSide", "front");

    setLoading(true);
    setStatus("Validating ID Card...");

    try {
      const res = await axiosInstance.post("/readId", formData);
      console.log("ID Validation Response:", res.data);

      if (res.data?.statusCode == 200) {
        setStatus("ID Card Validated Successfully");

        localStorage.setItem("idCard", URL.createObjectURL(idFile));

        setTimeout(() => navigate("/kyc/selfie"), 1500);
      } else {
        setStatus("Invalid ID Card");
      }
    } catch (err) {
      console.error(err);
      setStatus("ID Validation Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg p-6 rounded-xl space-y-4">
      <h2 className="text-2xl font-semibold text-center text-blue-600">
        ID Card Validation
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <select onChange={(e) => setDocumentId(e.target.value)} defaultValue="pan" className="w-full border">
          <option value="pan">Pan Card</option>
          <option value="id">Aadhaar Card</option>
          <option value="passport">Passport</option>
        </select>
        <input
          type="file"
          accept=".jpg,.png,.jpeg,.pdf"
          onChange={(e) => setIdFile(e.target.files[0])}
          className="w-full border border-gray-300 p-2 rounded-lg text-sm"
        />
        <button
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg"
        >
          {loading ? "Processing..." : "Validate ID"}
        </button>
      </form>

      {status && <p className="text-center text-sm text-gray-700">{status}</p>}
    </div>
  );
}
