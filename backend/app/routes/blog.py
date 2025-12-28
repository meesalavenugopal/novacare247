from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc, or_
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
import json
import re

from app.database import get_db
from app.models import BlogArticle
from app.auth import get_admin_user

router = APIRouter(prefix="/api/blog", tags=["Blog"])


# Pydantic Schemas
class FAQItem(BaseModel):
    question: str
    answer: str


class BlogArticleBase(BaseModel):
    title: str
    slug: Optional[str] = None
    excerpt: Optional[str] = None
    content: str
    category: str = "conditions"
    author: Optional[str] = None
    author_role: Optional[str] = None
    read_time: Optional[str] = None
    image: Optional[str] = None
    tags: Optional[List[str]] = []
    faqs: Optional[List[FAQItem]] = []
    is_featured: bool = False
    is_published: bool = True
    display_order: int = 0


class BlogArticleCreate(BlogArticleBase):
    pass


class BlogArticleUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    excerpt: Optional[str] = None
    content: Optional[str] = None
    category: Optional[str] = None
    author: Optional[str] = None
    author_role: Optional[str] = None
    read_time: Optional[str] = None
    image: Optional[str] = None
    tags: Optional[List[str]] = None
    faqs: Optional[List[FAQItem]] = None
    is_featured: Optional[bool] = None
    is_published: Optional[bool] = None
    display_order: Optional[int] = None


class BlogArticleResponse(BaseModel):
    id: int
    title: str
    slug: str
    excerpt: Optional[str]
    content: str
    category: str
    author: Optional[str]
    author_role: Optional[str]
    read_time: Optional[str]
    image: Optional[str]
    tags: List[str]
    faqs: List[FAQItem]
    is_featured: bool
    is_published: bool
    published_at: Optional[datetime]
    display_order: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


def generate_slug(title: str) -> str:
    """Generate URL-friendly slug from title"""
    slug = title.lower()
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    slug = re.sub(r'[\s_]+', '-', slug)
    slug = re.sub(r'-+', '-', slug)
    return slug.strip('-')


def serialize_article(article: BlogArticle) -> dict:
    """Convert article to response format"""
    tags = []
    if article.tags:
        try:
            tags = json.loads(article.tags)
        except:
            tags = []
    
    faqs = []
    if article.faqs:
        try:
            faqs = json.loads(article.faqs)
        except:
            faqs = []
    
    return {
        "id": article.id,
        "title": article.title,
        "slug": article.slug,
        "excerpt": article.excerpt,
        "content": article.content,
        "category": article.category,
        "author": article.author,
        "author_role": article.author_role,
        "read_time": article.read_time,
        "image": article.image,
        "tags": tags,
        "faqs": faqs,
        "is_featured": article.is_featured,
        "is_published": article.is_published,
        "published_at": article.published_at,
        "display_order": article.display_order,
        "created_at": article.created_at,
        "updated_at": article.updated_at
    }


# Public Routes
@router.get("/")
def get_articles(
    category: Optional[str] = None,
    featured: Optional[bool] = None,
    search: Optional[str] = None,
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    """Get all published blog articles with optional filtering"""
    query = db.query(BlogArticle).filter(BlogArticle.is_published == True)
    
    if category:
        query = query.filter(BlogArticle.category == category)
    
    if featured is not None:
        query = query.filter(BlogArticle.is_featured == featured)
    
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            or_(
                BlogArticle.title.ilike(search_term),
                BlogArticle.excerpt.ilike(search_term),
                BlogArticle.tags.ilike(search_term)
            )
        )
    
    articles = query.order_by(
        desc(BlogArticle.is_featured),
        desc(BlogArticle.published_at),
        BlogArticle.id
    ).offset(offset).limit(limit).all()
    
    return [serialize_article(a) for a in articles]


@router.get("/categories/")
def get_categories():
    """Get all blog categories"""
    return [
        {"id": "conditions", "name": "Health Conditions", "icon": "Heart", "color": "rose"},
        {"id": "exercises", "name": "Exercises & Stretches", "icon": "Dumbbell", "color": "emerald"},
        {"id": "recovery", "name": "Recovery & Rehabilitation", "icon": "TrendingUp", "color": "blue"},
        {"id": "prevention", "name": "Injury Prevention", "icon": "Shield", "color": "amber"},
        {"id": "lifestyle", "name": "Healthy Lifestyle", "icon": "Sparkles", "color": "purple"},
        {"id": "sports", "name": "Sports Physiotherapy", "icon": "Trophy", "color": "sky"},
    ]


