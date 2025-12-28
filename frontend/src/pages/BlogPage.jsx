import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, Clock, User, ArrowRight, Heart, Dumbbell, 
  TrendingUp, Shield, Sparkles, Trophy, X, Loader2
} from 'lucide-react';
import { blogAPI } from '../services/api';
import SEO from '../components/SEO';

const iconMap = {
  Heart,
  Dumbbell,
  TrendingUp,
  Shield,
  Sparkles,
  Trophy
};

const colorMap = {
  rose: 'bg-rose-100 text-rose-600',
  emerald: 'bg-emerald-100 text-emerald-600',
  blue: 'bg-blue-100 text-blue-600',
  amber: 'bg-amber-100 text-amber-600',
  purple: 'bg-purple-100 text-purple-600',
  sky: 'bg-sky-100 text-sky-600'
};

// Category metadata
const categoryMeta = {
  conditions: { name: 'Conditions', icon: 'Heart', color: 'rose' },
  exercises: { name: 'Exercises', icon: 'Dumbbell', color: 'emerald' },
  recovery: { name: 'Recovery', icon: 'TrendingUp', color: 'blue' },
  prevention: { name: 'Prevention', icon: 'Shield', color: 'amber' },
  lifestyle: { name: 'Lifestyle', icon: 'Sparkles', color: 'purple' },
  sports: { name: 'Sports', icon: 'Trophy', color: 'sky' }
};

const BlogPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [articles, setArticles] = useState([]);
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch articles from API
  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {};
        if (selectedCategory !== 'all') {
          params.category = selectedCategory;
        }
        if (searchQuery.trim()) {
          params.search = searchQuery.trim();
        }
        
        const response = await blogAPI.getAll(params);
        setArticles(response.data);
      } catch (err) {
        console.error('Error fetching articles:', err);
        setError('Failed to load articles. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchArticles, 300);
    return () => clearTimeout(debounceTimer);
  }, [selectedCategory, searchQuery]);

  // Fetch featured articles on mount
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await blogAPI.getAll({ featured: true });
        setFeaturedArticles(response.data);
      } catch (err) {
        console.error('Error fetching featured articles:', err);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await blogAPI.getCategories();
        setCategories(response.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
        // Use default categories as objects
        setCategories([
          { id: 'conditions', name: 'Conditions', icon: 'Heart', color: 'rose' },
          { id: 'exercises', name: 'Exercises', icon: 'Dumbbell', color: 'emerald' },
          { id: 'recovery', name: 'Recovery', icon: 'TrendingUp', color: 'blue' },
          { id: 'prevention', name: 'Prevention', icon: 'Shield', color: 'amber' },
          { id: 'lifestyle', name: 'Lifestyle', icon: 'Sparkles', color: 'purple' },
          { id: 'sports', name: 'Sports', icon: 'Trophy', color: 'sky' }
        ]);
      }
    };

    fetchFeatured();
    fetchCategories();
  }, []);

  const getCategoryInfo = (categoryId) => {
    return categoryMeta[categoryId] || { name: categoryId, icon: 'Heart', color: 'rose' };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO 
        title="Health Blog & Physiotherapy Articles | NovaCare 24/7"
        description="Expert physiotherapy articles, exercise guides, and health tips from NovaCare. Learn about back pain, sports injuries, rehabilitation, and injury prevention."
        keywords="physiotherapy blog, health articles, exercise guides, back pain treatment, sports injury recovery, rehabilitation tips, injury prevention, physiotherapy India"
        canonical="https://novacare247.com/blog"
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 py-16 lg:py-24">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Health & Wellness Blog
            </h1>
            <p className="text-xl text-primary-100 mb-8">
              Expert articles, exercise guides, and recovery tips from our team of physiotherapists. Your guide to a healthier, pain-free life.
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl border-0 shadow-lg focus:ring-2 focus:ring-primary-300 text-gray-900"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`flex-shrink-0 px-4 py-2 rounded-full font-medium transition-colors ${
                selectedCategory === 'all' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All Articles
            </button>
            {categories.map((cat) => {
              const Icon = iconMap[cat.icon];
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-colors ${
                    selectedCategory === cat.id 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Articles */}
        {selectedCategory === 'all' && !searchQuery && featuredArticles.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Articles</h2>
            <div className="grid lg:grid-cols-2 gap-8">
              {featuredArticles.slice(0, 2).map((article) => {
                const category = getCategoryInfo(article.category);
                return (
                  <Link 
                    key={article.id}
                    to={`/blog/${article.slug}`}
                    className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <div className="aspect-[16/9] overflow-hidden">
                      <img 
                        src={article.image} 
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${colorMap[category.color]}`}>
                          {category.name}
                        </span>
                        <span className="flex items-center gap-1 text-sm text-gray-500">
                          <Clock className="w-4 h-4" />
                          {article.read_time}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">{article.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-primary-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{article.author}</p>
                            <p className="text-xs text-gray-500">{article.author_role}</p>
                          </div>
                        </div>
                        <span className="text-primary-600 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                          Read More <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Results Count */}
        {searchQuery && (
          <div className="mb-6">
            <p className="text-gray-600">
              Found <span className="font-semibold text-gray-900">{articles.length}</span> articles 
              {searchQuery && ` for "${searchQuery}"`}
              {selectedCategory !== 'all' && ` in ${getCategoryInfo(selectedCategory).name}`}
            </p>
          </div>
        )}

        {/* All Articles Grid */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            {selectedCategory === 'all' ? 'All Articles' : getCategoryInfo(selectedCategory).name}
          </h2>
          
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
              <span className="ml-3 text-gray-600">Loading articles...</span>
            </div>
          ) : error ? (
            <div className="text-center py-16 bg-white rounded-2xl">
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="text-primary-600 font-medium hover:underline"
              >
                Try again
              </button>
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-600 mb-4">Try a different search term or browse by category.</p>
              <button 
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                className="text-primary-600 font-medium hover:underline"
              >
                View all articles
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => {
                const category = getCategoryInfo(article.category);
                return (
                  <Link 
                    key={article.id}
                    to={`/blog/${article.slug}`}
                    className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div className="aspect-[16/10] overflow-hidden">
                      <img 
                        src={article.image} 
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${colorMap[category.color]}`}>
                          {category.name}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="w-3.5 h-3.5" />
                          {article.read_time}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{article.excerpt}</p>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-primary-100 rounded-full flex items-center justify-center">
                          <User className="w-3.5 h-3.5 text-primary-600" />
                        </div>
                        <span className="text-sm text-gray-700">{article.author}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* Newsletter CTA */}
        <section className="mt-16 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 lg:p-12 text-white text-center">
          <h2 className="text-2xl lg:text-3xl font-bold mb-4">Stay Updated with Health Tips</h2>
          <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
            Get the latest physiotherapy insights, exercise guides, and recovery tips delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-white"
            />
            <button className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors">
              Subscribe
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default BlogPage;
