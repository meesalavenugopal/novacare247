import { Link } from 'react-router-dom';
import { 
  Award, Users, Heart, Target, CheckCircle, Star, 
  Calendar, Phone, MapPin, Clock, ArrowRight, Shield,
  Sparkles, Zap, Building
} from 'lucide-react';

const AboutPage = () => {
  const values = [
    { icon: Heart, title: 'Compassionate Care', desc: 'We treat every patient with empathy, understanding, and personalized attention.' },
    { icon: Target, title: 'Excellence', desc: 'We strive for the highest standards in physiotherapy treatments and outcomes.' },
    { icon: Shield, title: 'Integrity', desc: 'Honest, transparent care with evidence-based treatment approaches.' },
    { icon: Sparkles, title: 'Innovation', desc: 'Continuously adopting the latest techniques and technologies in physiotherapy.' },
  ];

  const milestones = [
    { year: '2010', title: 'Foundation', desc: 'Chinamayi Physiotherapy Clinics was established with a vision to provide quality care.' },
    { year: '2014', title: 'Expansion', desc: 'Opened second clinic and grew team to 10 physiotherapists.' },
    { year: '2018', title: 'Recognition', desc: 'Awarded "Best Physiotherapy Clinic" in Hyderabad.' },
    { year: '2022', title: 'Milestone', desc: 'Celebrated 10,000+ successful patient recoveries.' },
    { year: '2025', title: 'Today', desc: 'Leading physiotherapy provider with 5 expert doctors and cutting-edge facilities.' },
  ];

  const team = [
    { 
      name: 'Dr. Priya Sharma', 
      role: 'Founder & Chief Physiotherapist',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face',
      desc: 'With 15+ years of experience, Dr. Priya founded Chinamayi with a mission to make quality physiotherapy accessible to all.'
    },
    { 
      name: 'Dr. Rajesh Kumar', 
      role: 'Sports Medicine Specialist',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face',
      desc: 'Former sports team physiotherapist with expertise in athletic injuries and performance optimization.'
    },
    { 
      name: 'Dr. Anitha Reddy', 
      role: 'Neurological Rehabilitation',
      image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&crop=face',
      desc: 'Specialized in neurological conditions including stroke recovery and movement disorders.'
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1920&q=80)'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/95 to-primary-800/90"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-full text-sm font-semibold mb-6">
              About Us
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Dedicated to Your
              <span className="block text-secondary-400">Health & Recovery</span>
            </h1>
            <p className="text-xl text-white/80 leading-relaxed">
              For over 15 years, Chinamayi Physiotherapy Clinics has been the trusted 
              partner in health for thousands of patients across Hyderabad.
            </p>
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#f9fafb"/>
          </svg>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Users, value: '10,000+', label: 'Patients Treated' },
              { icon: Award, value: '15+', label: 'Years Experience' },
              { icon: Star, value: '4.9', label: 'Average Rating' },
              { icon: Building, value: '3', label: 'Clinic Locations' },
            ].map((stat, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 text-center shadow-lg">
                <div className="w-14 h-14 bg-primary-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <stat.icon className="w-7 h-7 text-primary-600" />
                </div>
                <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80"
                alt="Our Clinic"
                className="rounded-2xl shadow-2xl w-full object-cover h-[500px]"
              />
              <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-secondary-100 rounded-2xl -z-10"></div>
              <div className="absolute -top-8 -left-8 w-32 h-32 bg-primary-100 rounded-2xl -z-10"></div>
              
              {/* Experience Badge */}
              <div className="absolute bottom-8 left-8 bg-white rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-primary-600 rounded-xl flex items-center justify-center text-white">
                    <Award className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-gray-800">15+</p>
                    <p className="text-gray-500">Years of Excellence</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <span className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-4">
                Our Story
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 leading-tight">
                A Legacy of Healing and Hope
              </h2>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                Founded in 2010 by Dr. Priya Sharma, Chinamayi Physiotherapy Clinics 
                began with a simple mission: to provide world-class physiotherapy care 
                that's accessible, personalized, and effective.
              </p>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                What started as a small clinic has grown into a leading healthcare 
                provider, with a team of 5 expert doctors and state-of-the-art facilities. 
                Our holistic approach combines traditional techniques with modern technology 
                to deliver exceptional results.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {['Personalized Treatment', 'Modern Equipment', 'Expert Team', 'Proven Results'].map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-secondary-100 text-secondary-700 rounded-full text-sm font-semibold mb-4">
              Our Values
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              What Drives Us
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Our core values guide everything we do at Chinamayi
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-primary-500/30">
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{value.title}</h3>
                <p className="text-gray-500">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-4">
              Our Journey
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Milestones Along the Way
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex gap-8 mb-8 last:mb-0">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                    {milestone.year}
                  </div>
                  {index < milestones.length - 1 && (
                    <div className="w-0.5 h-full bg-gray-200 mt-4"></div>
                  )}
                </div>
                <div className="flex-1 bg-gray-50 rounded-2xl p-6 hover:bg-primary-50 transition-colors">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{milestone.title}</h3>
                  <p className="text-gray-600">{milestone.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-secondary-100 text-secondary-700 rounded-full text-sm font-semibold mb-4">
              Leadership
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Meet Our Leaders
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {team.map((member, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="h-64 overflow-hidden">
                  <img 
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800">{member.name}</h3>
                  <p className="text-primary-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-500 text-sm">{member.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="relative rounded-3xl overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&q=80)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600/95 to-secondary-600/95"></div>
            </div>
            
            <div className="relative z-10 py-16 px-8 md:py-20 md:px-16 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Experience Our Care?
              </h2>
              <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of patients who have found relief and recovery at Chinamayi.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link 
                  to="/book" 
                  className="bg-white text-primary-600 hover:bg-gray-100 font-bold py-4 px-10 rounded-xl transition-colors shadow-lg"
                >
                  Book Appointment
                </Link>
                <Link 
                  to="/doctors" 
                  className="border-2 border-white text-white hover:bg-white/10 font-bold py-4 px-10 rounded-xl transition-colors"
                >
                  Meet Our Doctors
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
