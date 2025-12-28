/**
 * Comprehensive India Locations Database for SEO
 * Covers all states, union territories, major cities, and districts
 */

// All 28 States and 8 Union Territories
export const STATES_AND_UTS = [
  // States
  { code: 'AP', name: 'Andhra Pradesh', capital: 'Amaravati', region: 'South' },
  { code: 'AR', name: 'Arunachal Pradesh', capital: 'Itanagar', region: 'Northeast' },
  { code: 'AS', name: 'Assam', capital: 'Dispur', region: 'Northeast' },
  { code: 'BR', name: 'Bihar', capital: 'Patna', region: 'East' },
  { code: 'CT', name: 'Chhattisgarh', capital: 'Raipur', region: 'Central' },
  { code: 'GA', name: 'Goa', capital: 'Panaji', region: 'West' },
  { code: 'GJ', name: 'Gujarat', capital: 'Gandhinagar', region: 'West' },
  { code: 'HR', name: 'Haryana', capital: 'Chandigarh', region: 'North' },
  { code: 'HP', name: 'Himachal Pradesh', capital: 'Shimla', region: 'North' },
  { code: 'JH', name: 'Jharkhand', capital: 'Ranchi', region: 'East' },
  { code: 'KA', name: 'Karnataka', capital: 'Bengaluru', region: 'South' },
  { code: 'KL', name: 'Kerala', capital: 'Thiruvananthapuram', region: 'South' },
  { code: 'MP', name: 'Madhya Pradesh', capital: 'Bhopal', region: 'Central' },
  { code: 'MH', name: 'Maharashtra', capital: 'Mumbai', region: 'West' },
  { code: 'MN', name: 'Manipur', capital: 'Imphal', region: 'Northeast' },
  { code: 'ML', name: 'Meghalaya', capital: 'Shillong', region: 'Northeast' },
  { code: 'MZ', name: 'Mizoram', capital: 'Aizawl', region: 'Northeast' },
  { code: 'NL', name: 'Nagaland', capital: 'Kohima', region: 'Northeast' },
  { code: 'OD', name: 'Odisha', capital: 'Bhubaneswar', region: 'East' },
  { code: 'PB', name: 'Punjab', capital: 'Chandigarh', region: 'North' },
  { code: 'RJ', name: 'Rajasthan', capital: 'Jaipur', region: 'North' },
  { code: 'SK', name: 'Sikkim', capital: 'Gangtok', region: 'Northeast' },
  { code: 'TN', name: 'Tamil Nadu', capital: 'Chennai', region: 'South' },
  { code: 'TG', name: 'Telangana', capital: 'Hyderabad', region: 'South' },
  { code: 'TR', name: 'Tripura', capital: 'Agartala', region: 'Northeast' },
  { code: 'UP', name: 'Uttar Pradesh', capital: 'Lucknow', region: 'North' },
  { code: 'UK', name: 'Uttarakhand', capital: 'Dehradun', region: 'North' },
  { code: 'WB', name: 'West Bengal', capital: 'Kolkata', region: 'East' },
  // Union Territories
  { code: 'AN', name: 'Andaman and Nicobar Islands', capital: 'Port Blair', region: 'Islands', isUT: true },
  { code: 'CH', name: 'Chandigarh', capital: 'Chandigarh', region: 'North', isUT: true },
  { code: 'DN', name: 'Dadra and Nagar Haveli and Daman and Diu', capital: 'Daman', region: 'West', isUT: true },
  { code: 'DL', name: 'Delhi', capital: 'New Delhi', region: 'North', isUT: true },
  { code: 'JK', name: 'Jammu and Kashmir', capital: 'Srinagar', region: 'North', isUT: true },
  { code: 'LA', name: 'Ladakh', capital: 'Leh', region: 'North', isUT: true },
  { code: 'LD', name: 'Lakshadweep', capital: 'Kavaratti', region: 'Islands', isUT: true },
  { code: 'PY', name: 'Puducherry', capital: 'Puducherry', region: 'South', isUT: true },
];