@router.get("/slug/{slug}/")
def get_article_by_slug(slug: str, db: Session = Depends(get_db)):
    """Get a single article by slug"""
    article = db.query(BlogArticle).filter(
        BlogArticle.slug == slug,
        BlogArticle.is_published == True
    ).first()
    
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    return serialize_article(article)


@router.get("/slug/{slug}/related/")
def get_related_articles(slug: str, limit: int = 3, db: Session = Depends(get_db)):
    """Get related articles based on category"""
    current = db.query(BlogArticle).filter(BlogArticle.slug == slug).first()
    
    if not current:
        return []
    
    related = db.query(BlogArticle).filter(
        BlogArticle.category == current.category,
        BlogArticle.slug != slug,
        BlogArticle.is_published == True
    ).order_by(desc(BlogArticle.published_at)).limit(limit).all()
    
    return [serialize_article(a) for a in related]


@router.get("/{article_id}/")
def get_article(article_id: int, db: Session = Depends(get_db)):
    """Get a single article by ID"""
    article = db.query(BlogArticle).filter(BlogArticle.id == article_id).first()
    
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    return serialize_article(article)


# Admin Routes
@router.get("/admin/all/")
def get_all_articles_admin(
    db: Session = Depends(get_db),
    current_user = Depends(get_admin_user)
):
    """Get all articles including unpublished (admin only)"""
    articles = db.query(BlogArticle).order_by(
        desc(BlogArticle.is_featured),
        BlogArticle.display_order,
        desc(BlogArticle.created_at),
        BlogArticle.id
    ).all()
    
    return [serialize_article(a) for a in articles]


@router.post("/")
def create_article(
    article: BlogArticleCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_admin_user)
):
    """Create a new blog article (admin only)"""
    # Generate slug if not provided
    slug = article.slug or generate_slug(article.title)
    
    # Check for duplicate slug
    existing = db.query(BlogArticle).filter(BlogArticle.slug == slug).first()
    if existing:
        slug = f"{slug}-{datetime.now().strftime('%Y%m%d%H%M%S')}"
    
    db_article = BlogArticle(
        title=article.title,
        slug=slug,
        excerpt=article.excerpt,
        content=article.content,
        category=article.category,
        author=article.author,
        author_role=article.author_role,
        read_time=article.read_time,
        image=article.image,
        tags=json.dumps(article.tags) if article.tags else "[]",
        faqs=json.dumps([f.dict() for f in article.faqs]) if article.faqs else "[]",
        is_featured=article.is_featured,
        is_published=article.is_published,
        display_order=article.display_order,
        published_at=datetime.utcnow() if article.is_published else None
    )
    
    db.add(db_article)
    db.commit()
    db.refresh(db_article)
    
    return serialize_article(db_article)


@router.put("/{article_id}/")
def update_article(
    article_id: int,
    article: BlogArticleUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_admin_user)
):
    """Update a blog article (admin only)"""
    db_article = db.query(BlogArticle).filter(BlogArticle.id == article_id).first()
    
    if not db_article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    update_data = article.dict(exclude_unset=True)
    
    # Handle tags and faqs JSON serialization
    if 'tags' in update_data and update_data['tags'] is not None:
        update_data['tags'] = json.dumps(update_data['tags'])
    
    if 'faqs' in update_data and update_data['faqs'] is not None:
        update_data['faqs'] = json.dumps([f.dict() if hasattr(f, 'dict') else f for f in update_data['faqs']])
    
    # Update published_at if being published for the first time
    if update_data.get('is_published') and not db_article.is_published:
        update_data['published_at'] = datetime.utcnow()
    
    for key, value in update_data.items():
        setattr(db_article, key, value)
    
    db.commit()
    db.refresh(db_article)
    
    return serialize_article(db_article)


@router.delete("/{article_id}/")
def delete_article(
    article_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_admin_user)
):
    """Delete a blog article (admin only)"""
    db_article = db.query(BlogArticle).filter(BlogArticle.id == article_id).first()
    
    if not db_article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    db.delete(db_article)
    db.commit()
    
    return {"message": "Article deleted successfully"}
