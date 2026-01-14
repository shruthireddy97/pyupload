import { useState } from "react";
import API from "../api/api";
import Header from "../components/Header";

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await API.post("/upload/", formData);
      setTranscript(res.data.transcript);
    } catch (error) {
      console.error("Upload failed:", error);
    }
    setUploading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header title="Upload" />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">Upload Audio File</h2>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6">
            <input
              type="file"
              className="hidden"
              id="fileInput"
              onChange={(e) => setFile(e.target.files[0])}
              accept="audio/*"
            />
            <label
              htmlFor="fileInput"
              className="cursor-pointer flex flex-col items-center"
            >
              <svg
                className="w-16 h-16 text-gray-400 mb-4"
                fill="blue"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <span className="text-gray-600">
                {file ? file.name : "Click to upload or drag and drop"}
              </span>
              <span className="text-sm text-gray-500 mt-2">
                Supported formats: MP3, WAV
              </span>
            </label>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className={`px-6 py-2 rounded-full ${
                !file || uploading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white transition-colors`}
            >
              {uploading ? "Uploading..." : "Upload File"}
            </button>
          </div>

          {transcript && (
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Transcript</h3>
              <pre className="whitespace-pre-wrap text-sm text-gray-700">
                {transcript}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
