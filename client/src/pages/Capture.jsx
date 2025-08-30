import React, { useRef, useState, useEffect } from "react";

const CapturePage = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [stream, setStream] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);

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
      setCapturedImage(canvasRef.current.toDataURL("image/png"));
    }
  };

  useEffect(() => {
    startCapture();
    return () => stopCapture();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[650px] bg-gray-100 overflow-hidden pb-12">
      <h1 className="text-2xl font-bold mb-2 text-blue-600">Live Capture</h1>

      <div className="rounded-lg shadow-lg bg-white p-4">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="rounded-lg w-[640px] h-[480px] object-cover"
        />
      </div>

      <div className="flex gap-4 mt-4">
        {isCapturing && (
          <button
            onClick={captureImage}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Capture Image
          </button>
        )}
        {isCapturing ? (
          <button
            onClick={stopCapture}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Stop Capture
          </button>
        ) : (
          <button
            onClick={startCapture}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Start Capture
          </button>
        )}
      </div>

      {capturedImage && (
        <div className="mt-10">
          <h2 className="font-semibold mb-3">Captured Image:</h2>
          <img
            src={capturedImage}
            alt="Captured"
            className="w-64 rounded-lg shadow"
          />
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CapturePage;
