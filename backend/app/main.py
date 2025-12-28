from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routes import auth, doctors, bookings, services, testimonials, contact, admin
from app.routes import site_settings, site_stats, branches, milestones, ai, blog, sitemap
from app.config import settings
from app.seed import seed_database

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    description="API for Novacare 24/7 Physiotherapy Clinics - Booking and Management System",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(doctors.router)
app.include_router(bookings.router)
app.include_router(services.router)
app.include_router(testimonials.router)
app.include_router(contact.router)
app.include_router(admin.router)
app.include_router(site_settings.router)
app.include_router(site_stats.router)
app.include_router(branches.router)
app.include_router(milestones.router)
app.include_router(ai.router)
app.include_router(blog.router)
app.include_router(sitemap.router)

@app.get("/")
def root():
    return {
        "message": "Welcome to Novacare 24/7 Physiotherapy Clinics API",
        "docs": "/docs",
        "version": "1.0.0"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.on_event("startup")
async def startup_event():
    # Seed database with initial data
    from app.database import SessionLocal
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
