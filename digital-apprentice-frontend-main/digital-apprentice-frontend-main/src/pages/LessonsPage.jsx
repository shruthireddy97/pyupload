import { useEffect, useState } from "react";
import API from "../api/api";
import Wrapper from "../components/Wrapper";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";

export default function LessonsPage() {
  const [lessons, setLessons] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/lessons/").then((res) => setLessons(res.data.lessons));
  }, []);

  const handleStartLesson = (lesson) => {
        navigate(`/lessons/1`);
    //Logic to start the lesson, e.g., navigate to lesson detail page
    window.href = `http://localhost:8000/static/transcripts/${lesson}`;
  };

  const filteredLessons = lessons.filter(lesson =>
    lesson.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
      <div className="min-h-screen bg-gray-100">
        <Header title="Lessons" />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <svg className="w-6 h-6 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Available Lessons
            </h2>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Search lessons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 
                  focus:ring-blue-500 mb-6"
              />
              {filteredLessons.map(lesson => (
                <div key={lesson} className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-all duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {lesson}
                      </h3>
                      {/* <div className="flex items-center text-sm text-gray-600 mb-2">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {lesson.duration}
                      </div>
                      <p className="text-gray-600">{lesson.description}</p> */}
                    </div>

                    <button
                      onClick={() => 
                        handleStartLesson(lesson)}
                      className="ml-4 px-6 py-2.5 bg-blue-500 text-white rounded-full hover:bg-blue-600 
                        transition-colors duration-200 flex items-center group"
                    >
                      Start Lesson
                      <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" 
                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
  );
}
