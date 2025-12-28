import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

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
    <div className="min-h-screen bg-white">
      {/* Hero Section - Matching HomePage Style */}
      <section className="relative min-h-[50vh] bg-gradient-to-r from-primary-50/80 via-white to-white overflow-hidden">
        {/* Background Image - Right Side */}
        <div className="absolute top-0 right-0 w-[55%] h-full hidden lg:block">
          <img 
            src={story.image_url || "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=80"}
            alt={story.patient_name}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="min-h-[50vh] flex items-center py-12">
            {/* Left Content */}
            <div className="max-w-xl">
              <span className="text-primary-600 font-medium text-sm uppercase tracking-wider">Patient Story</span>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-5 leading-tight">
                {story.subtitle || 'Recovery Journey'}
                <br />
                <span className="text-primary-600">{story.patient_name}'s Story</span>
              </h1>
              <p className="text-base text-gray-600 mb-8 leading-relaxed">
                How expert physiotherapy helped {story.patient_name} on their recovery journey at NovaCare 24/7 Physiotherapy Clinics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Content */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <article className="max-w-3xl mx-auto bg-white border border-gray-200 p-8 md:p-12">
            {/* Mobile Image */}
            {story.image_url && (
              <div className="lg:hidden mb-8 text-center">
                {story.story_type === 'video' ? (
                  <video controls className="w-full rounded bg-black max-h-64 mx-auto">
                    <source src={story.image_url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img src={story.image_url} alt={story.patient_name} className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-primary-100" />
                )}
              </div>
            )}
            
            {/* Story Content */}
            <div className="prose prose-lg max-w-none">
              {paragraphs.length > 1 ? (
                paragraphs.map((para, idx) => <p key={idx} className="text-gray-700 leading-relaxed mb-4">{highlightNovaCare(para)}</p>)
              ) : (
                <p className="text-gray-700 leading-relaxed mb-4">{highlightNovaCare(story.content)}</p>
              )}
              
              <blockquote className="border-l-4 border-primary-400 pl-6 py-2 my-8 bg-primary-50/50">
                <p className="italic text-primary-700 text-lg">
                  "{highlightNovaCare(story.content && story.content.length > 150 ? story.content.slice(0, 150) + '...' : story.content)}"
                </p>
                <footer className="text-primary-600 font-medium mt-2">— {story.patient_name}</footer>
              </blockquote>
              
              <p className="text-gray-700 leading-relaxed">
                Today, {story.patient_name} enjoys an active lifestyle and credits the compassionate care and expertise of the <span className="font-semibold text-primary-600">NovaCare</span> team for their recovery.
              </p>
            </div>

            {/* Tips Section */}
            {story.tips && (
              <div className="mt-10 pt-8 border-t border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{story.patient_name}'s Advice to Others</h2>
                <ul className="space-y-3">
                  {story.tips.split(',').map((tip, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">✓</span>
                      <span className="text-gray-700">{tip.trim()}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mt-10 pt-8 border-t border-gray-200">
              <Link to="/" className="flex-1 text-center py-3 px-6 border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition">
                ← Back to Home
              </Link>
              <Link to="/book-appointment" className="flex-1 text-center py-3 px-6 bg-primary-600 text-white font-medium shadow hover:bg-primary-700 transition">
                Book Appointment
              </Link>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
