import React from 'react';
import { Link } from 'react-router-dom';

export default function StoryLizzy() {
  return (
    <main className="min-h-screen bg-gray-50 py-16 px-4 flex flex-col items-center">
      <article className="max-w-2xl w-full bg-white rounded-lg shadow-md p-8 prose prose-primary">
        <header className="flex flex-col items-center mb-8">
          <video controls className="w-full rounded mb-4 bg-black max-h-64">
            <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <h1 className="text-4xl font-extrabold text-primary-700 mb-2 text-center">Lizzy's Comeback: From Injury to Independence</h1>
          <p className="text-lg text-gray-500 text-center">How NovaCare helped Lizzy recover from a serious knee injury</p>
        </header>
        <section className="mb-6">
          <p>
            Lizzy, an avid runner and college student, faced her toughest challenge after a severe knee injury during a marathon. "I was devastated. Running was my passion, and suddenly I couldn't even walk without pain," she remembers.
          </p>
          <p>
            After consulting with orthopedic specialists, Lizzy was referred to <span className="font-semibold text-primary-600">NovaCare Physiotherapy</span>. The team created a step-by-step recovery plan, focusing on rebuilding her strength, flexibility, and confidence. "They never rushed me. Every milestone was celebrated, no matter how small."
          </p>
          <blockquote className="border-l-4 border-primary-300 pl-4 italic text-primary-700 my-4">
            “The encouragement and care I received at NovaCare made all the difference. I’m so grateful!”
          </blockquote>
          <p>
            With patience and perseverance, Lizzy progressed from crutches to walking, and eventually, back to jogging. Today, she enjoys her active lifestyle and inspires others at her university to prioritize recovery and self-care.
          </p>
        </section>
        <section className="mt-8">
          <h2 className="text-2xl font-bold text-primary-700 mb-2">Lizzy's Tips for Recovery</h2>
          <ul className="list-disc pl-6 text-gray-700">
            <li>Trust the process and celebrate small wins.</li>
            <li>Stay positive, even when progress is slow.</li>
            <li>Lean on your support system—family, friends, and your care team.</li>
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
