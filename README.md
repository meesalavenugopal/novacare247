# Novacare 24/7 Physiotherapy

A full-stack web application for Novacare 24/7 Physiotherapy Clinics with React frontend and Python FastAPI backend.

## Subdomain Structure

| Domain | Application |
|--------|-------------|
| [novacare247.com](https://novacare247.com) | Main Landing Page |
| [physio.novacare247.com](https://physio.novacare247.com) | Physiotherapy Clinics |
| [medicine.novacare247.com](https://medicine.novacare247.com) | General Medicine |
| [api.novacare247.com](https://api.novacare247.com) | Backend API |

## Features

### Public Features
- 🏠 Home page with clinic overview, services, and testimonials
- 👨‍⚕️ Doctors listing with specializations and experience
- 📋 Services catalog with descriptions and pricing
- 📅 Online appointment booking with date/time slot selection
- 🔍 Check existing bookings by phone number
- 📞 Contact form for inquiries
- ℹ️ About page with clinic information

### Admin Dashboard
- 📊 Dashboard with booking statistics
- 👨‍⚕️ Doctor management (CRUD operations)
- 📅 Booking management with status updates
- 📋 Service management
- ⭐ Testimonial moderation
- 💬 Contact inquiry management

## Tech Stack

### Backend
- Python 3.9+
- FastAPI
- SQLAlchemy ORM
- SQLite Database
- JWT Authentication
- Uvicorn ASGI Server

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Lucide React Icons
- date-fns

## Getting Started

### Prerequisites
- Python 3.9 or higher
- Node.js 18 or higher
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Seed the database with sample data:
   ```bash
   python -m app.seed
   ```

5. Run the backend server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173`

## Default Credentials

### Admin Account
- Email: admin@novacare247.com
- Password: admin123

### Doctor Account
- Email: dr.priya@novacare247.com
- Password: doctor123

## Project Structure

```
chinamayi_physiotherapy_clinics/
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   │   ├── auth.py
│   │   │   ├── doctors.py
│   │   │   ├── bookings.py
│   │   │   ├── services.py
│   │   │   ├── testimonials.py
│   │   │   ├── contact.py
│   │   │   └── admin.py
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── auth.py
│   │   ├── main.py
│   │   └── seed.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── Footer.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── AdminLayout.jsx
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── AdminDoctors.jsx
│   │   │   │   ├── AdminBookings.jsx
│   │   │   │   ├── AdminServices.jsx
│   │   │   │   ├── AdminTestimonials.jsx
│   │   │   │   └── AdminInquiries.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── DoctorsPage.jsx
│   │   │   ├── ServicesPage.jsx
│   │   │   ├── BookingPage.jsx
│   │   │   ├── ContactPage.jsx
│   │   │   ├── AboutPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   └── CheckBookingPage.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
└── README.md
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user

### Doctors
- GET `/api/doctors` - List active doctors
- GET `/api/doctors/{id}` - Get doctor details
- POST `/api/doctors` - Create doctor (admin)
- PUT `/api/doctors/{id}` - Update doctor (admin)
- DELETE `/api/doctors/{id}` - Delete doctor (admin)

### Bookings
- GET `/api/bookings/available-slots/{doctor_id}/{date}` - Get available slots
- POST `/api/bookings` - Create booking
- GET `/api/bookings` - List all bookings (admin)
- PUT `/api/bookings/{id}` - Update booking status (admin)

### Services
- GET `/api/services` - List active services
- POST `/api/services` - Create service (admin)
- PUT `/api/services/{id}` - Update service (admin)
- DELETE `/api/services/{id}` - Delete service (admin)

### Testimonials
- GET `/api/testimonials` - List approved testimonials
- POST `/api/testimonials` - Submit testimonial
- PUT `/api/testimonials/{id}` - Approve/update testimonial (admin)

### Contact
- POST `/api/contact` - Submit inquiry
- GET `/api/contact` - List inquiries (admin)
- PUT `/api/contact/{id}/read` - Mark as read (admin)



## License

MIT License
