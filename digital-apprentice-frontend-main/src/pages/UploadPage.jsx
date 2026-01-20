import { useState } from "react";
import API from "../api/api";
import Header from "../components/Header";

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError("");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await API.post(`/upload?user_id=${localStorage.getItem("user_id")}`, formData);
      setExtractedText(res.data.extracted_text);
    } catch (error) {
      console.error("Upload failed:", error);
      setError(error.response?.data?.detail || "Upload failed. Please try again.");
    }
    setUploading(false);
  };

  const getSupportedFormats = () => {
    return "MP3, WAV, PDF, DOCX, DOC, PNG, JPG, JPEG, BMP, TIFF";
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header title="Upload & Extract" />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-2">Upload File & Extract Text</h2>
          <p className="text-gray-600 mb-6">Upload audio, PDF, documents, or images to extract text</p>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6 hover:border-blue-500 transition-colors">
            <input
              type="file"
              className="hidden"
              id="fileInput"
              onChange={(e) => setFile(e.target.files[0])}
              accept=".mp3,.wav,.m4a,.flac,.ogg,.pdf,.docx,.doc,.png,.jpg,.jpeg,.bmp,.tiff,.tif"
            />
            <label
              htmlFor="fileInput"
              className="cursor-pointer flex flex-col items-center"
            >
              <svg
                className="w-16 h-16 text-gray-400 mb-4"
                fill="none"
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
              <span className="text-gray-600 font-medium">
                {file ? file.name : "Click to upload or drag and drop"}
              </span>
              <span className="text-sm text-gray-500 mt-2">
                Supported: {getSupportedFormats()}
              </span>
            </label>
          </div>

          {file && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Selected:</strong> {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </p>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="flex justify-center mb-6">
            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className={`px-8 py-3 rounded-full font-semibold transition-colors ${
                !file || uploading
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              {uploading ? "Processing..." : "Upload & Extract"}
            </button>
          </div>

          {extractedText && (
            <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold mb-3">Extracted Text</h3>
              <div className="max-h-96 overflow-y-auto bg-white p-3 rounded border border-gray-200">
                <p className="whitespace-pre-wrap text-sm text-gray-700">
                  {extractedText}
                </p>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(extractedText);
                  alert("Text copied to clipboard!");
                }}
                className="mt-3 px-4 py-2 text-gray-100 bg-gray-200 hover:bg-gray-300 rounded text-sm font-medium transition-colors text-white-200"
              >
                Copy Text
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
