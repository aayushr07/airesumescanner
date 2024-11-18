"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';

export default function FormPage() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // State to manage loading animation
  const router = useRouter();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please upload a file');
      return;
    }

    setLoading(true); // Start the loading animation

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await fetch('http://127.0.0.1:5000/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('resultData', JSON.stringify(data));  // Save result data in localStorage
        router.push('/result');  // Navigate to the result page
      } else {
        const data = await res.json();
        setError(data.message || 'Something went wrong');
      }
    } catch (err) {
      setError('Error submitting form');
    } finally {
      setLoading(false); // Stop the loading animation
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <h1 className="text-4xl font-bold mb-8">Upload Your Resume</h1>
        <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-md shadow-md w-full max-w-md">
          <div className="mb-6">
            <label className="block mb-2 text-lg font-medium">Select your resume:</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="block w-full text-white text-lg border border-gray-600 rounded-md bg-gray-700 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-teal-500 file:text-white hover:file:bg-teal-600"
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={loading} // Disable the button while loading
            className={`w-full py-3 px-6 text-white font-semibold text-lg rounded-md shadow-md transition-all duration-300 ${
              loading ? 'bg-teal-400 cursor-not-allowed' : 'bg-teal-500 hover:bg-teal-600'
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Submitting...
              </div>
            ) : (
              "Submit"
            )}
          </button>
          {loading && (
            <p className="text-gray-400 text-sm mt-4">
              This may take up to a few minutes, please wait...
            </p>
          )}
        </form>
      </div>
    </>
  );
}
