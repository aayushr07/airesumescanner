"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const ResultPage = () => {
  const [result, setResult] = useState(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('resultData'));
    if (data) {
      setResult(data);
    }
  }, []);

  if (!result) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  }

  const { skills_match, experience_match, education_match, overall_percentage, skills, recommendations } = result;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6 space-y-6">
      <h1 className="text-4xl font-bold mb-6">Resume Analysis Results</h1>

      {/* Overall Match Card */}
      <motion.div
        className="w-80 h-80 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <CircularProgressbar
          value={overall_percentage}
          text={`${Math.round(overall_percentage)}%`}
          styles={buildStyles({
            textColor: '#fff',
            pathColor: '#00e676',
            trailColor: '#d6d6d6',
          })}
        />
      </motion.div>

      {/* Skills Match, Experience Match, and Education Match */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-5xl">
        <motion.div
          className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-lg font-semibold">Skills Match</h3>
          <CircularProgressbar
            value={skills_match}
            text={`${Math.round(skills_match)}%`}
            styles={buildStyles({
              textColor: '#fff',
              pathColor: '#03a9f4',
              trailColor: '#d6d6d6',
            })}
          />
        </motion.div>

        <motion.div
          className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-lg font-semibold">Experience Match</h3>
          <CircularProgressbar
            value={experience_match}
            text={`${Math.round(experience_match)}%`}
            styles={buildStyles({
              textColor: '#fff',
              pathColor: '#ff9800',
              trailColor: '#d6d6d6',
            })}
          />
        </motion.div>

        <motion.div
          className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-lg font-semibold">Education Match</h3>
          <CircularProgressbar
            value={education_match}
            text={`${Math.round(education_match)}%`}
            styles={buildStyles({
              textColor: '#fff',
              pathColor: '#f44336',
              trailColor: '#d6d6d6',
            })}
          />
        </motion.div>
      </div>

      {/* Skills List */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-3xl">
        <h3 className="text-2xl font-semibold mb-4">Extracted Skills</h3>
        <div className="grid grid-cols-2 gap-2">
          {skills.map((skill, index) => (
            <motion.div
              key={index}
              className="bg-gray-700 px-4 py-2 rounded-lg text-center"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              {skill}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Job Recommendations */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-3xl">
        <h3 className="text-2xl font-semibold mb-4">Recommended Jobs</h3>
        <ul className="space-y-2">
          {recommendations.map((job, index) => (
            <motion.li
              key={index}
              className="bg-gray-700 px-4 py-2 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              {job[0]} - Match: {Math.round(job[1] * 100)}%
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ResultPage;
