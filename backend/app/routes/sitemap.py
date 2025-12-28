from fastapi import APIRouter, Depends
from fastapi.responses import Response
from sqlalchemy.orm import Session
from datetime import datetime

from app.database import get_db
from app.models import BlogArticle, Doctor, Service

router = APIRouter(tags=["Sitemap"])

BASE_URL = "https://novacare247.com"


def format_date(dt: datetime) -> str:
    """Format datetime to sitemap date format"""
    if dt:
        return dt.strftime("%Y-%m-%d")
    return datetime.now().strftime("%Y-%m-%d")


@router.get("/sitemap.xml")
def generate_sitemap(db: Session = Depends(get_db)):
    """Generate dynamic XML sitemap"""
    
    today = datetime.now().strftime("%Y-%m-%d")
    
    # Start XML
    xml_content = '''<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
'''
    
    # Static pages
    static_pages = [
        {"loc": "/", "changefreq": "daily", "priority": "1.0"},
        {"loc": "/services", "changefreq": "weekly", "priority": "0.9"},
        {"loc": "/doctors", "changefreq": "weekly", "priority": "0.9"},
        {"loc": "/booking", "changefreq": "weekly", "priority": "0.9"},
        {"loc": "/about", "changefreq": "monthly", "priority": "0.8"},
        {"loc": "/contact", "changefreq": "monthly", "priority": "0.8"},
        {"loc": "/story", "changefreq": "monthly", "priority": "0.7"},
        {"loc": "/check-booking", "changefreq": "monthly", "priority": "0.6"},
        {"loc": "/blog", "changefreq": "daily", "priority": "0.9"},
        {"loc": "/privacy-policy", "changefreq": "yearly", "priority": "0.3"},
        {"loc": "/terms-of-service", "changefreq": "yearly", "priority": "0.3"},
    ]
    
    xml_content += "\n  <!-- Main Pages -->\n"
    for page in static_pages:
        xml_content += f'''  <url>
    <loc>{BASE_URL}{page["loc"]}</loc>
    <lastmod>{today}</lastmod>
    <changefreq>{page["changefreq"]}</changefreq>
    <priority>{page["priority"]}</priority>
  </url>
'''
    
    # Dynamic Blog Articles
    blog_articles = db.query(BlogArticle).filter(
        BlogArticle.is_published == True
    ).order_by(BlogArticle.published_at.desc()).all()
    
    if blog_articles:
        xml_content += "\n  <!-- Blog Articles -->\n"
        for article in blog_articles:
            lastmod = format_date(article.updated_at or article.published_at or article.created_at)
            xml_content += f'''  <url>
    <loc>{BASE_URL}/blog/{article.slug}</loc>
    <lastmod>{lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
'''
    
    # Dynamic Services
    services = db.query(Service).filter(Service.is_active == True).all()
    
    if services:
        xml_content += "\n  <!-- Services -->\n"
        for service in services:
            lastmod = format_date(service.updated_at if hasattr(service, 'updated_at') else None)
            xml_content += f'''  <url>
    <loc>{BASE_URL}/services/{service.slug}</loc>
    <lastmod>{lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
'''
    
    # Dynamic Doctors
    doctors = db.query(Doctor).filter(Doctor.is_active == True).all()
    
    if doctors:
        xml_content += "\n  <!-- Doctors -->\n"
        for doctor in doctors:
            lastmod = format_date(doctor.updated_at if hasattr(doctor, 'updated_at') else None)
            xml_content += f'''  <url>
    <loc>{BASE_URL}/doctors/{doctor.slug}</loc>
    <lastmod>{lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
'''
    
    # Close XML
    xml_content += "</urlset>"
    
    return Response(
        content=xml_content,
        media_type="application/xml",
        headers={
            "Cache-Control": "public, max-age=3600",  # Cache for 1 hour
        }
    )


@router.get("/robots.txt")
def robots_txt():
    """Generate robots.txt"""
    content = f"""User-agent: *
Allow: /

# Disallow admin pages
Disallow: /admin/
Disallow: /login
Disallow: /register

# Sitemap
Sitemap: {BASE_URL}/sitemap.xml
"""
    return Response(content=content, media_type="text/plain")
