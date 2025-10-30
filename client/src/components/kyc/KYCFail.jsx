import React from "react";
import { useNavigate } from "react-router-dom";

export default function KYCFail() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-red-50 text-center">
      <div className="bg-white shadow-lg p-8 rounded-2xl max-w-sm space-y-4">
        <h1 className="text-3xl font-bold text-red-600">❌ KYC Failed</h1>
        <p className="text-gray-700">
          We couldn't verify your identity. Please recheck your documents and try again.
        </p>
        <button
          onClick={() => navigate("/kyc/dl-validation")}
          className="mt-4 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg"
        >
          Retry KYC
        </button>
      </div>
    </div>
  );
}