// Comprehensive list of ALL major cities (500+ cities)
export const ALL_CITIES = [
  // Andhra Pradesh
  'Visakhapatnam', 'Vizag', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool', 'Rajahmundry', 
  'Kakinada', 'Tirupati', 'Kadapa', 'Anantapur', 'Vizianagaram', 'Eluru', 'Ongole', 
  'Nandyal', 'Machilipatnam', 'Adoni', 'Tenali', 'Proddatur', 'Chittoor', 'Hindupur',
  'Bhimavaram', 'Madanapalle', 'Guntakal', 'Dharmavaram', 'Gudivada', 'Srikakulam',
  'Narasaraopet', 'Tadepalligudem', 'Tadipatri', 'Amaravati',
  
  // Telangana
  'Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Ramagundam', 'Khammam', 
  'Mahbubnagar', 'Nalgonda', 'Adilabad', 'Suryapet', 'Miryalaguda', 'Siddipet',
  'Jagtial', 'Mancherial', 'Kamareddy', 'Nirmal', 'Bodhan', 'Sangareddy', 'Medak',
  'Secunderabad', 'Kukatpally', 'Gachibowli', 'Hitec City', 'Madhapur', 'Banjara Hills',
  'Jubilee Hills', 'Ameerpet', 'Dilsukhnagar', 'LB Nagar', 'Uppal', 'ECIL',
  
  // Tamil Nadu
  'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Trichy', 'Salem', 'Tirunelveli',
  'Tiruppur', 'Vellore', 'Erode', 'Thoothukkudi', 'Dindigul', 'Thanjavur', 'Ranipet',
  'Sivakasi', 'Karur', 'Udhagamandalam', 'Ooty', 'Hosur', 'Nagercoil', 'Kanchipuram',
  'Kumbakonam', 'Rajapalayam', 'Pudukkottai', 'Karaikkudi', 'Neyveli', 'Cuddalore',
  'Ambur', 'Nagapattinam', 'Pollachi', 'Krishnagiri', 'Vaniyambadi', 'Pallavaram',
  
  // Karnataka
  'Bengaluru', 'Bangalore', 'Mysuru', 'Mysore', 'Hubballi', 'Hubli', 'Mangaluru', 
  'Mangalore', 'Belagavi', 'Belgaum', 'Davanagere', 'Ballari', 'Bellary', 'Vijayapura',
  'Shimoga', 'Tumakuru', 'Tumkur', 'Raichur', 'Bidar', 'Hospet', 'Gadag', 'Udupi',
  'Hassan', 'Mandya', 'Chitradurga', 'Kolar', 'Chikmagalur', 'Bagalkot', 'Gulbarga',
  'Kalaburagi', 'Dharwad', 'Haveri', 'Robertson Pet', 'Bhadravati', 'Gangavathi',
  'Whitefield', 'Electronic City', 'Koramangala', 'Indiranagar', 'Jayanagar', 'HSR Layout',
  
  // Kerala
  'Thiruvananthapuram', 'Trivandrum', 'Kochi', 'Cochin', 'Kozhikode', 'Calicut',
  'Thrissur', 'Kollam', 'Alappuzha', 'Alleppey', 'Palakkad', 'Kannur', 'Kottayam',
  'Malappuram', 'Kasaragod', 'Pathanamthitta', 'Idukki', 'Wayanad', 'Ernakulam',
  'Perinthalmanna', 'Mattancherry', 'Fort Kochi', 'Munnar', 'Thekkady', 'Guruvayur',
  
  // Maharashtra
  'Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Aurangabad', 'Solapur', 'Kolhapur',
  'Amravati', 'Navi Mumbai', 'Sangli', 'Malegaon', 'Jalgaon', 'Akola', 'Latur',
  'Dhule', 'Ahmednagar', 'Chandrapur', 'Parbhani', 'Ichalkaranji', 'Jalna', 'Ambernath',
  'Bhiwandi', 'Panvel', 'Badlapur', 'Beed', 'Gondia', 'Satara', 'Barshi', 'Yavatmal',
  'Wardha', 'Udgir', 'Ratnagiri', 'Nanded', 'Buldhana', 'Vasai', 'Virar', 'Kalyan',
  'Dombivli', 'Ulhasnagar', 'Mira Bhayandar', 'Borivali', 'Andheri', 'Bandra', 'Worli',
  'Lower Parel', 'Powai', 'Goregaon', 'Malad', 'Kandivali', 'Chembur', 'Ghatkopar',
  'Mulund', 'Vashi', 'Kharghar', 'Belapur', 'Nerul', 'Airoli', 'Kopar Khairane',
  
  // Gujarat
  'Ahmedabad', 'Surat', 'Vadodara', 'Baroda', 'Rajkot', 'Bhavnagar', 'Jamnagar',
  'Junagadh', 'Gandhinagar', 'Gandhidham', 'Anand', 'Navsari', 'Morbi', 'Nadiad',
  'Surendranagar', 'Bharuch', 'Mehsana', 'Bhuj', 'Porbandar', 'Palanpur', 'Valsad',
  'Vapi', 'Gondal', 'Veraval', 'Godhra', 'Patan', 'Kalol', 'Dahod', 'Botad',
  'Amreli', 'Deesa', 'Jetpur', 'GIFT City', 'Sabarmati', 'Vastrapur', 'Prahlad Nagar',
  
  // Rajasthan
  'Jaipur', 'Jodhpur', 'Kota', 'Bikaner', 'Ajmer', 'Udaipur', 'Bhilwara', 'Alwar',
  'Bharatpur', 'Sikar', 'Pali', 'Sri Ganganagar', 'Tonk', 'Kishangarh', 'Beawar',
  'Hanumangarh', 'Dhaulpur', 'Gangapur City', 'Sawai Madhopur', 'Churu', 'Jhunjhunu',
  'Nagaur', 'Bundi', 'Chittorgarh', 'Pushkar', 'Mount Abu', 'Jaisalmer', 'Baran',
  
  // Delhi NCR
  'New Delhi', 'Delhi', 'Noida', 'Gurgaon', 'Gurugram', 'Faridabad', 'Ghaziabad',
  'Greater Noida', 'Dwarka', 'Rohini', 'Saket', 'Vasant Kunj', 'Janakpuri', 'Pitampura',
  'Lajpat Nagar', 'Nehru Place', 'Karol Bagh', 'Connaught Place', 'Rajouri Garden',
  'Punjabi Bagh', 'Mayur Vihar', 'Preet Vihar', 'Laxmi Nagar', 'Shahdara', 'Chandni Chowk',
  'Okhla', 'Jasola', 'Sarita Vihar', 'Kalkaji', 'Hauz Khas', 'Malviya Nagar',
  'Sector 18 Noida', 'Sector 62 Noida', 'Sector 63 Noida', 'DLF Phase 1', 'DLF Phase 2',
  'Cyber City Gurgaon', 'Sohna Road', 'Golf Course Road', 'MG Road Gurgaon',
  
  // Uttar Pradesh
  'Lucknow', 'Kanpur', 'Varanasi', 'Benaras', 'Agra', 'Prayagraj', 'Allahabad',
  'Meerut', 'Bareilly', 'Aligarh', 'Moradabad', 'Saharanpur', 'Gorakhpur', 'Firozabad',
  'Jhansi', 'Muzaffarnagar', 'Mathura', 'Rampur', 'Shahjahanpur', 'Farrukhabad',
  'Maunath Bhanjan', 'Hapur', 'Etawah', 'Mirzapur', 'Bulandshahr', 'Sambhal', 'Amroha',
  'Hardoi', 'Fatehpur', 'Raebareli', 'Orai', 'Sitapur', 'Bahraich', 'Ayodhya',
  'Modinagar', 'Unnao', 'Jaunpur', 'Lakhimpur', 'Banda', 'Gonda', 'Sultanpur',
  
  // Madhya Pradesh
  'Bhopal', 'Indore', 'Gwalior', 'Jabalpur', 'Ujjain', 'Sagar', 'Dewas', 'Satna',
  'Ratlam', 'Rewa', 'Murwara', 'Singrauli', 'Burhanpur', 'Khandwa', 'Bhind',
  'Chhindwara', 'Guna', 'Shivpuri', 'Vidisha', 'Damoh', 'Mandsaur', 'Khargone',
  'Neemuch', 'Pithampur', 'Hoshangabad', 'Itarsi', 'Sehore', 'Betul', 'Seoni',
  
  // West Bengal
  'Kolkata', 'Calcutta', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri', 'Bardhaman',
  'Malda', 'Baharampur', 'Habra', 'Kharagpur', 'Shantipur', 'Dankuni', 'Dhulian',
  'Raniganj', 'Haldia', 'Raiganj', 'Krishnanagar', 'Nabadwip', 'Medinipur', 'Jalpaiguri',
  'Cooch Behar', 'Darjeeling', 'Alipurduar', 'Purulia', 'Bankura', 'Contai', 'Salt Lake',
  'Rajarhat', 'New Town Kolkata', 'Dum Dum', 'Barrackpore', 'Barasat', 'Madhyamgram',
  
  // Bihar
  'Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia', 'Darbhanga', 'Bihar Sharif',
  'Arrah', 'Begusarai', 'Katihar', 'Munger', 'Chhapra', 'Samastipur', 'Hajipur',
  'Sasaram', 'Dehri', 'Siwan', 'Motihari', 'Nawada', 'Bagaha', 'Bettiah', 'Saharsa',
  'Madhubani', 'Sitamarhi', 'Jehanabad', 'Aurangabad Bihar', 'Buxar', 'Kishanganj',
  
  // Odisha
  'Bhubaneswar', 'Cuttack', 'Rourkela', 'Brahmapur', 'Berhampur', 'Sambalpur',
  'Puri', 'Balasore', 'Bhadrak', 'Baripada', 'Jharsuguda', 'Jeypore', 'Bargarh',
  'Rayagada', 'Paradip', 'Bhawanipatna', 'Dhenkanal', 'Kendujhar', 'Angul', 'Jatani',
  
  // Jharkhand
  'Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro Steel City', 'Hazaribagh', 'Deoghar',
  'Giridih', 'Ramgarh', 'Phusro', 'Medininagar', 'Chirkunda', 'Chaibasa', 'Dumka',
  
  // Chhattisgarh
  'Raipur', 'Bhilai', 'Bilaspur', 'Korba', 'Durg', 'Rajnandgaon', 'Raigarh',
  'Jagdalpur', 'Ambikapur', 'Dhamtari', 'Mahasamund', 'Chirmiri', 'Dongargarh',
  
  // Punjab
  'Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Hoshiarpur', 'Mohali',
  'Batala', 'Pathankot', 'Moga', 'Abohar', 'Malerkotla', 'Khanna', 'Phagwara',
  'Muktsar', 'Barnala', 'Rajpura', 'Firozpur', 'Kapurthala', 'Zirakpur', 'Kharar',
  
  // Haryana
  'Chandigarh', 'Faridabad', 'Gurgaon', 'Gurugram', 'Panipat', 'Ambala', 'Yamunanagar',
  'Rohtak', 'Hisar', 'Karnal', 'Sonipat', 'Panchkula', 'Bhiwani', 'Sirsa', 'Bahadurgarh',
  'Jind', 'Thanesar', 'Kaithal', 'Rewari', 'Palwal', 'Manesar', 'Sohna', 'Dharuhera',
  
  // Uttarakhand
  'Dehradun', 'Haridwar', 'Rishikesh', 'Haldwani', 'Nainital', 'Roorkee', 'Kashipur',
  'Rudrapur', 'Ramnagar', 'Pithoragarh', 'Almora', 'Mussoorie', 'Kotdwar', 'Chamoli',
  
  // Himachal Pradesh
  'Shimla', 'Dharamshala', 'Solan', 'Mandi', 'Palampur', 'Baddi', 'Nahan', 'Paonta Sahib',
  'Sundernagar', 'Kullu', 'Manali', 'Chamba', 'Una', 'Hamirpur', 'Bilaspur HP', 'Kasauli',
  
  // Jammu & Kashmir
  'Srinagar', 'Jammu', 'Anantnag', 'Baramulla', 'Sopore', 'Udhampur', 'Leh', 'Kathua',
  'Kupwara', 'Pulwama', 'Rajouri', 'Poonch', 'Kargil', 'Bandipore', 'Ganderbal',
  
  // Assam
  'Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon', 'Tinsukia', 'Tezpur',
  'Karimganj', 'Bongaigaon', 'Sivasagar', 'Goalpara', 'North Lakhimpur', 'Dhubri',
  
  // Northeast States
  'Imphal', 'Shillong', 'Aizawl', 'Agartala', 'Kohima', 'Itanagar', 'Gangtok', 'Dimapur',
  'Tura', 'Thoubal', 'Churachandpur', 'Diphu', 'Mokokchung', 'Lunglei', 'Naharlagun',
  
  // Goa
  'Panaji', 'Panjim', 'Margao', 'Vasco da Gama', 'Mapusa', 'Ponda', 'Bicholim', 'Curchorem',
  'Sanquelim', 'Cuncolim', 'Quepem', 'Calangute', 'Candolim', 'Baga', 'Anjuna', 'Vagator',
  
  // Union Territories
  'Port Blair', 'Daman', 'Silvassa', 'Puducherry', 'Pondicherry', 'Karaikal', 'Mahe', 'Yanam',
  'Kavaratti', 'Agatti', 'Minicoy',
];

