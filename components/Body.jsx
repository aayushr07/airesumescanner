// components/Body.jsx

"use client";

import { useState } from 'react';

export default function Body() {
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadClick = () => {
    // Placeholder for any future upload functionality
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
    }, 2000); // Simulate upload process
    
  };

  return (
    <main className="bg-gray-900 text-white min-h-screen flex flex-col">
      {/* Hero Section */}
      <section id="hero" className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <h1 className="text-5xl font-extrabold mb-6 transition-transform transform duration-1000 ease-in-out">
          Welcome to Resumelens
        </h1>
        <p className="text-xl mb-8 animation-fadeIn">
          Enhance your job search with our advanced AI resume scanner. Get valuable insights to make your resume stand out.
        </p>
        <p className="text-lg mb-12 max-w-3xl mx-auto animation-fadeIn">
          Our AI scanner provides detailed feedback on your resume's content and formatting, helping you tailor it to job descriptions and industry standards.
        </p>
      </section>

      {/* Call to Action Section */}
      <section id="cta" className="bg-teal-500 py-16 px-4 text-center">
        <h2 className="text-3xl font-bold mb-6 text-white">
          Ready to Improve Your Resume?
        </h2>
        <p className="text-lg mb-8 text-white">
          Join countless others who have enhanced their resumes with Resumelens. Start now!
        </p>
        <a
          href="/form"
          className={`bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-transform transform ${
            isUploading ? 'animate-bounce' : ''
          }`}
        >
          {isUploading ? 'Uploading...' : 'Upload Resume'}
        </a>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-gray-800 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 animation-fadeIn">
            Key Features
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-700 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl font-semibold mb-4">AI-Powered Analysis</h3>
              <p>Detailed insights on keyword relevance and formatting.</p>
            </div>
            <div className="bg-gray-700 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl font-semibold mb-4">Real-Time Feedback</h3>
              <p>Immediate suggestions for improvements as you upload your resume.</p>
            </div>
            <div className="bg-gray-700 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl font-semibold mb-4">User-Friendly Interface</h3>
              <p>Sleek design for an intuitive user experience.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-800 py-6 text-center">
        <p className="text-gray-400">© 2024 Resumelens. All rights reserved.</p>
      </footer>
    </main>
  );
}
