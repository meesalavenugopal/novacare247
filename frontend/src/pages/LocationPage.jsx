import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  MapPin, Phone, Calendar, Star, CheckCircle, ArrowRight,
  Clock, Award, Users, Heart, Zap, Shield
} from 'lucide-react';
import SEO from '../components/SEO';
import { indianCities, getCityData } from '../data/indianCities';
import { servicesAPI, doctorsAPI, siteSettingsAPI } from '../services/api';

/**
 * Dynamic Location-Based Landing Page
 * Generates SEO-optimized pages for each city in India
 */
const LocationPage = () => {
  const { location } = useParams();
  const [services, setServices] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [contactInfo, setContactInfo] = useState({
    phone: '+91-98765-43210',
    email: 'info@novacare247.com',
    address: ''
  });
  const [loading, setLoading] = useState(true);

  // Find city data from our comprehensive list
  const locationSlug = location?.toLowerCase().replace(/-/g, ' ');
  const cityData = getCityData(locationSlug) || {
    name: location?.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || 'Your City',
    state: 'India',
    tier: 2
  };

  useEffect(() => {
    loadData();
  }, [location]);

  const loadData = async () => {
    try {
      const [servicesRes, doctorsRes, settingsRes] = await Promise.all([
        servicesAPI.getAll(),
        doctorsAPI.getAll(),
        siteSettingsAPI.getGrouped(),
      ]);
      setServices(servicesRes.data.slice(0, 6));
      setDoctors(doctorsRes.data.slice(0, 4));
      
      // Set contact info from settings
      if (settingsRes.data?.contact) {
        setContactInfo({
          phone: settingsRes.data.contact.phone || '+91-98765-43210',
          email: settingsRes.data.contact.email || 'info@novacare247.com',
          address: settingsRes.data.contact.address || ''
        });
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: Clock, title: '24/7 Available', desc: 'Round-the-clock physiotherapy care' },
    { icon: Award, title: 'Expert Physios', desc: 'Highly qualified specialists' },
    { icon: Heart, title: 'Personalized Care', desc: 'Customized treatment plans' },
    { icon: Shield, title: 'Modern Equipment', desc: 'State-of-the-art facilities' },
  ];

  // ALL possible physiotherapy services - comprehensive list for SEO
  const allServices = [
    // Core Physiotherapy Services
    'Orthopedic Physiotherapy', 'Musculoskeletal Physiotherapy', 'Manual Therapy',
    'Sports Physiotherapy', 'Sports Injury Rehabilitation', 'Athletic Performance',
    'Neurological Physiotherapy', 'Neuro Rehabilitation', 'Stroke Rehabilitation',
    'Pediatric Physiotherapy', 'Child Physiotherapy', 'Developmental Therapy',
    'Geriatric Physiotherapy', 'Elderly Care', 'Fall Prevention Program',
    'Cardiopulmonary Physiotherapy', 'Cardiac Rehabilitation', 'Pulmonary Rehab',
    'Women\'s Health Physiotherapy', 'Pelvic Floor Therapy', 'Prenatal Care',
    'Post-Surgical Rehabilitation', 'Pre-Surgical Conditioning', 'Joint Replacement Rehab',
    
    // Specialized Treatments
    'Spinal Rehabilitation', 'Back Pain Treatment', 'Neck Pain Treatment',
    'Shoulder Rehabilitation', 'Knee Rehabilitation', 'Hip Rehabilitation',
    'Hand Therapy', 'Elbow & Wrist Treatment', 'Ankle & Foot Care',
    'TMJ Treatment', 'Jaw Pain Therapy', 'Headache Management',
    'Vestibular Rehabilitation', 'Balance Training', 'Vertigo Treatment',
    'Chronic Pain Management', 'Pain Relief Therapy', 'Fibromyalgia Care',
    
    // Treatment Modalities
    'Electrotherapy', 'TENS Therapy', 'IFT Treatment', 'Ultrasound Therapy',
    'Laser Therapy', 'LLLT', 'Shockwave Therapy', 'ESWT',
    'Dry Needling', 'Trigger Point Therapy', 'Myofascial Release',
    'Cupping Therapy', 'Kinesio Taping', 'Sports Taping',
    'Heat Therapy', 'Thermotherapy', 'Cold Therapy', 'Cryotherapy',
    'Wax Therapy', 'Paraffin Wax Treatment', 'Hot Pack Treatment',
    'Traction Therapy', 'Cervical Traction', 'Lumbar Traction',
    'Hydrotherapy', 'Aquatic Therapy', 'Pool Therapy',
    
    // Exercise-Based Services
    'Therapeutic Exercises', 'Strengthening Exercises', 'Stretching Program',
    'Core Strengthening', 'Posture Correction', 'Ergonomic Training',
    'Gait Training', 'Walking Rehabilitation', 'Mobility Training',
    'Range of Motion Exercises', 'Flexibility Training', 'Joint Mobilization',
    'Functional Training', 'Activity-Specific Training', 'Work Conditioning',
    'Home Exercise Program', 'Self-Management Training', 'Patient Education',
    
    // Specialized Programs
    'ACL Rehabilitation Program', 'Rotator Cuff Program', 'Frozen Shoulder Protocol',
    'Total Knee Replacement Rehab', 'Total Hip Replacement Rehab', 'Spine Surgery Rehab',
    'Stroke Recovery Program', 'Paralysis Treatment', 'Neuro Recovery',
    'Sports Return Program', 'Injury Prevention', 'Performance Enhancement',
    'Weight Management Support', 'Obesity Rehab', 'Lifestyle Modification',
    'Workplace Injury Rehab', 'Occupational Therapy', 'Ergonomic Assessment',
    
    // Service Delivery Options
    'Home Physiotherapy', 'Home Visit Physio', 'Doorstep Physiotherapy',
    'Online Physiotherapy', 'Tele-Physiotherapy', 'Virtual Consultation',
    'Clinic-Based Treatment', 'Outpatient Physiotherapy', 'Day Care Rehab',
    'Corporate Physiotherapy', 'Office Wellness', 'Desk Ergonomics',
    'Emergency Physiotherapy', '24/7 Physio Service', 'Urgent Care Physio',
    
    // Assessment Services
    'Physiotherapy Assessment', 'Functional Assessment', 'Gait Analysis',
    'Postural Assessment', 'Ergonomic Evaluation', 'Sports Screening',
    'Pre-Employment Assessment', 'Fitness Assessment', 'Movement Analysis',
    'Pain Assessment', 'Range of Motion Testing', 'Strength Testing',
    
    // Wellness & Prevention
    'Wellness Programs', 'Preventive Physiotherapy', 'Health Screening',
    'Fitness Conditioning', 'Senior Wellness', 'Corporate Wellness',
    'Stress Management', 'Relaxation Therapy', 'Mind-Body Wellness',
    'Nutrition Guidance', 'Lifestyle Counseling', 'Health Education'
  ];

  // ALL possible physiotherapy conditions - comprehensive list
  const conditions = [
    // Back & Spine Conditions
    'Back Pain', 'Lower Back Pain', 'Upper Back Pain', 'Chronic Back Pain',
    'Slip Disc', 'Herniated Disc', 'Bulging Disc', 'Disc Prolapse',
    'Sciatica', 'Lumbar Radiculopathy', 'Spinal Stenosis', 'Spondylitis',
    'Ankylosing Spondylitis', 'Spondylolisthesis', 'Scoliosis', 'Kyphosis', 'Lordosis',
    
    // Neck Conditions
    'Neck Pain', 'Cervical Pain', 'Cervical Spondylosis', 'Cervical Radiculopathy',
    'Whiplash Injury', 'Torticollis', 'Stiff Neck', 'Text Neck',
    
    // Shoulder Conditions
    'Shoulder Pain', 'Frozen Shoulder', 'Adhesive Capsulitis', 'Rotator Cuff Injury',
    'Rotator Cuff Tear', 'Shoulder Impingement', 'Shoulder Bursitis',
    'Shoulder Dislocation', 'SLAP Tear', 'Shoulder Tendinitis',
    
    // Knee Conditions
    'Knee Pain', 'ACL Injury', 'ACL Tear', 'PCL Injury', 'MCL Injury', 'LCL Injury',
    'Meniscus Tear', 'Patellofemoral Syndrome', 'Runner\'s Knee', 'Jumper\'s Knee',
    'Knee Osteoarthritis', 'Knee Replacement Rehab', 'TKR Rehabilitation',
    'Chondromalacia Patella', 'Baker\'s Cyst', 'Knee Bursitis',
    
    // Hip Conditions
    'Hip Pain', 'Hip Arthritis', 'Hip Bursitis', 'Trochanteric Bursitis',
    'Hip Replacement Rehab', 'THR Rehabilitation', 'Hip Labral Tear',
    'Piriformis Syndrome', 'Snapping Hip', 'Hip Impingement', 'FAI',
    
    // Elbow & Wrist Conditions
    'Elbow Pain', 'Tennis Elbow', 'Lateral Epicondylitis', 'Golfer\'s Elbow',
    'Medial Epicondylitis', 'Elbow Bursitis', 'Cubital Tunnel Syndrome',
    'Wrist Pain', 'Carpal Tunnel Syndrome', 'De Quervain\'s Tenosynovitis',
    'Wrist Tendinitis', 'Ganglion Cyst', 'Trigger Finger',
    
    // Ankle & Foot Conditions
    'Ankle Pain', 'Ankle Sprain', 'Ankle Fracture Rehab', 'Chronic Ankle Instability',
    'Achilles Tendinitis', 'Achilles Tendon Rupture', 'Foot Pain',
    'Plantar Fasciitis', 'Heel Pain', 'Heel Spur', 'Flat Feet', 'Pes Planus',
    'High Arch', 'Morton\'s Neuroma', 'Bunion', 'Metatarsalgia',
    
    // Arthritis & Joint Conditions
    'Arthritis', 'Osteoarthritis', 'Rheumatoid Arthritis', 'Psoriatic Arthritis',
    'Gout', 'Joint Pain', 'Joint Stiffness', 'Joint Inflammation',
    'Degenerative Joint Disease', 'Polyarthritis',
    
    // Muscle Conditions
    'Muscle Pain', 'Muscle Strain', 'Muscle Tear', 'Muscle Spasm',
    'Myofascial Pain', 'Fibromyalgia', 'Muscle Weakness', 'Muscle Atrophy',
    'Cramps', 'Delayed Onset Muscle Soreness', 'DOMS',
    
    // Sports Injuries
    'Sports Injuries', 'Sports Rehabilitation', 'Athletic Injury',
    'Hamstring Injury', 'Hamstring Strain', 'Quadriceps Strain', 'Groin Strain',
    'Calf Strain', 'Shin Splints', 'Stress Fracture', 'Overuse Injury',
    'Throwing Injuries', 'Running Injuries', 'Swimming Injuries',
    
    // Neurological Conditions
    'Stroke Rehabilitation', 'Paralysis', 'Hemiplegia', 'Paraplegia', 'Quadriplegia',
    'Parkinson\'s Disease', 'Multiple Sclerosis', 'Cerebral Palsy',
    'Peripheral Neuropathy', 'Bell\'s Palsy', 'Facial Palsy',
    'Guillain-Barré Syndrome', 'Motor Neuron Disease', 'Muscular Dystrophy',
    'Spinal Cord Injury', 'Traumatic Brain Injury', 'TBI Rehabilitation',
    
    // Post-Surgery Rehabilitation
    'Post Surgery Rehab', 'Post Operative Physiotherapy', 'Surgical Rehabilitation',
    'Joint Replacement Rehab', 'Spine Surgery Rehab', 'Ligament Surgery Rehab',
    'Fracture Rehabilitation', 'Amputation Rehabilitation',
    
    // Pediatric Conditions
    'Pediatric Physiotherapy', 'Developmental Delay', 'Cerebral Palsy',
    'Torticollis', 'Flat Head Syndrome', 'Toe Walking', 'Growing Pains',
    
    // Geriatric Conditions
    'Geriatric Physiotherapy', 'Balance Disorders', 'Fall Prevention',
    'Osteoporosis', 'Age-Related Weakness', 'Mobility Issues',
    
    // Women\'s Health
    'Prenatal Physiotherapy', 'Postnatal Physiotherapy', 'Pregnancy Back Pain',
    'Pelvic Floor Dysfunction', 'Diastasis Recti', 'Incontinence',
    
    // Respiratory & Cardiac
    'Respiratory Physiotherapy', 'Cardiac Rehabilitation', 'COPD',
    'Asthma Management', 'Post COVID Rehabilitation', 'Breathing Exercises',
    
    // Other Conditions
    'Vertigo', 'BPPV', 'Vestibular Rehabilitation', 'Dizziness',
    'Headache', 'Tension Headache', 'Migraine', 'TMJ Disorder',
    'Postural Problems', 'Poor Posture', 'Ergonomic Issues',
    'Work-Related Injuries', 'Repetitive Strain Injury', 'RSI',
    'Chronic Pain', 'Pain Management', 'Nerve Pain', 'Neuropathic Pain'
  ];

  // Generate structured data for local business with dynamic contact
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "Physiotherapy",
    "name": `NovaCare Physiotherapy - ${cityData.name}`,
    "description": `Best physiotherapy clinic in ${cityData.name}, ${cityData.state}. 24/7 expert care for back pain, sports injuries, post-surgery rehabilitation.`,
    "url": `https://novacare247.com/physiotherapy/${location}`,
    "telephone": contactInfo.phone,
    "email": contactInfo.email,
    "priceRange": "₹₹",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": cityData.name,
      "addressRegion": cityData.state,
      "addressCountry": "IN"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "500",
      "bestRating": "5"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "00:00",
      "closes": "23:59"
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title={`Best Physiotherapy in ${cityData.name} | Top Physio Clinic ${cityData.state}`}
        description={`NovaCare - Best physiotherapy clinic in ${cityData.name}, ${cityData.state}. Expert treatment for back pain, sports injuries, knee pain, post-surgery rehab. 24/7 service. Book appointment now! Home visits available.`}
        keywords={`physiotherapy ${cityData.name}, physio ${cityData.name}, physiotherapist ${cityData.name}, best physio in ${cityData.name}, physiotherapy clinic ${cityData.name}, back pain treatment ${cityData.name}, sports injury ${cityData.name}, knee pain ${cityData.name}, NovaCare ${cityData.name}, physiotherapy near me ${cityData.name}, home physiotherapy ${cityData.name}, 24 hour physio ${cityData.name}`}
        canonical={`https://novacare247.com/physiotherapy/${location}`}
        location={cityData.name}
        structuredData={localBusinessSchema}
      />

      {/* Hero Section */}
      <section className="relative min-h-[60vh] bg-gradient-to-r from-primary-50/80 via-white to-white overflow-hidden">
        <div className="absolute top-0 right-0 w-[55%] h-full hidden lg:block">
          <img 
            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=80"
            alt={`Physiotherapy in ${cityData.name}`}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="min-h-[60vh] flex items-center py-16">
            <div className="max-w-xl">
              <div className="flex items-center gap-2 text-primary-600 mb-4">
                <MapPin className="w-5 h-5" />
                <span className="font-medium">{cityData.name}, {cityData.state}</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5 leading-tight">
                Best Physiotherapy
                <br />
                <span className="text-primary-600">in {cityData.name}</span>
              </h1>
              
              <p className="text-base text-gray-600 mb-8 leading-relaxed">
                NovaCare offers expert 24/7 physiotherapy services in {cityData.name}. 
                Our experienced physiotherapists provide personalized treatment for back pain, 
                sports injuries, post-surgery rehabilitation, and more.
              </p>
              
              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-gray-600">4.9/5 from 500+ patients in {cityData.name}</span>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Link 
                  to="/booking"
                  className="bg-primary-600 hover:bg-primary-700 text-white font-medium px-8 py-4 transition-colors flex items-center gap-2"
                >
                  <Calendar className="w-5 h-5" />
                  Book Appointment
                </Link>
                <a 
                  href={`tel:${contactInfo.phone.replace(/[^0-9+]/g, '')}`}
                  className="border-2 border-primary-600 text-primary-600 hover:bg-primary-50 font-medium px-8 py-4 transition-colors flex items-center gap-2"
                >
                  <Phone className="w-5 h-5" />
                  Call Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-white border border-gray-200 p-6 text-center">
                <div className="w-12 h-12 bg-primary-50 border border-primary-100 mx-auto mb-4 flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="font-bold text-gray-800 mb-1">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Conditions We Treat */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Conditions We Treat in {cityData.name}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our expert physiotherapists in {cityData.name} specialize in treating 150+ conditions including:
            </p>
          </div>
          
          {/* Show top 28 conditions in grid, rest as tags */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 max-w-6xl mx-auto mb-8">
            {conditions.slice(0, 28).map((condition, index) => (
              <div 
                key={index}
                className="bg-gray-50 border border-gray-200 p-3 text-center hover:border-primary-300 transition-colors"
              >
                <CheckCircle className="w-4 h-4 text-primary-600 mx-auto mb-1" />
                <span className="text-xs text-gray-700">{condition}</span>
              </div>
            ))}
          </div>
          
          {/* More conditions as compact tags */}
          <div className="max-w-6xl mx-auto">
            <p className="text-sm text-gray-500 mb-4 text-center">And many more conditions:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {conditions.slice(28).map((condition, index) => (
                <span 
                  key={index}
                  className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full hover:bg-primary-50 hover:text-primary-600 transition-colors"
                >
                  {condition}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services in this location */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Physiotherapy Services in {cityData.name}
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Link 
                key={service.id}
                to={`/services/${service.slug}`}
                className="bg-white border border-gray-200 p-6 hover:border-primary-300 transition-colors group"
              >
                <h3 className="font-bold text-gray-800 mb-2 group-hover:text-primary-600 transition-colors">
                  {service.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{service.description}</p>
                <span className="text-primary-600 text-sm flex items-center gap-1">
                  Learn More <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link 
              to="/services"
              className="text-primary-600 font-medium hover:underline flex items-center gap-2 justify-center"
            >
              View All Services <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* All Services Tags for SEO */}
          <div className="mt-12 max-w-6xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
              All Physiotherapy Services Available in {cityData.name}
            </h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {allServices.map((service, index) => (
                <span 
                  key={index}
                  className="bg-white border border-gray-200 text-gray-600 text-xs px-3 py-1.5 hover:border-primary-300 hover:text-primary-600 transition-colors"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Doctors in this location */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Top Physiotherapists in {cityData.name}
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {doctors.map((doctor) => (
              <Link 
                key={doctor.id}
                to={`/doctors/${doctor.slug}`}
                className="bg-white border border-gray-200 overflow-hidden hover:border-primary-300 transition-colors group"
              >
                <div className="h-48 bg-gray-100">
                  <img 
                    src={doctor.profile_image || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face'}
                    alt={doctor.full_name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-800 group-hover:text-primary-600 transition-colors">
                    {doctor.full_name}
                  </h3>
                  <p className="text-gray-600 text-sm">{doctor.specialization}</p>
                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                    <Award className="w-4 h-4" />
                    <span>{doctor.experience_years}+ years</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link 
              to="/doctors"
              className="text-primary-600 font-medium hover:underline flex items-center gap-2 justify-center"
            >
              View All Doctors <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Book Your Physiotherapy Session in {cityData.name}
          </h2>
          <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
            Get expert physiotherapy care from our experienced team. 
            Home visits and clinic appointments available 24/7.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link 
              to="/booking"
              className="bg-white text-primary-600 font-medium px-8 py-4 hover:bg-gray-100 transition-colors"
            >
              Book Appointment
            </Link>
            <a 
              href={`tel:${contactInfo.phone.replace(/[^0-9+]/g, '')}`}
              className="border-2 border-white text-white font-medium px-8 py-4 hover:bg-white/10 transition-colors"
            >
              Call {contactInfo.phone}
            </a>
          </div>
        </div>
      </section>

      {/* Local SEO Content */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto prose prose-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              About NovaCare Physiotherapy in {cityData.name}
            </h2>
            <p className="text-gray-600 mb-4">
              NovaCare is the leading physiotherapy clinic in {cityData.name}, {cityData.state}, 
              offering comprehensive rehabilitation services for patients of all ages. 
              Our team of expert physiotherapists in {cityData.name} specializes in treating 
              a wide range of conditions including back pain, neck pain, sports injuries, 
              post-surgery rehabilitation, stroke recovery, and more.
            </p>
            <p className="text-gray-600 mb-4">
              We understand that finding a good physiotherapy clinic in {cityData.name} can be challenging. 
              That's why NovaCare provides 24/7 services, modern equipment, and personalized treatment plans 
              to ensure the best outcomes for our patients. Whether you need physiotherapy at our clinic 
              or prefer home visits in {cityData.name}, we've got you covered.
            </p>
            <p className="text-gray-600">
              Book your appointment today and experience why NovaCare is rated as the best 
              physiotherapy clinic in {cityData.name} by hundreds of satisfied patients.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LocationPage;
