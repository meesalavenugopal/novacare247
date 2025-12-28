import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Award, Star, Calendar, GraduationCap, Stethoscope, ArrowRight, MapPin, Navigation, Filter, X, ChevronDown, Building2, Video, Home, Building } from 'lucide-react';
import { doctorsAPI } from '../services/api';

// Indian states
const indianStates = [
  { id: 'all', name: 'All States' },
  { id: 'telangana', name: 'Telangana' },
  { id: 'andhra-pradesh', name: 'Andhra Pradesh' },
  { id: 'karnataka', name: 'Karnataka' },
  { id: 'tamil-nadu', name: 'Tamil Nadu' },
  { id: 'maharashtra', name: 'Maharashtra' },
  { id: 'kerala', name: 'Kerala' },
  { id: 'delhi', name: 'Delhi' },
  { id: 'gujarat', name: 'Gujarat' },
  { id: 'rajasthan', name: 'Rajasthan' },
  { id: 'west-bengal', name: 'West Bengal' },
];

// Clinic locations with coordinates (grouped by state)
const clinicLocations = [
  { id: 'all', name: 'All Locations', state: 'all' },
  { id: 'kukatpally', name: 'Kukatpally', lat: 17.4947, lng: 78.3996, state: 'telangana' },
  { id: 'gachibowli', name: 'Gachibowli', lat: 17.4401, lng: 78.3489, state: 'telangana' },
  { id: 'madhapur', name: 'Madhapur', lat: 17.4486, lng: 78.3908, state: 'telangana' },
  { id: 'secunderabad', name: 'Secunderabad', lat: 17.4399, lng: 78.4983, state: 'telangana' },
  { id: 'jubileehills', name: 'Jubilee Hills', lat: 17.4325, lng: 78.4073, state: 'telangana' },
  { id: 'vizag', name: 'Visakhapatnam', lat: 17.6868, lng: 83.2185, state: 'andhra-pradesh' },
  { id: 'vijayawada', name: 'Vijayawada', lat: 16.5062, lng: 80.6480, state: 'andhra-pradesh' },
  { id: 'bangalore', name: 'Bangalore', lat: 12.9716, lng: 77.5946, state: 'karnataka' },
  { id: 'chennai', name: 'Chennai', lat: 13.0827, lng: 80.2707, state: 'tamil-nadu' },
];

// Specializations available
const specializations = [
  'All Specialties',
  'Orthopedic Physiotherapy',
  'Neurological Physiotherapy',
  'Sports Physiotherapy',
  'Pediatric Physiotherapy',
  "Women's Health Physiotherapy",
  'Geriatric Physiotherapy',
  'Cardiopulmonary Physiotherapy',
];

