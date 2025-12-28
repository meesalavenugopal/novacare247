import React from 'react';
import { Link } from 'react-router-dom';

export default function StoryKelly() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 flex flex-col items-center">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-primary-600 mb-4">Kelly's Comeback Story</h1>
        <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Kelly Raj" className="w-32 h-32 rounded-full object-cover mx-auto mb-6 border-4 border-primary-100" />
        <p className="text-gray-700 mb-4">
          Kelly suffered a sports injury that kept him off the cricket field for months. Through a personalized recovery plan and ongoing support from NovaCare, Kelly made a full recovery and is now back to playing the sport he loves.
        </p>
        <p className="text-gray-600 mb-6 italic">“The personalized care and encouragement I received made all the difference. I’m back to playing cricket with my friends!”</p>
        <Link to="/" className="text-primary-600 hover:underline font-medium">&larr; Back to Home</Link>
      </div>
    </div>
  );
}
