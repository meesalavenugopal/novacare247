/**
 * Sitemap Generator Script
 * Run with: node scripts/generateSitemap.js
 * Generates sitemap.xml with all Indian cities for SEO
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// All Indian cities data
const indianCities = [
  // Tier 1 - Metro Cities
  { name: 'Hyderabad', priority: 0.9 },
  { name: 'Visakhapatnam', priority: 0.9 },
  { name: 'Vijayawada', priority: 0.9 },
  { name: 'Bangalore', priority: 0.9 },
  { name: 'Chennai', priority: 0.9 },
  { name: 'Mumbai', priority: 0.9 },
  { name: 'Delhi', priority: 0.9 },
  { name: 'Kolkata', priority: 0.9 },
  { name: 'Pune', priority: 0.9 },
  { name: 'Ahmedabad', priority: 0.9 },
  { name: 'Jaipur', priority: 0.9 },
  { name: 'Lucknow', priority: 0.9 },
  
  // Tier 2 - Major Cities
  { name: 'Secunderabad', priority: 0.8 },
  { name: 'Guntur', priority: 0.8 },
  { name: 'Nellore', priority: 0.8 },
  { name: 'Kurnool', priority: 0.8 },
  { name: 'Rajahmundry', priority: 0.8 },
  { name: 'Kakinada', priority: 0.8 },
  { name: 'Tirupati', priority: 0.8 },
  { name: 'Warangal', priority: 0.8 },
  { name: 'Nizamabad', priority: 0.8 },
  { name: 'Karimnagar', priority: 0.8 },
  { name: 'Khammam', priority: 0.8 },
  { name: 'Mysore', priority: 0.8 },
  { name: 'Mangalore', priority: 0.8 },
  { name: 'Hubli', priority: 0.8 },
  { name: 'Belgaum', priority: 0.8 },
  { name: 'Coimbatore', priority: 0.8 },
  { name: 'Madurai', priority: 0.8 },
  { name: 'Trichy', priority: 0.8 },
  { name: 'Salem', priority: 0.8 },
  { name: 'Kochi', priority: 0.8 },
  { name: 'Thiruvananthapuram', priority: 0.8 },
  { name: 'Kozhikode', priority: 0.8 },
  { name: 'Thrissur', priority: 0.8 },
  { name: 'Nagpur', priority: 0.8 },
  { name: 'Thane', priority: 0.8 },
  { name: 'Nashik', priority: 0.8 },
  { name: 'Aurangabad', priority: 0.8 },
  { name: 'Navi-Mumbai', priority: 0.8 },
  { name: 'Surat', priority: 0.8 },
  { name: 'Vadodara', priority: 0.8 },
  { name: 'Rajkot', priority: 0.8 },
  { name: 'Gandhinagar', priority: 0.8 },
  { name: 'Jodhpur', priority: 0.8 },
  { name: 'Udaipur', priority: 0.8 },
  { name: 'Kota', priority: 0.8 },
  { name: 'Gurgaon', priority: 0.8 },
  { name: 'Noida', priority: 0.8 },
  { name: 'Ghaziabad', priority: 0.8 },
  { name: 'Faridabad', priority: 0.8 },
  { name: 'Chandigarh', priority: 0.8 },
  { name: 'Ludhiana', priority: 0.8 },
  { name: 'Amritsar', priority: 0.8 },
  { name: 'Kanpur', priority: 0.8 },
  { name: 'Varanasi', priority: 0.8 },
  { name: 'Agra', priority: 0.8 },
  { name: 'Prayagraj', priority: 0.8 },
  { name: 'Indore', priority: 0.8 },
  { name: 'Bhopal', priority: 0.8 },
  { name: 'Jabalpur', priority: 0.8 },
  { name: 'Gwalior', priority: 0.8 },
  { name: 'Patna', priority: 0.8 },
  { name: 'Ranchi', priority: 0.8 },
  { name: 'Jamshedpur', priority: 0.8 },
  { name: 'Bhubaneswar', priority: 0.8 },
  { name: 'Cuttack', priority: 0.8 },
  { name: 'Raipur', priority: 0.8 },
  { name: 'Dehradun', priority: 0.8 },
  { name: 'Haridwar', priority: 0.8 },
  { name: 'Guwahati', priority: 0.8 },
  { name: 'Shimla', priority: 0.8 },
  { name: 'Srinagar', priority: 0.8 },
  { name: 'Jammu', priority: 0.8 },
  
  // Tier 3 - Smaller Cities
  { name: 'Anantapur', priority: 0.7 },
  { name: 'Kadapa', priority: 0.7 },
  { name: 'Eluru', priority: 0.7 },
  { name: 'Ongole', priority: 0.7 },
  { name: 'Nandyal', priority: 0.7 },
  { name: 'Machilipatnam', priority: 0.7 },
  { name: 'Adoni', priority: 0.7 },
  { name: 'Tenali', priority: 0.7 },
  { name: 'Chittoor', priority: 0.7 },
  { name: 'Hindupur', priority: 0.7 },
  { name: 'Proddatur', priority: 0.7 },
  { name: 'Bhimavaram', priority: 0.7 },
  { name: 'Madanapalle', priority: 0.7 },
  { name: 'Srikakulam', priority: 0.7 },
  { name: 'Amaravati', priority: 0.7 },
  { name: 'Nalgonda', priority: 0.7 },
  { name: 'Adilabad', priority: 0.7 },
  { name: 'Suryapet', priority: 0.7 },
  { name: 'Siddipet', priority: 0.7 },
  { name: 'Miryalaguda', priority: 0.7 },
  { name: 'Jagtial', priority: 0.7 },
  { name: 'Mancherial', priority: 0.7 },
  { name: 'Ramagundam', priority: 0.7 },
  { name: 'Kukatpally', priority: 0.7 },
  { name: 'Gachibowli', priority: 0.7 },
  { name: 'Madhapur', priority: 0.7 },
  { name: 'Banjara-Hills', priority: 0.7 },
  { name: 'Jubilee-Hills', priority: 0.7 },
  { name: 'Begumpet', priority: 0.7 },
  { name: 'Ameerpet', priority: 0.7 },
  { name: 'Dilsukhnagar', priority: 0.7 },
  { name: 'LB-Nagar', priority: 0.7 },
  { name: 'Uppal', priority: 0.7 },
  { name: 'Dharwad', priority: 0.7 },
  { name: 'Gulbarga', priority: 0.7 },
  { name: 'Bellary', priority: 0.7 },
  { name: 'Shimoga', priority: 0.7 },
  { name: 'Tumkur', priority: 0.7 },
  { name: 'Davangere', priority: 0.7 },
  { name: 'Bijapur', priority: 0.7 },
  { name: 'Raichur', priority: 0.7 },
  { name: 'Bidar', priority: 0.7 },
  { name: 'Hassan', priority: 0.7 },
  { name: 'Udupi', priority: 0.7 },
  { name: 'Chitradurga', priority: 0.7 },
  { name: 'Kolar', priority: 0.7 },
  { name: 'Mandya', priority: 0.7 },
  { name: 'Chikmagalur', priority: 0.7 },
  { name: 'Whitefield', priority: 0.7 },
  { name: 'Electronic-City', priority: 0.7 },
  { name: 'Koramangala', priority: 0.7 },
  { name: 'Indiranagar', priority: 0.7 },
  { name: 'HSR-Layout', priority: 0.7 },
  { name: 'Jayanagar', priority: 0.7 },
  { name: 'BTM-Layout', priority: 0.7 },
  { name: 'Marathahalli', priority: 0.7 },
  { name: 'Tirunelveli', priority: 0.7 },
  { name: 'Tiruppur', priority: 0.7 },
  { name: 'Erode', priority: 0.7 },
  { name: 'Vellore', priority: 0.7 },
  { name: 'Thoothukudi', priority: 0.7 },
  { name: 'Thanjavur', priority: 0.7 },
  { name: 'Dindigul', priority: 0.7 },
  { name: 'Cuddalore', priority: 0.7 },
  { name: 'Kanchipuram', priority: 0.7 },
  { name: 'Nagercoil', priority: 0.7 },
  { name: 'Kumbakonam', priority: 0.7 },
  { name: 'Karur', priority: 0.7 },
  { name: 'Hosur', priority: 0.7 },
  { name: 'Ooty', priority: 0.7 },
  { name: 'Pondicherry', priority: 0.7 },
  { name: 'Velachery', priority: 0.7 },
  { name: 'Anna-Nagar', priority: 0.7 },
  { name: 'Adyar', priority: 0.7 },
  { name: 'T-Nagar', priority: 0.7 },
  { name: 'OMR', priority: 0.7 },
  { name: 'Kollam', priority: 0.7 },
  { name: 'Kannur', priority: 0.7 },
  { name: 'Alappuzha', priority: 0.7 },
  { name: 'Palakkad', priority: 0.7 },
  { name: 'Kottayam', priority: 0.7 },
  { name: 'Malappuram', priority: 0.7 },
  { name: 'Kasaragod', priority: 0.7 },
  { name: 'Munnar', priority: 0.7 },
  { name: 'Solapur', priority: 0.7 },
  { name: 'Kolhapur', priority: 0.7 },
  { name: 'Amravati', priority: 0.7 },
  { name: 'Sangli', priority: 0.7 },
  { name: 'Jalgaon', priority: 0.7 },
  { name: 'Akola', priority: 0.7 },
  { name: 'Latur', priority: 0.7 },
  { name: 'Dhule', priority: 0.7 },
  { name: 'Ahmednagar', priority: 0.7 },
  { name: 'Chandrapur', priority: 0.7 },
  { name: 'Satara', priority: 0.7 },
  { name: 'Andheri', priority: 0.7 },
  { name: 'Bandra', priority: 0.7 },
  { name: 'Dadar', priority: 0.7 },
  { name: 'Borivali', priority: 0.7 },
  { name: 'Powai', priority: 0.7 },
  { name: 'Malad', priority: 0.7 },
  { name: 'Goregaon', priority: 0.7 },
  { name: 'Kandivali', priority: 0.7 },
  { name: 'Vashi', priority: 0.7 },
  { name: 'Kharghar', priority: 0.7 },
  { name: 'Kothrud', priority: 0.7 },
  { name: 'Hinjewadi', priority: 0.7 },
  { name: 'Wakad', priority: 0.7 },
  { name: 'Hadapsar', priority: 0.7 },
  { name: 'Bhavnagar', priority: 0.7 },
  { name: 'Jamnagar', priority: 0.7 },
  { name: 'Junagadh', priority: 0.7 },
  { name: 'Anand', priority: 0.7 },
  { name: 'Nadiad', priority: 0.7 },
  { name: 'Morbi', priority: 0.7 },
  { name: 'Mehsana', priority: 0.7 },
  { name: 'Bharuch', priority: 0.7 },
  { name: 'Vapi', priority: 0.7 },
  { name: 'Bhuj', priority: 0.7 },
  { name: 'Bikaner', priority: 0.7 },
  { name: 'Ajmer', priority: 0.7 },
  { name: 'Bhilwara', priority: 0.7 },
  { name: 'Alwar', priority: 0.7 },
  { name: 'Sikar', priority: 0.7 },
  { name: 'Bharatpur', priority: 0.7 },
  { name: 'Jaisalmer', priority: 0.7 },
  { name: 'Greater-Noida', priority: 0.7 },
  { name: 'Rohini', priority: 0.7 },
  { name: 'Saket', priority: 0.7 },
  { name: 'Dwarka-Delhi', priority: 0.7 },
  { name: 'Vasant-Kunj', priority: 0.7 },
  { name: 'Karol-Bagh', priority: 0.7 },
  { name: 'Pitampura', priority: 0.7 },
  { name: 'Lajpat-Nagar', priority: 0.7 },
  { name: 'Connaught-Place', priority: 0.7 },
  { name: 'Meerut', priority: 0.7 },
  { name: 'Bareilly', priority: 0.7 },
  { name: 'Aligarh', priority: 0.7 },
  { name: 'Moradabad', priority: 0.7 },
  { name: 'Gorakhpur', priority: 0.7 },
  { name: 'Saharanpur', priority: 0.7 },
  { name: 'Jhansi', priority: 0.7 },
  { name: 'Mathura', priority: 0.7 },
  { name: 'Ayodhya', priority: 0.7 },
  { name: 'Ujjain', priority: 0.7 },
  { name: 'Sagar', priority: 0.7 },
  { name: 'Dewas', priority: 0.7 },
  { name: 'Satna', priority: 0.7 },
  { name: 'Ratlam', priority: 0.7 },
  { name: 'Rewa', priority: 0.7 },
  { name: 'Howrah', priority: 0.7 },
  { name: 'Asansol', priority: 0.7 },
  { name: 'Siliguri', priority: 0.7 },
  { name: 'Durgapur', priority: 0.7 },
  { name: 'Kharagpur', priority: 0.7 },
  { name: 'Salt-Lake', priority: 0.7 },
  { name: 'Darjeeling', priority: 0.7 },
  { name: 'Gaya', priority: 0.7 },
  { name: 'Bhagalpur', priority: 0.7 },
  { name: 'Muzaffarpur', priority: 0.7 },
  { name: 'Darbhanga', priority: 0.7 },
  { name: 'Purnia', priority: 0.7 },
  { name: 'Dhanbad', priority: 0.7 },
  { name: 'Bokaro', priority: 0.7 },
  { name: 'Hazaribagh', priority: 0.7 },
  { name: 'Rourkela', priority: 0.7 },
  { name: 'Berhampur', priority: 0.7 },
  { name: 'Sambalpur', priority: 0.7 },
  { name: 'Puri', priority: 0.7 },
  { name: 'Bhilai', priority: 0.7 },
  { name: 'Bilaspur', priority: 0.7 },
  { name: 'Korba', priority: 0.7 },
  { name: 'Durg', priority: 0.7 },
  { name: 'Patiala', priority: 0.7 },
  { name: 'Bathinda', priority: 0.7 },
  { name: 'Mohali', priority: 0.7 },
  { name: 'Jalandhar', priority: 0.7 },
  { name: 'Pathankot', priority: 0.7 },
  { name: 'Ambala', priority: 0.7 },
  { name: 'Karnal', priority: 0.7 },
  { name: 'Panipat', priority: 0.7 },
  { name: 'Sonipat', priority: 0.7 },
  { name: 'Rohtak', priority: 0.7 },
  { name: 'Hisar', priority: 0.7 },
  { name: 'Panchkula', priority: 0.7 },
  { name: 'Kurukshetra', priority: 0.7 },
  { name: 'Rishikesh', priority: 0.7 },
  { name: 'Haldwani', priority: 0.7 },
  { name: 'Roorkee', priority: 0.7 },
  { name: 'Nainital', priority: 0.7 },
  { name: 'Mussoorie', priority: 0.7 },
  { name: 'Dharamshala', priority: 0.7 },
  { name: 'Manali', priority: 0.7 },
  { name: 'Kullu', priority: 0.7 },
  { name: 'Solan', priority: 0.7 },
  { name: 'Mandi', priority: 0.7 },
  { name: 'Leh', priority: 0.7 },
  { name: 'Gulmarg', priority: 0.7 },
  { name: 'Silchar', priority: 0.7 },
  { name: 'Dibrugarh', priority: 0.7 },
  { name: 'Jorhat', priority: 0.7 },
  { name: 'Tezpur', priority: 0.7 },
  { name: 'Imphal', priority: 0.7 },
  { name: 'Shillong', priority: 0.7 },
  { name: 'Aizawl', priority: 0.7 },
  { name: 'Agartala', priority: 0.7 },
  { name: 'Kohima', priority: 0.7 },
  { name: 'Dimapur', priority: 0.7 },
  { name: 'Gangtok', priority: 0.7 },
  { name: 'Itanagar', priority: 0.7 },
  { name: 'Panaji', priority: 0.7 },
  { name: 'Margao', priority: 0.7 },
  { name: 'Vasco', priority: 0.7 },
  { name: 'Calangute', priority: 0.7 },
];

const baseUrl = 'https://novacare247.com';
const today = new Date().toISOString().split('T')[0];

function generateSitemap() {
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  
  <!-- Main Pages -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/services</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/doctors</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/booking</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/about</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/contact</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/story</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  
  <!-- Location-Based Pages - All Indian Cities -->
`;

  // Add all city-based URLs
  indianCities.forEach(city => {
    const citySlug = city.name.toLowerCase().replace(/\s+/g, '-');
    sitemap += `  <url>
    <loc>${baseUrl}/physiotherapy/${citySlug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${city.priority}</priority>
  </url>
`;
  });

  // Add alternate names/spellings
  const alternates = [
    { slug: 'vizag', priority: 0.9 },
    { slug: 'bengaluru', priority: 0.9 },
    { slug: 'madras', priority: 0.8 },
    { slug: 'bombay', priority: 0.9 },
    { slug: 'calcutta', priority: 0.9 },
    { slug: 'trivandrum', priority: 0.8 },
    { slug: 'cochin', priority: 0.8 },
    { slug: 'calicut', priority: 0.8 },
    { slug: 'baroda', priority: 0.8 },
    { slug: 'poona', priority: 0.9 },
    { slug: 'gurugram', priority: 0.8 },
    { slug: 'banaras', priority: 0.8 },
    { slug: 'allahabad', priority: 0.8 },
    { slug: 'simla', priority: 0.8 },
  ];

  alternates.forEach(alt => {
    sitemap += `  <url>
    <loc>${baseUrl}/physiotherapy/${alt.slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${alt.priority}</priority>
  </url>
`;
  });

  sitemap += `</urlset>`;

  return sitemap;
}

// Generate and save
const sitemap = generateSitemap();
const outputPath = path.join(__dirname, '../public/sitemap.xml');

fs.writeFileSync(outputPath, sitemap, 'utf8');
console.log(`✅ Sitemap generated with ${indianCities.length + 14} city URLs`);
console.log(`📍 Saved to: ${outputPath}`);