// Common alternate spellings and local names
export const CITY_ALIASES = {
  'Visakhapatnam': ['Vizag', 'Vizagapatnam', 'Waltair'],
  'Bengaluru': ['Bangalore', 'Bengalooru'],
  'Mumbai': ['Bombay'],
  'Kolkata': ['Calcutta'],
  'Chennai': ['Madras'],
  'Thiruvananthapuram': ['Trivandrum', 'TVM'],
  'Kochi': ['Cochin', 'Ernakulam'],
  'Kozhikode': ['Calicut'],
  'Mysuru': ['Mysore'],
  'Vadodara': ['Baroda'],
  'Varanasi': ['Benaras', 'Benares', 'Kashi'],
  'Prayagraj': ['Allahabad'],
  'Gurugram': ['Gurgaon'],
  'Puducherry': ['Pondicherry', 'Pondy'],
  'Hubballi': ['Hubli'],
  'Belagavi': ['Belgaum'],
  'Mangaluru': ['Mangalore'],
  'Tiruchirappalli': ['Trichy'],
  'Alappuzha': ['Alleppey'],
  'Vijayapura': ['Bijapur'],
  'Kalaburagi': ['Gulbarga'],
  'Shivamogga': ['Shimoga'],
  'Tumakuru': ['Tumkur'],
  'Ballari': ['Bellary'],
};

