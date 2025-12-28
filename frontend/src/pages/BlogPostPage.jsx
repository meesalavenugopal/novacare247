import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Clock, User, Calendar, ArrowLeft, Share2, BookmarkPlus,
  ChevronRight, MessageCircle, ThumbsUp, Facebook, Twitter, 
  Linkedin, Link as LinkIcon, CheckCircle, Loader2
} from 'lucide-react';
import { blogAPI } from '../services/api';
import SEO from '../components/SEO';
import { useState, useEffect } from 'react';

// Category metadata
const categoryMeta = {
  conditions: { name: 'Conditions', color: 'rose' },
  exercises: { name: 'Exercises', color: 'emerald' },
  recovery: { name: 'Recovery', color: 'blue' },
  prevention: { name: 'Prevention', color: 'amber' },
  lifestyle: { name: 'Lifestyle', color: 'purple' },
  sports: { name: 'Sports', color: 'sky' }
};

const BlogPostPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [copiedLink, setCopiedLink] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch article and related articles
  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await blogAPI.getBySlug(slug);
        setArticle(response.data);
        
        // Fetch related articles
        try {
          const relatedResponse = await blogAPI.getRelated(slug, 3);
          setRelatedArticles(relatedResponse.data);
        } catch (err) {
          console.error('Error fetching related articles:', err);
        }
      } catch (err) {
        console.error('Error fetching article:', err);
        setError('Article not found');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        <span className="ml-3 text-gray-600">Loading article...</span>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
          <p className="text-gray-600 mb-6">The article you're looking for doesn't exist.</p>
          <Link 
            to="/blog" 
            className="inline-flex items-center gap-2 text-primary-600 font-medium hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const category = categoryMeta[article.category] || { name: article.category, color: 'rose' };
  const publishDate = article.published_at ? new Date(article.published_at).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : new Date(article.created_at).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Parse tags and faqs from JSON if they're strings
  const tags = typeof article.tags === 'string' ? JSON.parse(article.tags) : (article.tags || []);
  const faqs = typeof article.faqs === 'string' ? JSON.parse(article.faqs) : (article.faqs || []);

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = article.title;
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } else {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  // Convert markdown-like content to HTML-like JSX
  const renderContent = (content) => {
    const lines = content.trim().split('\n');
    const elements = [];
    let currentList = [];
    let inList = false;

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      if (trimmedLine.startsWith('## ')) {
        if (inList) {
          elements.push(<ul key={`list-${index}`} className="list-disc list-inside space-y-2 mb-6 text-gray-700">{currentList}</ul>);
          currentList = [];
          inList = false;
        }
        elements.push(
          <h2 key={index} className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            {trimmedLine.replace('## ', '')}
          </h2>
        );
      } else if (trimmedLine.startsWith('### ')) {
        if (inList) {
          elements.push(<ul key={`list-${index}`} className="list-disc list-inside space-y-2 mb-6 text-gray-700">{currentList}</ul>);
          currentList = [];
          inList = false;
        }
        elements.push(
          <h3 key={index} className="text-xl font-semibold text-gray-900 mt-8 mb-3">
            {trimmedLine.replace('### ', '')}
          </h3>
        );
      } else if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
        if (inList) {
          elements.push(<ul key={`list-${index}`} className="list-disc list-inside space-y-2 mb-6 text-gray-700">{currentList}</ul>);
          currentList = [];
          inList = false;
        }
        elements.push(
          <h4 key={index} className="text-lg font-semibold text-gray-800 mt-6 mb-2">
            {trimmedLine.replace(/\*\*/g, '')}
          </h4>
        );
      } else if (trimmedLine.startsWith('- ')) {
        inList = true;
        currentList.push(
          <li key={index} className="text-gray-700">
            {trimmedLine.replace('- ', '')}
          </li>
        );
      } else if (trimmedLine.match(/^\d+\.\s/)) {
        if (inList && currentList.length > 0) {
          elements.push(<ul key={`list-${index}`} className="list-disc list-inside space-y-2 mb-6 text-gray-700">{currentList}</ul>);
          currentList = [];
        }
        inList = true;
        currentList.push(
          <li key={index} className="text-gray-700">
            {trimmedLine.replace(/^\d+\.\s/, '')}
          </li>
        );
      } else if (trimmedLine) {
        if (inList) {
          elements.push(<ul key={`list-${index}`} className="list-disc list-inside space-y-2 mb-6 text-gray-700">{currentList}</ul>);
          currentList = [];
          inList = false;
        }
        elements.push(
          <p key={index} className="text-gray-700 leading-relaxed mb-4">
            {trimmedLine}
          </p>
        );
      }
    });

    if (inList && currentList.length > 0) {
      elements.push(<ul key="final-list" className="list-disc list-inside space-y-2 mb-6 text-gray-700">{currentList}</ul>);
    }

    return elements;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO 
        title={`${article.title} | NovaCare Blog`}
        description={article.excerpt}
        keywords={tags.join(', ')}
        canonical={`https://novacare247.com/blog/${article.slug}`}
        ogType="article"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": article.title,
          "description": article.excerpt,
          "image": article.image,
          "author": {
            "@type": "Person",
            "name": article.author,
            "jobTitle": article.author_role
          },
          "publisher": {
            "@type": "Organization",
            "name": "NovaCare 24/7 Physiotherapy",
            "logo": {
              "@type": "ImageObject",
              "url": "https://novacare247.com/logo.png"
            }
          },
          "datePublished": article.published_at || article.created_at,
          "dateModified": article.updated_at || article.published_at || article.created_at,
          "mainEntityOfPage": `https://novacare247.com/blog/${article.slug}`
        }}
      />

      {/* Hero Image */}
      <div className="relative h-[40vh] lg:h-[50vh] bg-gray-900">
        <img 
          src={article.image} 
          alt={article.title}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
        
        {/* Breadcrumb */}
        <div className="absolute top-6 left-0 right-0">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-sm text-white/70">
              <Link to="/" className="hover:text-white">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <Link to="/blog" className="hover:text-white">Blog</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white">{category?.name}</span>
            </nav>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <article className="relative -mt-32 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Article Header Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-10 mb-8">
            {/* Category & Meta */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                {category?.name}
              </span>
              <span className="flex items-center gap-1 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                {article.read_time}
              </span>
              <span className="flex items-center gap-1 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                {publishDate}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              {article.title}
            </h1>

            {/* Author & Share */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{article.author}</p>
                  <p className="text-sm text-gray-500">{article.author_role}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 mr-2">Share:</span>
                <button 
                  onClick={() => handleShare('facebook')}
                  className="w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleShare('twitter')}
                  className="w-9 h-9 bg-sky-500 text-white rounded-full flex items-center justify-center hover:bg-sky-600 transition-colors"
                >
                  <Twitter className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleShare('linkedin')}
                  className="w-9 h-9 bg-blue-700 text-white rounded-full flex items-center justify-center hover:bg-blue-800 transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleShare('copy')}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                    copiedLink ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {copiedLink ? <CheckCircle className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Article Body */}
            <div className="prose prose-lg max-w-none mt-8">
              {renderContent(article.content)}
            </div>

            {/* Tags */}
            <div className="mt-10 pt-6 border-t border-gray-100">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-gray-500">Tags:</span>
                {tags.map((tag) => (
                  <Link 
                    key={tag}
                    to={`/blog?search=${encodeURIComponent(tag)}`}
                    className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-gray-200 transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          {faqs && faqs.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-10 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="border border-gray-100 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                      className="w-full flex items-center justify-between p-5 text-left bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                      <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${expandedFaq === index ? 'rotate-90' : ''}`} />
                    </button>
                    {expandedFaq === index && (
                      <div className="p-5 bg-white">
                        <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 lg:p-10 text-white text-center mb-8">
            <h2 className="text-2xl font-bold mb-4">Need Professional Help?</h2>
            <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
              Our expert physiotherapists are available 24/7 to help you with your concerns. Book an appointment today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/book"
                className="inline-flex items-center justify-center gap-2 bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
              >
                Book Appointment
              </Link>
              <Link 
                to="/contact"
                className="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedArticles.map((related) => (
                  <Link 
                    key={related.id}
                    to={`/blog/${related.slug}`}
                    className="group"
                  >
                    <div className="aspect-[16/10] rounded-xl overflow-hidden mb-3">
                      <img 
                        src={related.image} 
                        alt={related.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                      {related.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">{related.read_time}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Back to Blog */}
          <div className="mt-8 text-center">
            <Link 
              to="/blog"
              className="inline-flex items-center gap-2 text-primary-600 font-medium hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to All Articles
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogPostPage;
