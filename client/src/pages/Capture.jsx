"use client";
import React, { useRef, useState, useEffect } from "react";
import { Upload, Camera, ArrowLeft } from "lucide-react";
import axios from "axios";
import { motion } from "framer-motion";
import Navbar from "../../components/navbar";

const BACKEND_URL = process.env.NODE_ENV === "development"
  ? "http://localhost:8000"
  : "https://aquanexus-production.up.railway.app";

const CapturePage = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [capturedImage, setCapturedImage] = useState(null);
  const [stream, setStream] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [mode, setMode] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const startCapture = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsCapturing(true);
      }
    } catch (err) {
      console.error("Error accessing webcam:", err);
      setError("Failed to access webcam. Please check permissions.");
    }
  };

  const stopCapture = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsCapturing(false);
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);

      canvasRef.current.toBlob(async (blob) => {
        const file = new File([blob], "captured-image.png", { type: "image/png" });
        setCapturedImage(URL.createObjectURL(file));
        await sendFileToBackend(file);
      }, "image/png");
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(URL.createObjectURL(file));
      await sendFileToBackend(file);
    }
  };

  const sendFileToBackend = async (file) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(`${BACKEND_URL}/predict`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Data from backend:", response.data);
      setResult(response.data);
    } catch (err) {
      setError("Failed to analyze image. Please try again.");
      console.error("Backend error:", err.response ? err.response.data : err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => stopCapture, []);

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-[#020617] via-[#071033] to-[#0b1226] pb-12 px-6 pt-40">
        {!mode && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl w-full">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="cursor-pointer bg-white/10 backdrop-blur-md rounded-xl p-8 flex flex-col items-center text-white shadow-lg hover:shadow-2xl transition"
              onClick={() => setMode("upload")}
            >
              <Upload size={48} className="text-purple-400 mb-4" />
              <h2 className="text-xl font-semibold mb-1">Upload File</h2>
              <p className="text-sm text-gray-200 text-center">
                Select an image from your device.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="cursor-pointer bg-white/10 backdrop-blur-md rounded-xl p-8 flex flex-col items-center text-white shadow-lg hover:shadow-2xl transition"
              onClick={() => setMode("live")}
            >
              <Camera size={48} className="text-green-400 mb-4" />
              <h2 className="text-xl font-semibold mb-1">Live Capture</h2>
              <p className="text-sm text-gray-200 text-center">
                Use your webcam to capture a live image.
              </p>
            </motion.div>
          </div>
        )}

        {(mode === "upload" || mode === "live") && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 w-full max-w-4xl"
          >
            {/* Upload Mode */}
            {mode === "upload" && (
              <div className="bg-white/20 backdrop-blur-lg rounded-3xl shadow-xl p-6 text-white">
                {!uploadedFile ? (
                  <label className="flex flex-col items-center gap-4 cursor-pointer">
                    <div className="w-48 h-32 border-2 border-dashed border-white/50 rounded-lg flex items-center justify-center">
                      <span>No file chosen</span>
                    </div>
                    <span className="px-6 py-3 bg-purple-600 rounded-xl hover:bg-purple-700 transition font-medium shadow-lg">
                      Choose File
                      <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                    </span>
                  </label>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <img src={uploadedFile} alt="Uploaded" className="w-full max-h-[400px] object-contain rounded-xl shadow-lg" />
                    <button
                      onClick={() => setUploadedFile(null)}
                      className="text-red-400 hover:underline"
                    >
                      Remove Image
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Live Mode */}
            {mode === "live" && (
              <div className="bg-white/20 backdrop-blur-lg rounded-3xl shadow-xl p-6 flex flex-col items-center text-white">
                <video ref={videoRef} autoPlay playsInline className="rounded-xl w-full max-w-lg shadow-lg" />
                <div className="flex gap-4 mt-6">
                  {isCapturing ? (
                    <>
                      <button onClick={captureImage} className="px-5 py-2 bg-blue-600 rounded-lg shadow hover:bg-blue-700 transition">
                        📸 Capture
                      </button>
                      <button onClick={stopCapture} className="px-5 py-2 bg-red-600 rounded-lg shadow hover:bg-red-700 transition">
                        ⏹ Stop
                      </button>
                    </>
                  ) : (
                    <button onClick={startCapture} className="px-5 py-2 bg-green-600 rounded-lg shadow hover:bg-green-700 transition">
                      ▶ Start
                    </button>
                  )}
                </div>
                {capturedImage && <img src={capturedImage} alt="Captured" className="mt-6 w-64 rounded-xl shadow-lg" />}
              </div>
            )}

            {/* Back Button */}
            <button
              onClick={() => { stopCapture(); setMode(null); }}
              className="mt-6 flex items-center gap-2 text-white hover:underline text-sm font-medium"
            >
              <ArrowLeft size={16} /> Back to Options
            </button>
          </motion.div>
        )}

        {/* Loading */}
        {loading && (
          <motion.div
            className="mt-8 flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="loader w-16 h-16 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-white font-medium text-lg animate-pulse">Analyzing image...</p>
          </motion.div>
        )}

        {/* Error */}
        {error && <p className="mt-6 text-red-400 font-medium">{error}</p>}

        {/* Results */}
        {result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 flex flex-col items-center gap-6 w-full max-w-4xl text-white"
          >
            <h3 className="text-2xl font-bold">Results</h3>

            {/* Labels */}
            <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 w-full">
              {result.labels && Array.isArray(result.labels) && result.labels.map((label, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.03 }}
                  className="bg-white/20 backdrop-blur-md p-4 rounded-2xl shadow-lg"
                >
                  <h3 className="text-lg font-semibold">{label}</h3>
                </motion.div>
              ))}
            </div>

            {/* Count */}
            <p className="text-indigo-300 font-medium">Total Count: {result.count}</p>

            {/* Annotated Image */}
            {result.annotated_image && (
              <img
                src={`${BACKEND_URL}/${result.annotated_image}`}
                alt="Annotated"
                className="mt-4 rounded-xl shadow-lg max-h-[400px]"
              />
            )}
          </motion.div>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </>
  );
};

export default CapturePage;