// Top metro cities for priority SEO
export const METRO_CITIES = [
  'Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata', 
  'Ahmedabad', 'Pune', 'Surat', 'Jaipur'
];

// Tier 1 cities
export const TIER1_CITIES = [
  'Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Ahmedabad', 'Chennai', 
  'Kolkata', 'Pune', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Visakhapatnam',
  'Indore', 'Thane', 'Bhopal', 'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana',
  'Agra', 'Nashik', 'Faridabad', 'Meerut', 'Rajkot', 'Varanasi', 'Srinagar',
  'Aurangabad', 'Dhanbad', 'Amritsar', 'Navi Mumbai', 'Allahabad', 'Ranchi',
  'Howrah', 'Coimbatore', 'Jabalpur', 'Gwalior', 'Vijayawada', 'Jodhpur', 
  'Madurai', 'Raipur', 'Kota', 'Guwahati', 'Chandigarh', 'Solapur', 'Hubli',
  'Tiruchirappalli', 'Bareilly', 'Mysore', 'Tiruppur', 'Gurgaon', 'Noida'
];

// Tier 2 cities
export const TIER2_CITIES = [
  'Aligarh', 'Jalandhar', 'Bhubaneswar', 'Salem', 'Warangal', 'Guntur',
  'Bhiwandi', 'Saharanpur', 'Gorakhpur', 'Bikaner', 'Amravati', 'Noida',
  'Jamshedpur', 'Bhilai', 'Cuttack', 'Firozabad', 'Kochi', 'Nellore',
  'Bhavnagar', 'Dehradun', 'Durgapur', 'Asansol', 'Rourkela', 'Nanded',
  'Kolhapur', 'Ajmer', 'Akola', 'Gulbarga', 'Jamnagar', 'Ujjain', 'Loni',
  'Siliguri', 'Jhansi', 'Ulhasnagar', 'Jammu', 'Sangli', 'Mangalore',
  'Erode', 'Belgaum', 'Ambattur', 'Tirunelveli', 'Malegaon', 'Gaya'
];

