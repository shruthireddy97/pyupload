import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';

const LessonDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-100">
      <Header title="Lesson Content" />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <button
            onClick={() => navigate('/lessons')}
            className="mb-6 flex items-center text-white hover:text-gray-300"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Lessons
          </button>

          <h1 className="text-3xl font-bold mb-6">Introduction to Digital Skills</h1>

          <div className="prose max-w-none">
            <p className="mb-4">
              In today's digital age, understanding and mastering digital skills has become essential for both personal and professional growth. Digital literacy encompasses a wide range of abilities, from basic computer operations to complex problem-solving using digital tools.
            </p>

            <p className="mb-4">
              The foundation of digital literacy begins with understanding how to effectively use computers and mobile devices. This includes navigating operating systems, managing files and folders, and utilizing basic software applications. As technology continues to evolve, these fundamental skills serve as building blocks for more advanced digital capabilities.
            </p>

            <p className="mb-4">
              Internet skills form another crucial component of digital literacy. This includes understanding how to safely browse the web, use search engines effectively, and evaluate online information critically. In an era where information is abundant, the ability to distinguish reliable sources from unreliable ones has become increasingly important.
            </p>

            <p className="mb-4">
              Communication in the digital world requires its own set of skills. From composing professional emails to participating in video conferences, understanding digital communication etiquette and tools is vital for success in modern workplaces and online learning environments.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonDetailPage;