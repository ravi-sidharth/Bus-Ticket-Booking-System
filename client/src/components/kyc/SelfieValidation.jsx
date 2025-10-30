import React, { useState, useRef, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function SelfieValidation() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [selfie, setSelfie] = useState(null);
  const [preview, setPreview] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access denied:", err);
      alert("Camera access denied. Please allow camera permission.");
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    const tracks = stream?.getTracks();
    tracks?.forEach((track) => track.stop());
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      const file = new File([blob], "selfie.jpg", { type: "image/jpeg" });
      setSelfie(file);
      setPreview(URL.createObjectURL(blob));
      stopCamera();
    }, "image/jpeg");
  };

  const handleLiveness = async (e) => {
    e.preventDefault();
    if (!selfie) return alert("Please capture your selfie first!");

    const formData = new FormData();
    formData.append("image", selfie);

    setLoading(true);
    setStatus("Checking Liveness...");

    try {
      const res = await axiosInstance.post("/checkLiveness", formData);
      const { statusCode } = res.data;

      if (statusCode === 200) {
        setStatus("Liveness Passed! Matching Faces...");
        await handleFaceMatch();
      } else {
        setStatus("Liveness Failed");
        navigate("/kyc/fail");
      }
    } catch (err) {
      console.error(err);
      setStatus("Liveness Check Error");
      navigate("/kyc/fail");
    } finally {
      setLoading(false);
    }
  };

  const handleFaceMatch = async () => {
    const idUrl = localStorage.getItem("idCard");
    if (!idUrl) return navigate("/kyc/fail");

    const idBlob = await fetch(idUrl).then((r) => r.blob());
    const idFile = new File([idBlob], "id.jpg", { type: idBlob.type });

    const formData = new FormData();
    formData.append("id", idFile);
    formData.append("selfie", selfie);

    try {
      const res = await axiosInstance.post("/matchFace", formData);
      const statusCode = res.data?.statusCode || 0;

      if (statusCode === 200) {
        setStatus("✅ Face Match Successful!");
        navigate("/kyc/success");
      } else {
        setStatus("❌ Face Mismatch");
        navigate("/kyc/fail");
      }
    } catch (err) {
      console.error(err);
      setStatus("❌ Face Match Failed");
      navigate("/kyc/fail");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg p-6 rounded-xl space-y-4">
      <h2 className="text-2xl font-semibold text-center text-blue-600">
        Selfie Validation
      </h2>

      {!preview && (
        <div className="flex flex-col items-center space-y-3">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-60 h-60 object-cover rounded-lg border-2 border-blue-400"
          />
          <button
            type="button"
            onClick={capturePhoto}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Capture Selfie
          </button>
        </div>
      )}

      {preview && (
        <div className="flex flex-col items-center space-y-3">
          <img
            src={preview}
            alt="Captured Selfie"
            className="w-60 h-60 object-cover rounded-lg border-2 border-green-500"
          />
          <button
            type="button"
            onClick={() => {
              setPreview(null);
              setSelfie(null);
              startCamera();
            }}
            className="text-sm text-blue-500 underline"
          >
            Retake Selfie
          </button>
        </div>
      )}

      <canvas ref={canvasRef} hidden />

      <form onSubmit={handleLiveness} className="space-y-3">
        <button
          type="submit"
          disabled={loading || !selfie}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg"
        >
          {loading ? "Processing..." : "Check Liveness"}
        </button>
      </form>

      {status && <p className="text-center text-sm text-gray-700">{status}</p>}
    </div>
  );
}