// All physiotherapy-related keywords
export const PHYSIO_KEYWORDS = [
  // Primary keywords
  'physiotherapy', 'physiotherapist', 'physio', 'physical therapy', 'PT',
  'physiotherapy clinic', 'physio clinic', 'physiotherapy center', 'physio center',
  'physiotherapy hospital', 'rehab center', 'rehabilitation center',
  
  // Treatment keywords
  'back pain treatment', 'back pain physio', 'lower back pain', 'upper back pain',
  'neck pain treatment', 'neck pain physio', 'cervical pain', 'cervical spondylosis',
  'knee pain treatment', 'knee physio', 'knee replacement rehab', 'ACL rehab',
  'shoulder pain', 'frozen shoulder', 'rotator cuff', 'shoulder physio',
  'joint pain', 'muscle pain', 'body pain', 'chronic pain', 'pain management',
  'sciatica treatment', 'slip disc', 'herniated disc', 'disc bulge',
  'arthritis treatment', 'osteoarthritis', 'rheumatoid arthritis',
  'sports injury', 'sports physio', 'athletic injury', 'sports rehabilitation',
  'post surgery rehab', 'post operative physiotherapy', 'surgical rehab',
  'stroke rehabilitation', 'paralysis treatment', 'neuro physio', 'neurological physio',
  'spinal cord injury', 'spine treatment', 'spinal rehab',
  
  // Specialty keywords
  'orthopedic physiotherapy', 'ortho physio', 'musculoskeletal physio',
  'neurological physiotherapy', 'neuro rehabilitation',
  'pediatric physiotherapy', 'child physio', 'kids physiotherapy',
  'geriatric physiotherapy', 'elderly physio', 'senior physiotherapy',
  'sports physiotherapy', 'athletic physiotherapy',
  'cardiopulmonary physiotherapy', 'cardiac rehab', 'pulmonary rehab',
  'womens health physiotherapy', 'pelvic floor physio', 'prenatal physio', 'postnatal physio',
  
  // Condition keywords
  'tennis elbow', 'golfers elbow', 'carpal tunnel', 'wrist pain',
  'ankle sprain', 'foot pain', 'plantar fasciitis', 'heel pain',
  'hip pain', 'hip replacement rehab', 'hip physio',
  'fibromyalgia', 'chronic fatigue', 'posture correction',
  'scoliosis treatment', 'kyphosis', 'lordosis',
  'vertigo treatment', 'balance disorder', 'vestibular rehab',
  
  // Service keywords
  'home physiotherapy', 'home visit physio', 'doorstep physiotherapy',
  'online physiotherapy', 'tele physiotherapy', 'virtual physio',
  'emergency physiotherapy', '24 hour physio', '24/7 physiotherapy',
  'dry needling', 'cupping therapy', 'manual therapy', 'massage therapy',
  'electrotherapy', 'ultrasound therapy', 'TENS', 'IFT',
  'exercise therapy', 'therapeutic exercises', 'stretching',
  'hydrotherapy', 'aquatic therapy', 'pool therapy',
  
  // Search intent keywords
  'best physiotherapy', 'top physiotherapist', 'famous physio',
  'physiotherapy near me', 'physio near me', 'physiotherapist near me',
  'physiotherapy appointment', 'book physio', 'physio consultation',
  'affordable physiotherapy', 'cheap physio', 'physiotherapy cost',
  'physiotherapy fees', 'physio charges', 'consultation fees',
];

