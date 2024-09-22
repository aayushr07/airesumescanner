"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';

export default function FormPage() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();  // Initialize the useRouter hook

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please upload a file');
      return;
    }

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
          className="w-full py-3 px-6 bg-teal-500 hover:bg-teal-600 text-white font-semibold text-lg rounded-md shadow-md transition-all duration-300"
        >
          Submit
        </button>
      </form>
    </div>
    </>
  );
}
