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

  const filteredUploads = uploads.filter((u) =>
    u.audio?.filename?.toLowerCase().includes(searchTerm.toLowerCase())
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
                className={`w-full text-left p-4 rounded-lg border hover:bg-blue-50 transition ${
                  selectedUpload?._id === upload._id
                    ? "border-blue-500 bg-blue-50"
                    : ""
                }`}
              >
                <p className="font-medium text-white">
                  {upload.audio.filename}
                </p>
                <p className="text-xs text-gray-200">
                  {new Date(upload.created_at).toLocaleString()}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Audio + Transcript */}
        <div className="md:col-span-2 bg-white rounded-lg shadow-md p-6">
          {!selectedUpload ? (
            <p className="text-gray-500">
              Select a lesson to view transcript and play audio
            </p>
          ) : (
            <>
              <h3 className="text-xl font-semibold mb-4">
                {selectedUpload.audio.filename}
              </h3>

              {/* Audio Player */}
              <audio
                controls
                className="w-full mb-6"
                src={selectedUpload.audio.cloudinary_url}
              />

              {/* Transcript */}
              <div className="border rounded-lg p-4 bg-gray-50 max-h-[400px] overflow-y-auto">
                <h4 className="font-semibold mb-2">Transcript</h4>
                <p className="whitespace-pre-wrap text-gray-700 text-sm">
                  {selectedUpload.transcript}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
