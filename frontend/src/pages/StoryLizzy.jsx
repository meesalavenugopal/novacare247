import React from 'react';
import { Link } from 'react-router-dom';

export default function StoryLizzy() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 flex flex-col items-center">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-primary-600 mb-4">Lizzy's Recovery Journey</h1>
        <video controls className="w-full rounded mb-6 bg-black">
          <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <p className="text-gray-700 mb-4">
          After a serious knee injury, Lizzy was unsure if she would ever walk pain-free again. With the help of NovaCare's expert physiotherapists, she regained her strength, mobility, and confidence. Today, Lizzy is back to jogging and enjoying her active lifestyle.
        </p>
        <p className="text-gray-600 mb-6 italic">“The encouragement and care I received at NovaCare made all the difference. I’m so grateful!”</p>
        <Link to="/" className="text-primary-600 hover:underline font-medium">&larr; Back to Home</Link>
      </div>
    </div>
  );
}
