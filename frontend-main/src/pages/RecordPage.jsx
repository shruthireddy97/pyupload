import React, { useState } from 'react';
import { useReactMediaRecorder } from 'react-media-recorder';
import Header from '../components/Header';
import API from '../api/api';

const RecordPage = () => {
  const [uploadStatus, setUploadStatus] = useState('');
  const [uploading, setUploading] = useState(false);

  const {
    status,
    startRecording,
    stopRecording,
    mediaBlobUrl
  } = useReactMediaRecorder({
    audio: true,
    mediaType: 'audio/wav'
  });

  const handleUpload = async () => {
    if (!mediaBlobUrl) return;
    setUploading(true);
    setUploadStatus('');

    try {
      const response = await fetch(mediaBlobUrl);
      const blob = await response.blob();
      const formData = new FormData();
      formData.append('file', blob, 'recording.wav');

      const uploadResponse = await API.post('/upload/', formData);
      setUploadStatus('Recording uploaded successfully!');
    } catch (error) {
      console.error('Error uploading recording:', error);
      setUploadStatus('Failed to upload recording');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header title="Record" />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">Voice Recorder</h2>
          
          {/* Recording Status Indicator */}
          <div className="mb-8 text-center">
            <div className={`inline-flex items-center px-4 py-2 rounded-full ${
              status === 'recording' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
            }`}>
              <div className={`w-3 h-3 rounded-full mr-2 ${
                status === 'recording' ? 'bg-red-500 animate-pulse' : 'bg-gray-500'
              }`}></div>
              {status === 'recording' ? 'Recording in progress...' : 'Ready to record'}
            </div>
          </div>

          {/* Controls Section */}
          <div className="flex flex-col items-center space-y-6">
            <div className="flex space-x-4">
              <button
                onClick={startRecording}
                disabled={status === 'recording'}
                className={`px-8 py-3 rounded-full font-medium ${
                  status === 'recording'
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : 'bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl'
                } transition-all duration-200`}
              >
                Start Recording
              </button>
              <button
                onClick={stopRecording}
                disabled={status !== 'recording'}
                className={`px-8 py-3 rounded-full font-medium ${
                  status !== 'recording'
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : 'bg-gray-800 hover:bg-gray-900 text-white shadow-lg hover:shadow-xl'
                } transition-all duration-200`}
              >
                Stop Recording
              </button>
            </div>

            {/* Audio Preview and Upload Section */}
            {mediaBlobUrl && (
              <div className="w-full max-w-md bg-gray-50 p-4 rounded-lg mt-6">
                <h3 className="text-lg font-semibold mb-3">Preview Recording</h3>
                <audio 
                  controls 
                  className="w-full mb-4"
                  src={mediaBlobUrl}
                >
                  Your browser does not support the audio element.
                </audio>
                
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className={`w-full px-8 py-3 rounded-full font-medium 
                    ${uploading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl'
                    } transition-all duration-200`}
                >
                  {uploading ? 'Uploading...' : 'Upload Recording'}
                </button>

                {uploadStatus && (
                  <p className={`mt-3 text-center ${
                    uploadStatus.includes('Failed') 
                      ? 'text-red-500' 
                      : 'text-green-500'
                  }`}>
                    {uploadStatus}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordPage;
