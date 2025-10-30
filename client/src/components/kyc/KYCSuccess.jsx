import React from "react";
import { useNavigate } from "react-router-dom";

export default function KYCSuccess() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-50 text-center">
      <div className="bg-white shadow-lg p-8 rounded-2xl max-w-sm space-y-4">
        <h1 className="text-3xl font-bold text-green-600">✅ KYC Successful!</h1>
        <p className="text-gray-700">
          Your identity has been successfully verified. You can now proceed with driver onboarding.
        </p>
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-4 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}