// Consultation types
const consultationTypes = [
  { id: 'all', name: 'All Consultation Types', icon: 'all' },
  { id: 'clinic', name: 'In-Clinic Visit', icon: 'clinic' },
  { id: 'home', name: 'Home Visit', icon: 'home' },
  { id: 'video', name: 'Video Consultation', icon: 'video' },
];

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [selectedState, setSelectedState] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialties');
  const [selectedConsultationType, setSelectedConsultationType] = useState('all');
  const [nearMeEnabled, setNearMeEnabled] = useState(false);
  const [nearMeDistance, setNearMeDistance] = useState(5); // km
  const [userLocation, setUserLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Get filtered locations based on selected state
  const filteredLocations = useMemo(() => {
    if (selectedState === 'all') return clinicLocations;
    return [
      { id: 'all', name: 'All Locations', state: 'all' },
      ...clinicLocations.filter(loc => loc.state === selectedState)
    ];
  }, [selectedState]);

  useEffect(() => {
    loadDoctors();
  }, []);

  // Reset location when state changes
  useEffect(() => {
    setSelectedLocation('all');
  }, [selectedState]);

  // Get user's location when "Near Me" is enabled
  const handleNearMeToggle = () => {
    if (!nearMeEnabled) {
      setLocationLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setNearMeEnabled(true);
          setSelectedLocation('all'); // Reset location filter
          setLocationLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please enable location services.');
          setLocationLoading(false);
        }
      );
    } else {
      setNearMeEnabled(false);
      setUserLocation(null);
    }
  };

  // Calculate distance between two points (Haversine formula)
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Get nearby clinics based on user location
  const getNearbyClinics = useMemo(() => {
    if (!userLocation) return [];
    return clinicLocations
      .filter(loc => loc.id !== 'all')
      .map(loc => ({
        ...loc,
        distance: calculateDistance(userLocation.lat, userLocation.lng, loc.lat, loc.lng)
      }))
      .filter(loc => loc.distance <= nearMeDistance)
      .sort((a, b) => a.distance - b.distance);
  }, [userLocation, nearMeDistance]);

  // Filter doctors based on selected filters
  const filteredDoctors = useMemo(() => {
    let result = [...doctors];
    
    // Filter by specialty
    if (selectedSpecialty !== 'All Specialties') {
      result = result.filter(doc => doc.specialization === selectedSpecialty);
    }
    
    // Filter by location (simulated - in real app, doctors would have location data)
    if (selectedLocation !== 'all' && !nearMeEnabled) {
      // For demo, show all doctors when specific location selected
      // In production, filter by doctor.location_id
    }
    
    return result;
  }, [doctors, selectedSpecialty, selectedLocation, nearMeEnabled]);

  // Get unique specializations from doctors
  const availableSpecializations = useMemo(() => {
    const specs = new Set(doctors.map(d => d.specialization));
    return ['All Specialties', ...Array.from(specs)];
  }, [doctors]);

  const clearFilters = () => {
    setSelectedState('all');
    setSelectedLocation('all');
    setSelectedSpecialty('All Specialties');
    setSelectedConsultationType('all');
    setNearMeEnabled(false);
    setUserLocation(null);
  };

  const activeFiltersCount = [
    selectedState !== 'all',
    selectedLocation !== 'all',
    selectedSpecialty !== 'All Specialties',
    selectedConsultationType !== 'all',
    nearMeEnabled
  ].filter(Boolean).length;

  const loadDoctors = async () => {
    try {
      const response = await doctorsAPI.getAll();
      setDoctors(response.data);
    } catch (error) {
      console.error('Error loading doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const doctorImages = [
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop&crop=face',
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Matching HomePage Style */}
      <section className="relative min-h-[50vh] bg-gradient-to-r from-primary-50/80 via-white to-white overflow-hidden">
        {/* Background Image - Right Side */}
        <div className="absolute top-0 right-0 w-[55%] h-full hidden lg:block">
          <img 
            src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=1200&q=80"
            alt="Medical Team Background"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="min-h-[50vh] flex items-center py-12">
            {/* Left Content */}
            <div className="max-w-xl">
              <span className="text-primary-600 font-medium text-sm uppercase tracking-wider">Our Medical Team</span>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-5 leading-tight">
                Meet Our Expert
                <br />
                <span className="text-primary-600">Physiotherapists</span>
              </h1>
              <p className="text-base text-gray-600 mb-8 leading-relaxed">
                Our team of highly qualified doctors brings years of experience and 
                specialized expertise to help you on your journey to recovery and wellness.
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
            <div className="text-center">
              <p className="text-5xl md:text-6xl font-light text-primary-600 mb-2">1,900+</p>
              <p className="text-gray-600">centers with a wide range of physical therapy services</p>
            </div>
            <div className="text-center md:border-x md:border-gray-200 md:px-8">
              <p className="text-5xl md:text-6xl font-light text-primary-600 mb-2">39</p>
              <p className="text-gray-600">states with our centers, serving a community near you</p>
            </div>
            <div className="text-center">
              <p className="text-5xl md:text-6xl font-light text-primary-600 mb-2">375+</p>
              <p className="text-gray-600">partnerships with university, college and community organizations</p>
            </div>
          </div>
        </div>
      </section>

      {/* Doctors Grid */}
      <section className="py-20 bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <span className="text-primary-600 font-medium text-sm uppercase tracking-wider">Our Doctors</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">
              Choose Your Specialist
            </h2>
          </div>

          {/* Filters Section */}
          <div className="mb-10">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden w-full flex items-center justify-between bg-white border border-gray-200 px-4 py-3 mb-4"
            >
              <span className="flex items-center gap-2 font-medium text-gray-700">
                <Filter size={18} />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="bg-primary-500 text-white text-xs font-bold px-2 py-0.5">{activeFiltersCount}</span>
                )}
              </span>
              <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            {/* Filter Bar */}
            <div className={`${showFilters ? 'block' : 'hidden'} lg:block bg-white border border-gray-200 p-5`}>
              {/* Row 1: Near Me + Results */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-5 border-b border-gray-100">
                <div className="flex items-center gap-4">
                  {/* Near Me Button */}
                  <button
                    onClick={handleNearMeToggle}
                    disabled={locationLoading}
                    className={`flex items-center gap-2 px-5 py-2.5 font-medium transition-colors ${
                      nearMeEnabled 
                        ? 'bg-primary-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    } ${locationLoading ? 'opacity-50 cursor-wait' : ''}`}
                  >
                    <Navigation size={18} className={locationLoading ? 'animate-pulse' : ''} />
                    {locationLoading ? 'Getting Location...' : nearMeEnabled ? 'Near Me ✓' : 'Near Me'}
                  </button>

                  {/* Distance Selector (visible when Near Me is enabled) */}
                  {nearMeEnabled && (
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">Within:</span>
                      <select
                        value={nearMeDistance}
                        onChange={(e) => setNearMeDistance(Number(e.target.value))}
                        className="border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value={2}>2 km</option>
                        <option value={5}>5 km</option>
                        <option value={10}>10 km</option>
                        <option value={20}>20 km</option>
                        <option value={50}>50 km</option>
                      </select>
                      {getNearbyClinics.length > 0 && (
                        <span className="text-xs text-green-600 bg-green-50 px-2 py-1">
                          {getNearbyClinics.length} clinic{getNearbyClinics.length > 1 ? 's' : ''} nearby
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Results Count + Clear */}
                <div className="flex items-center gap-4">
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      <X size={16} />
                      Clear All
                    </button>
                  )}
                  <div className="text-sm text-gray-600 bg-gray-50 px-4 py-2">
                    Showing <span className="font-bold text-primary-600">{filteredDoctors.length}</span> doctor{filteredDoctors.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>

              {/* Row 2: Filter Dropdowns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* State Dropdown */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                    <Building2 size={14} />
                    State
                  </label>
                  <select
                    value={selectedState}
                    onChange={(e) => {
                      setSelectedState(e.target.value);
                      if (e.target.value !== 'all') {
                        setNearMeEnabled(false);
                        setUserLocation(null);
                      }
                    }}
                    disabled={nearMeEnabled}
                    className={`w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50 ${nearMeEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {indianStates.map(state => (
                      <option key={state.id} value={state.id}>{state.name}</option>
                    ))}
                  </select>
                </div>

                {/* Location Dropdown */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                    <MapPin size={14} />
                    Location
                  </label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => {
                      setSelectedLocation(e.target.value);
                      if (e.target.value !== 'all') {
                        setNearMeEnabled(false);
                        setUserLocation(null);
                      }
                    }}
                    disabled={nearMeEnabled}
                    className={`w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50 ${nearMeEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {filteredLocations.map(loc => (
                      <option key={loc.id} value={loc.id}>{loc.name}</option>
                    ))}
                  </select>
                </div>

                {/* Specialty Dropdown */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                    <Stethoscope size={14} />
                    Specialty
                  </label>
                  <select
                    value={selectedSpecialty}
                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                    className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50"
                  >
                    {availableSpecializations.map(spec => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                </div>

                {/* Consultation Type Dropdown */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                    {selectedConsultationType === 'home' ? (
                      <Home size={14} />
                    ) : selectedConsultationType === 'video' ? (
                      <Video size={14} />
                    ) : (
                      <Building size={14} />
                    )}
                    Consultation Type
                  </label>
                  <select
                    value={selectedConsultationType}
                    onChange={(e) => setSelectedConsultationType(e.target.value)}
                    className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50"
                  >
                    {consultationTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Near Me - Nearby Clinics List */}
              {nearMeEnabled && getNearbyClinics.length > 0 && (
                <div className="mt-5 pt-5 border-t border-gray-100">
                  <p className="text-sm text-gray-600 mb-2">Clinics near you:</p>
                  <div className="flex flex-wrap gap-2">
                    {getNearbyClinics.map(clinic => (
                      <span key={clinic.id} className="inline-flex items-center gap-1 bg-primary-50 border border-primary-100 text-primary-700 text-sm px-3 py-1.5">
                        <MapPin size={14} />
                        {clinic.name}
                        <span className="text-primary-500">({clinic.distance.toFixed(1)} km)</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent"></div>
            </div>
          ) : filteredDoctors.length === 0 ? (
            <div className="text-center py-16 bg-white border border-gray-200">
              <Stethoscope className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No doctors found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your filters to find available doctors.</p>
              <button
                onClick={clearFilters}
                className="bg-primary-600 text-white px-6 py-2 font-medium hover:bg-primary-700 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDoctors.map((doctor, index) => (
                <div 
                  key={doctor.id} 
                  className="bg-white border border-gray-200 overflow-hidden hover:border-primary-300 hover:shadow-md transition-all group"
                >
                  {/* Doctor Image */}
                  <div className="relative h-48 overflow-hidden bg-gray-100 flex items-center justify-center">
                    <img 
                      src={doctorImages[index % doctorImages.length]}
                      alt={doctor.full_name}
                      className="w-full h-full object-contain transition-transform duration-300"
                    />
                    {/* Rating Badge */}
                    <div className="absolute top-4 right-4 bg-white px-3 py-1 flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="font-semibold text-gray-900 text-sm">4.9</span>
                    </div>
                  </div>

                  {/* Doctor Info */}
                  <div className="p-5">
                    <span className="text-xs font-medium text-primary-600 bg-primary-50 px-3 py-1 inline-block mb-3">
                      {doctor.specialization}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{doctor.full_name}</h3>
                    
                    {/* Qualification */}
                    {doctor.qualification && (
                      <div className="flex items-center gap-2 text-gray-600 mb-3">
                        <GraduationCap size={16} className="text-primary-600" />
                        <span className="text-sm">{doctor.qualification}</span>
                      </div>
                    )}

                    {/* Experience & Fee */}
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 bg-primary-50 border border-primary-100 flex items-center justify-center">
                          <Award size={16} className="text-primary-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{doctor.experience_years}+ Years</p>
                          <p className="text-xs text-gray-500">Experience</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-xl text-primary-600">₹{doctor.consultation_fee}</p>
                        <p className="text-xs text-gray-500">Per Session</p>
                      </div>
                    </div>

                    {/* Bio */}
                    {doctor.bio && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{doctor.bio}</p>
                    )}

                    {/* Availability */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className={`w-2 h-2 ${doctor.is_available ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      <span className={`text-sm ${doctor.is_available ? 'text-green-600' : 'text-red-600'}`}>
                        {doctor.is_available ? 'Available for appointments' : 'Currently unavailable'}
                      </span>
                    </div>

                    {/* Book Button */}
                    <Link 
                      to={`/book/${doctor.id}`}
                      className={`block w-full text-center py-3 font-medium transition-colors ${
                        doctor.is_available 
                          ? 'bg-primary-600 hover:bg-primary-700 text-white'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <span className="flex items-center justify-center gap-2">
                        <Calendar size={16} />
                        {doctor.is_available ? 'Book Appointment' : 'Unavailable'}
                      </span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <Calendar className="w-12 h-12 text-white mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-4">
              Need Help Choosing a Doctor?
            </h2>
            <p className="text-primary-100 mb-8">
              Our team can help you find the right specialist for your needs. 
              Contact us for a free consultation.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                to="/contact" 
                className="bg-white text-primary-600 hover:bg-primary-50 font-medium py-3 px-8 transition-colors"
              >
                Contact Us
              </Link>
              <Link 
                to="/book" 
                className="border border-white/50 text-white hover:bg-white/10 font-medium py-3 px-8 transition-colors flex items-center gap-2"
              >
                Book Any Doctor <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DoctorsPage;
