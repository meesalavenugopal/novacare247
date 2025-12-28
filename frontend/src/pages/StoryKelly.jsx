import React from 'react';
import { Link } from 'react-router-dom';

export default function StoryKelly() {
  return (
    <main className="min-h-screen bg-gray-50 py-16 px-4 flex flex-col items-center">
      <article className="max-w-2xl w-full bg-white rounded-lg shadow-md p-8 prose prose-primary">
        <header className="flex flex-col items-center mb-8">
          <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Kelly Raj" className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-primary-100" />
          <h1 className="text-4xl font-extrabold text-primary-700 mb-2 text-center">Kelly's Comeback: Back in the Game</h1>
          <p className="text-lg text-gray-500 text-center">How NovaCare helped Kelly return to cricket after a sports injury</p>
        </header>
        <section className="mb-6">
          <p>
            Kelly Raj, a passionate amateur cricketer, faced a major setback after a ligament injury during a local match. "I was worried I’d never play again," he admits. "The pain and frustration were overwhelming."
          </p>
          <p>
            Determined to get back on the field, Kelly turned to <span className="font-semibold text-primary-600">NovaCare Physiotherapy</span>. The team assessed his injury and designed a personalized recovery plan, combining strengthening exercises, balance training, and regular check-ins. "They explained every step and kept me motivated throughout."
          </p>
          <blockquote className="border-l-4 border-primary-300 pl-4 italic text-primary-700 my-4">
            “The personalized care and encouragement I received made all the difference. I’m back to playing cricket with my friends!”
          </blockquote>
          <p>
            After months of dedication, Kelly regained his strength and confidence. He now plays cricket every weekend and encourages his teammates to prioritize proper recovery and injury prevention.
          </p>
        </section>
        <section className="mt-8">
          <h2 className="text-2xl font-bold text-primary-700 mb-2">Kelly's Recovery Lessons</h2>
          <ul className="list-disc pl-6 text-gray-700">
            <li>Follow your physiotherapist’s advice and stay consistent.</li>
            <li>Don’t rush—healing takes time and patience.</li>
            <li>Stay positive and focus on your goals.</li>
          </ul>
        </section>
        <div className="flex flex-col sm:flex-row gap-4 mt-10">
          <Link to="/" className="flex-1 text-center py-3 rounded bg-primary-600 text-white font-semibold shadow hover:bg-primary-700 transition">&larr; Back to Home</Link>
          <Link to="/book-appointment" className="flex-1 text-center py-3 rounded bg-green-600 text-white font-semibold shadow hover:bg-green-700 transition">Book Appointment</Link>
        </div>
      </article>
    </main>
  );
}
