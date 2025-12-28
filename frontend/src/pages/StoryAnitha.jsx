import React from 'react';
import { Link } from 'react-router-dom';

export default function StoryAnitha() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 flex flex-col items-center">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-primary-600 mb-4">Anitha's Success Story</h1>
        <img src="https://randomuser.me/api/portraits/women/65.jpg" alt="Anitha Reddy" className="w-32 h-32 rounded-full object-cover mx-auto mb-6 border-4 border-primary-100" />
        <p className="text-gray-700 mb-4">
          Anitha struggled with chronic back pain for years. After starting physiotherapy at NovaCare, she experienced significant relief and regained her quality of life. Anitha is now able to enjoy daily activities without pain.
        </p>
        <p className="text-gray-600 mb-6 italic">“Years of back pain are finally gone. The NovaCare team truly cares and gave me my life back!”</p>
        <Link to="/" className="text-primary-600 hover:underline font-medium">&larr; Back to Home</Link>
      </div>
    </div>
  );
}
