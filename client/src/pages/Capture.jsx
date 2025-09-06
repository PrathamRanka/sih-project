import React, { useRef, useState, useEffect } from "react";
import { Upload, Camera, ArrowLeft } from "lucide-react";
import axios from "axios";

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
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post(
        "http://localhost:5000/api/results",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setResult(response.data.data);
    } catch (err) {
      setError("Failed to analyze image. Please try again.");
      console.error("Backend error:", err.response ? err.response.data : err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => stopCapture();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[650px] bg-gradient-to-b from-gray-100 to-gray-200 pb-12 px-6">
      {!mode && (
        <h1 className="text-3xl font-bold mb-8 text-blue-700">Choose an option :</h1>
      )}

      {!mode && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl w-full">
          <div onClick={() => setMode("upload")} className="cursor-pointer bg-white rounded-xl shadow-md p-6 flex flex-col items-center hover:shadow-lg hover:scale-[1.02] transition">
            <Upload size={48} className="text-purple-600 mb-4" />
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Upload File</h2>
            <p className="text-gray-500 text-sm text-center">Select an image from your device.</p>
          </div>
          <div onClick={() => setMode("live")} className="cursor-pointer bg-white rounded-xl shadow-md p-6 flex flex-col items-center hover:shadow-lg hover:scale-[1.02] transition">
            <Camera size={48} className="text-green-600 mb-4" />
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Live Capture</h2>
            <p className="text-gray-500 text-sm text-center">Use your webcam to capture a live image.</p>
          </div>
        </div>
      )}
      
      {mode === "upload" && (
        <div className="mt-6 bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
          <div className="p-4 text-center">
            <h2 className="text-xl font-semibold text-black flex items-center justify-center gap-2">📂 Upload an Image</h2>
          </div>
          <div className="p-6 flex flex-col items-center">
            {!uploadedFile ? (
              <>
                <div className="w-40 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mb-6 bg-gray-50">
                  <span className="text-gray-400 text-sm">No file chosen</span>
                </div>
                <label className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl cursor-pointer font-medium shadow-lg transition">
                  Choose File
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                </label>
              </>
            ) : (
              <>
                <h3 className="font-semibold mb-3 text-gray-700">Uploaded File:</h3>
                <img src={uploadedFile} alt="Uploaded" className="w-full max-h-[400px] object-contain rounded-lg shadow-lg mb-4" />
                <label className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg cursor-pointer font-medium shadow-md transition">
                  Upload Another
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                </label>
                <button onClick={() => setUploadedFile(null)} className="mt-3 text-red-500 hover:underline text-sm">
                  Remove Image
                </button>
              </>
            )}
            <div className="mt-6">
              <button onClick={() => setMode(null)} className="flex items-center gap-2 text-blue-600 hover:underline text-sm font-medium">
                ← Back to Options
              </button>
            </div>
          </div>
        </div>
      )}

      {mode === "live" && (
        <div className="mt-6 bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">🎥 Live Capture</h2>
          <div className="rounded-lg shadow-lg bg-black p-1">
            <video ref={videoRef} autoPlay playsInline className="rounded-lg w-[640px] h-[480px] object-cover" />
          </div>
          <div className="flex gap-4 mt-6">
            {isCapturing && (
              <button onClick={captureImage} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow">📸 Capture Image</button>
            )}
            {isCapturing ? (
              <button onClick={stopCapture} className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium shadow">⏹ Stop Capture</button>
            ) : (
              <button onClick={startCapture} className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium shadow">▶ Start Capture</button>
            )}
          </div>
          {capturedImage && (
            <div className="mt-8">
              <h3 className="font-semibold mb-3 text-gray-700">Captured Image:</h3>
              <img src={capturedImage} alt="Captured" className="w-64 rounded-lg shadow-lg mx-auto" />
            </div>
          )}
          <div className="mt-6">
            <button onClick={() => { stopCapture(); setMode(null); }} className="flex items-center gap-2 text-blue-600 hover:underline text-sm font-medium">
              <ArrowLeft size={16} /> Back to Options
            </button>
          </div>
        </div>
      )}
      
      {loading && <p className="mt-6 text-blue-600">Analyzing image...</p>}
      {error && <p className="mt-6 text-red-600">{error}</p>}
      {result && (
        <div className="mt-6 bg-white p-4 rounded-lg shadow-md w-full max-w-lg">
          <h3 className="font-semibold mb-2 text-gray-800">Analysis Result:</h3>
          <ul className="list-disc pl-6 text-gray-700">
            {result.finalDetections.map((d, i) => (
              <>
              <li key={i}>{d.species} </li>
              <li key={i}>Count: {d.count}</li>
              </>
            ))}
          </ul>
          <p className="text-sm text-gray-500 mt-2"></p>
        </div>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CapturePage;