import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Award, Users, Heart, Target, CheckCircle, Star, 
  Calendar, ArrowRight, Shield, MapPin,
  Sparkles, Building
} from 'lucide-react';
import { siteStatsAPI, milestonesAPI, doctorsAPI } from '../services/api';
import SEO from '../components/SEO';

const AboutPage = () => {
  const [stats, setStats] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [team, setTeam] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsRes, milestonesRes, doctorsRes] = await Promise.all([
        siteStatsAPI.getAll(),
        milestonesAPI.getAll(),
        doctorsAPI.getAll(),
      ]);
      
      // Get first 3 stats for the stats section
      setStats(statsRes.data.slice(0, 3));
      setMilestones(milestonesRes.data);
      
      // Map doctors to team format
      const teamData = doctorsRes.data.slice(0, 3).map(doc => ({
        name: doc.full_name,
        role: doc.specialization,
        image: doc.profile_image || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face',
        desc: doc.bio || `Experienced ${doc.specialization} specialist with ${doc.experience_years} years of experience.`
      }));
      setTeam(teamData);
    } catch (error) {
      console.error('Error loading data:', error);
      // Fallback data
      setStats([
        { value: '1,900+', description: 'centers with a wide range of physical therapy services' },
        { value: '39', description: 'states with our centers, serving a community near you' },
        { value: '375+', description: 'partnerships with university, college and community organizations' },
      ]);
      setMilestones([
        { year: '2015', title: 'Foundation', description: 'Novacare Physiotherapy Clinics was established.' },
        { year: '2020', title: 'Expansion', description: 'Opened multiple branches across the city.' },
        { year: '2024', title: 'Today', description: 'Leading physiotherapy provider with expert doctors.' },
      ]);
    }
  };

  const values = [
    { icon: Heart, title: 'Compassionate Care', desc: 'We treat every patient with empathy, understanding, and personalized attention.' },
    { icon: Target, title: 'Excellence', desc: 'We strive for the highest standards in physiotherapy treatments and outcomes.' },
    { icon: Shield, title: 'Integrity', desc: 'Honest, transparent care with evidence-based treatment approaches.' },
    { icon: Sparkles, title: 'Innovation', desc: 'Continuously adopting the latest techniques and technologies in physiotherapy.' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title="About NovaCare - India's Trusted Physiotherapy Clinic"
        description="NovaCare 24/7 Physiotherapy - 15+ years of excellence in physiotherapy care. Learn about our mission, expert team, and commitment to your health and recovery."
        keywords="about NovaCare, physiotherapy clinic history, best physio clinic India, NovaCare story, trusted physiotherapy, physiotherapy experts, healthcare excellence"
        canonical="https://novacare247.com/about"
      />
      {/* Hero Section - Matching HomePage Style */}
      <section className="relative min-h-[50vh] bg-gradient-to-r from-primary-50/80 via-white to-white overflow-hidden">
        {/* Background Image - Right Side */}
        <div className="absolute top-0 right-0 w-[55%] h-full hidden lg:block">
          <img 
            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=80"
            alt="Healthcare Background"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/50 to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="min-h-[50vh] flex items-center py-12">
            {/* Left Content */}
            <div className="max-w-xl">
              <span className="text-primary-600 font-medium text-sm uppercase tracking-wider">About Us</span>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-5 leading-tight">
                Dedicated to Your
                <br />
                <span className="text-primary-600">Health & Recovery</span>
              </h1>
              <p className="text-base text-gray-600 mb-8 leading-relaxed">
                For over 15 years, NovaCare 24/7 Physiotherapy Clinics has been the trusted 
                partner in health for thousands of patients across Hyderabad.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
              We're a network of outpatient physical rehabilitation experts
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className={`text-center ${index === 1 ? 'md:border-x md:border-gray-200 md:px-8' : ''}`}>
                <p className="text-5xl md:text-6xl font-light text-primary-600 mb-2">{stat.value}</p>
                <p className="text-gray-600">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img 
                src="/about.png"
                alt="Our Clinic"
                className="w-full object-cover h-[480px]"
              />
              
              {/* Experience Badge */}
              <div className="absolute bottom-6 left-6 bg-white p-5 border border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-primary-600 flex items-center justify-center text-white">
                    <Award className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">15+</p>
                    <p className="text-gray-600 text-sm">Years of Excellence</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <span className="text-primary-600 font-medium text-sm uppercase tracking-wider">Our Story</span>
              <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-6">
                A Legacy of Healing and Hope
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Founded in 2010 by Dr. Priya Sharma, NovaCare 24/7 Physiotherapy Clinics 
                began with a simple mission: to provide world-class physiotherapy care 
                that's accessible, personalized, and effective.
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                What started as a small clinic has grown into a leading healthcare 
                provider, with a team of 5 expert doctors and state-of-the-art facilities. 
                Our holistic approach combines traditional techniques with modern technology 
                to deliver exceptional results.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {['Personalized Treatment', 'Modern Equipment', 'Expert Team', 'Proven Results'].map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-primary-600" />
                    <span className="text-gray-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-primary-600 font-medium text-sm uppercase tracking-wider">Our Values</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-4">
              What Drives Us
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our core values guide everything we do at NovaCare 24/7
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div 
                key={index}
                className="bg-gray-50 border border-gray-200 p-6 hover:border-primary-300 transition-colors text-center"
              >
                <div className="w-14 h-14 bg-primary-600 mx-auto mb-5 flex items-center justify-center">
                  <value.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-primary-600 font-medium text-sm uppercase tracking-wider">Our Journey</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-4">
              Milestones Along the Way
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex gap-6 mb-6 last:mb-0">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-primary-600 flex items-center justify-center text-white font-bold text-sm">
                    {milestone.year}
                  </div>
                  {index < milestones.length - 1 && (
                    <div className="w-0.5 h-full bg-gray-300 mt-2"></div>
                  )}
                </div>
                <div className="flex-1 bg-white border border-gray-200 p-5 hover:border-primary-300 transition-colors">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{milestone.title}</h3>
                  <p className="text-gray-600 text-sm">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-20 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-primary-600 font-medium text-sm uppercase tracking-wider">Leadership</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-4">
              Meet Our Leaders
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {team.map((member, index) => (
              <div 
                key={index}
                className="bg-white border border-gray-200 overflow-hidden hover:border-primary-300 hover:shadow-md transition-all"
              >
                <div className="h-64 overflow-hidden">
                  <img 
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                  <p className="text-primary-600 text-sm font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary-600">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <Calendar className="w-12 h-12 text-white mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Experience Our Care?
            </h2>
            <p className="text-primary-100 mb-8">
              Join thousands of patients who have found relief and recovery at NovaCare 24/7.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                to="/book" 
                className="bg-white text-primary-600 hover:bg-primary-50 font-medium py-3 px-8 transition-colors"
              >
                Book Appointment
              </Link>
              <Link 
                to="/doctors" 
                className="border border-white/50 text-white hover:bg-white/10 font-medium py-3 px-8 transition-colors flex items-center gap-2"
              >
                Meet Our Doctors <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
