import { useEffect, useState } from "react";
import API from "../api/api";
import Header from "../components/Header";

export default function LessonsPage() {
  const [uploads, setUploads] = useState([]);
  const [selectedUpload, setSelectedUpload] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const userId = localStorage.getItem("user_id"); // or from auth context

  useEffect(() => {
    if (!userId) return;

    API.get(`/upload/user/${userId}`)
      .then((res) => setUploads(res.data))
      .catch(console.error);
  }, [userId]);

  const getDisplayFilename = (upload) => {
    return upload.original_file?.filename || upload.audio?.filename || "Unknown";
  };

  const getFileType = (upload) => {
    const ext = upload.file_type || upload.audio?.filename?.split(".").pop() || "";
    return ext.toUpperCase();
  };

  const isAudioFile = (upload) => {
    const audioExts = [".mp3", ".wav", ".m4a", ".flac", ".ogg"];
    const ext = upload.file_type || "";
    return audioExts.includes(ext.toLowerCase());
  };

  const filteredUploads = uploads.filter((u) =>
    getDisplayFilename(u).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Header title="My Lessons" />

      <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left: Upload List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Uploaded Lessons</h2>

          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full mb-4 px-3 py-2 border rounded-lg"
          />

          <div className="space-y-3">
            {filteredUploads.map((upload) => (
              <button
                key={upload._id}
                onClick={() => setSelectedUpload(upload)}
                className={`w-full text-left p-4 rounded-lg border transition ${
                  selectedUpload?._id === upload._id
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate text-sm">
                      {getDisplayFilename(upload)}
                    </p>
                    <p className="text-xs opacity-80 truncate">
                      {new Date(upload.created_at).toLocaleString()}
                    </p>
                  </div>
                  <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded whitespace-nowrap ${
                    selectedUpload?._id === upload._id
                      ? "bg-blue-400 text-blue-900"
                      : "bg-gray-600 text-gray-100"
                  }`}>
                    {getFileType(upload)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Audio + Transcript */}
        <div className="md:col-span-2 bg-white rounded-lg shadow-md p-6">
          {!selectedUpload ? (
            <p className="text-gray-500">
              Select a lesson to view content and text extraction
            </p>
          ) : (
            <>
              <h3 className="text-xl font-semibold mb-2">
                {getDisplayFilename(selectedUpload)}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Type: {getFileType(selectedUpload)} | {new Date(selectedUpload.created_at).toLocaleString()}
              </p>

              {/* Audio Player - Only for audio files */}
              {isAudioFile(selectedUpload) && (
                <div className="mb-6">
                  <h4 className="font-semibold mb-2">Audio Player</h4>
                  <audio
                    controls
                    className="w-full"
                    src={selectedUpload.original_file?.cloudinary_url}
                  />
                </div>
              )}

              {/* Document/Image Preview */}
              {!isAudioFile(selectedUpload) && (
                <div className="mb-6">
                  <h4 className="font-semibold mb-2">Document Preview</h4>
                  <a
                    href={selectedUpload.original_file?.cloudinary_url}
                    target="_blank"
                    style={{color: 'white'}}
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                  >
                    📄 Open Original File
                  </a>
                  <a
                    href={selectedUpload.pdf?.cloudinary_url}
                    target="_blank"
                    style={{color: 'white'}}
                    rel="noopener noreferrer"
                    className="ml-2 inline-block px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    📕 View Extracted PDF
                  </a>
                </div>
              )}

              {/* Extracted Text */}
              <div className="border rounded-lg p-4 bg-gray-50 max-h-[400px] overflow-y-auto">
                <h4 className="font-semibold mb-2">
                  {isAudioFile(selectedUpload) ? "Transcript" : "Extracted Text"}
                </h4>
                <p className="whitespace-pre-wrap text-gray-700 text-sm">
                  {selectedUpload.extracted_text || selectedUpload.transcript || "No text available"}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
