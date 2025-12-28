import React from 'react';
import { Link } from 'react-router-dom';


export default function StoryAnitha() {
  return (
    <main className="min-h-screen bg-gray-50 py-16 px-4 flex flex-col items-center">
      <article className="max-w-2xl w-full bg-white rounded-lg shadow-md p-8 prose prose-primary">
        <header className="flex flex-col items-center mb-8">
          <img src="https://randomuser.me/api/portraits/women/65.jpg" alt="Anitha Reddy" className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-primary-100" />
          <h1 className="text-4xl font-extrabold text-primary-700 mb-2 text-center">Regaining Life: Anitha's Story</h1>
          <p className="text-lg text-gray-500 text-center">How expert physiotherapy helped Anitha overcome years of back pain</p>
        </header>
        <section className="mb-6">
          <p>
            For over six years, Anitha Reddy struggled with chronic lower back pain. Simple tasks like lifting her child, sitting at her desk, or even walking in the park became daunting. "I felt like I was missing out on life," she recalls. "I tried painkillers, home remedies, and even yoga, but nothing lasted."
          </p>
          <p>
            Everything changed when a friend recommended <span className="font-semibold text-primary-600">NovaCare Physiotherapy</span>. "From my first visit, I felt heard and understood. The team took time to explain my condition and gave me hope," Anitha shares.
          </p>
          <p>
            Her treatment plan included gentle manual therapy, progressive exercises, and posture correction. The physiotherapists encouraged her at every step, celebrating small wins and helping her push through setbacks. "There were days I wanted to give up, but their positivity kept me going."
          </p>
          <blockquote className="border-l-4 border-primary-300 pl-4 italic text-primary-700 my-4">
            “Years of back pain are finally gone. The NovaCare team truly cares and gave me my life back!”
          </blockquote>
          <p>
            Today, Anitha is pain-free and enjoys hiking, playing with her son, and even dancing at family events. "I feel like myself again. I’m so grateful for the care and expertise at NovaCare."
          </p>
        </section>
        <section className="mt-8">
          <h2 className="text-2xl font-bold text-primary-700 mb-2">Anitha's Advice to Others</h2>
          <ul className="list-disc pl-6 text-gray-700">
            <li>Don’t ignore persistent pain—seek professional help early.</li>
            <li>Stay consistent with your exercises, even when progress feels slow.</li>
            <li>Choose a clinic where you feel supported and understood.</li>
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
