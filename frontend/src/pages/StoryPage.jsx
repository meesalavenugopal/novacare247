import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import SEO from '../components/SEO';

export default function StoryPage() {
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/testimonials/`)
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((t) => String(t.id) === String(id));
        if (found) setStory(found);
        else setError('Story not found');
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load story');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;
  if (!story) return null;

  // Helper to highlight "NovaCare" in text
  const highlightNovaCare = (text) => {
    if (!text) return text;
    const parts = text.split(/(NovaCare)/gi);
    return parts.map((part, i) =>
      part.toLowerCase() === 'novacare' ? (
        <span key={i} className="font-semibold text-primary-600">NovaCare</span>
      ) : (
        part
      )
    );
  };

  // Split content into paragraphs for better formatting
  const paragraphs = story.content ? story.content.split(/\n+/).filter(Boolean) : [];

  return (
    <>
      <SEO 
        title={`${story.patient_name}'s Recovery Story | NovaCare Physiotherapy`}
        description={`Read how ${story.patient_name} recovered with NovaCare physiotherapy. Inspiring patient success story from India's leading physio clinic.`}
        keywords={`patient story, recovery story, physiotherapy success, ${story.patient_name}, NovaCare testimonial`}
        canonical={`https://novacare247.com/stories/${id}`}
      />
      
      <main className="min-h-screen bg-gray-50 py-16 px-4 flex flex-col items-center">
        <article className="max-w-2xl w-full bg-white rounded-lg shadow-md p-8 prose prose-primary">
          <header className="flex flex-col items-center mb-8">
            {story.image_url && story.story_type === 'video' ? (
              <video controls className="w-full rounded mb-4 bg-black max-h-64">
                <source src={story.image_url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : story.image_url ? (
              <img src={story.image_url} alt={story.patient_name} className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-primary-100" />
            ) : null}
            <h1 className="text-4xl font-extrabold text-primary-700 mb-2 text-center">
              {story.subtitle ? `${story.subtitle}: ${story.patient_name}'s Story` : `${story.patient_name}'s Story`}
            </h1>
            <p className="text-lg text-gray-500 text-center">How expert physiotherapy helped {story.patient_name} on their recovery journey</p>
          </header>
          <section className="mb-6">
            {paragraphs.length > 1 ? (
              paragraphs.map((para, idx) => <p key={idx}>{highlightNovaCare(para)}</p>)
            ) : (
              <>
                <p>{highlightNovaCare(story.content)}</p>
              </>
            )}
            <blockquote className="border-l-4 border-primary-300 pl-4 italic text-primary-700 my-4">
              "{highlightNovaCare(story.content && story.content.length > 100 ? story.content.slice(0, 100) + '...' : story.content)}"
            </blockquote>
            <p>
              Today, {story.patient_name} enjoys an active lifestyle and credits the compassionate care and expertise of the <span className="font-semibold text-primary-600">NovaCare</span> team for their recovery.
            </p>
          </section>
          {story.tips && (
            <section className="mt-8">
              <h2 className="text-2xl font-bold text-primary-700 mb-2">{story.patient_name}'s Advice to Others</h2>
              <ul className="list-disc pl-6 text-gray-700">
                {story.tips.split(',').map((tip, i) => <li key={i}>{tip.trim()}</li>)}
              </ul>
            </section>
          )}
          <div className="flex flex-col sm:flex-row gap-4 mt-10">
            <Link to="/" className="flex-1 text-center py-3 rounded bg-primary-600 text-white font-semibold shadow hover:bg-primary-700 transition">&larr; Back to Home</Link>
            <Link to="/book-appointment" className="flex-1 text-center py-3 rounded bg-green-600 text-white font-semibold shadow hover:bg-green-700 transition">Book Appointment</Link>
          </div>
        </article>
      </main>
    </>
  );
}