// Generate location-based keyword combinations
export const generateLocationKeywords = (city, state = null) => {
  const keywords = [];
  const cityLower = city.toLowerCase();
  
  // Base physiotherapy keywords with city
  PHYSIO_KEYWORDS.forEach(keyword => {
    keywords.push(`${keyword} ${city}`);
    keywords.push(`${keyword} in ${city}`);
    keywords.push(`${city} ${keyword}`);
  });
  
  // Common search patterns
  keywords.push(`physio ${city}`);
  keywords.push(`physiotherapy ${city}`);
  keywords.push(`best physiotherapy in ${city}`);
  keywords.push(`top physiotherapist in ${city}`);
  keywords.push(`physiotherapy clinic ${city}`);
  keywords.push(`physiotherapy near me ${city}`);
  keywords.push(`${city} physiotherapy clinic`);
  keywords.push(`${city} physiotherapist`);
  keywords.push(`${city} physio clinic`);
  keywords.push(`NovaCare ${city}`);
  keywords.push(`novacare247 ${city}`);
  
  // With state
  if (state) {
    keywords.push(`physiotherapy ${city} ${state}`);
    keywords.push(`best physio ${city} ${state}`);
  }
  
  return keywords;
};

// Generate all SEO keywords
export const generateAllSEOKeywords = () => {
  const allKeywords = new Set();
  
  // Add base keywords
  PHYSIO_KEYWORDS.forEach(k => allKeywords.add(k));
  
  // Add NovaCare variations
  ['NovaCare', 'novacare', 'nova care', 'novacare247', 'novacare 247', 'NovaCare 24/7'].forEach(k => allKeywords.add(k));
  
  // Add India-wide keywords
  allKeywords.add('physiotherapy India');
  allKeywords.add('best physiotherapy India');
  allKeywords.add('physio India');
  allKeywords.add('Indian physiotherapy');
  
  // Add city-specific keywords for all cities
  ALL_CITIES.forEach(city => {
    allKeywords.add(`physiotherapy ${city}`);
    allKeywords.add(`physio ${city}`);
    allKeywords.add(`physiotherapist ${city}`);
    allKeywords.add(`best physio ${city}`);
  });
  
  return Array.from(allKeywords);
};

// Export default
export default {
  STATES_AND_UTS,
  ALL_CITIES,
  CITY_ALIASES,
  METRO_CITIES,
  TIER1_CITIES,
  TIER2_CITIES,
  PHYSIO_KEYWORDS,
  generateLocationKeywords,
  generateAllSEOKeywords,
};
