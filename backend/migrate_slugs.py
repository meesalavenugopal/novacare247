"""
Migration script to add slugs to existing Doctor and Service records.
Run this after adding the slug columns to the models.
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import text
from app.database import SessionLocal, engine
from app.models import Doctor, Service, User
from app.utils.slugs import generate_doctor_slug, generate_service_slug


def add_slug_columns():
    """Add slug columns if they don't exist"""
    with engine.connect() as conn:
        # Check and add slug column to doctors
        try:
            conn.execute(text("ALTER TABLE doctors ADD COLUMN slug VARCHAR(255) UNIQUE"))
            conn.commit()
            print("✅ Added slug column to doctors table")
        except Exception as e:
            if "duplicate column" in str(e).lower() or "already exists" in str(e).lower():
                print("ℹ️  Slug column already exists in doctors table")
            else:
                print(f"⚠️  doctors table: {e}")
        
        # Check and add slug column to services
        try:
            conn.execute(text("ALTER TABLE services ADD COLUMN slug VARCHAR(255) UNIQUE"))
            conn.commit()
            print("✅ Added slug column to services table")
        except Exception as e:
            if "duplicate column" in str(e).lower() or "already exists" in str(e).lower():
                print("ℹ️  Slug column already exists in services table")
            else:
                print(f"⚠️  services table: {e}")


def migrate_doctor_slugs():
    """Generate slugs for all doctors without slugs"""
    db = SessionLocal()
    try:
        doctors = db.query(Doctor).filter(
            (Doctor.slug == None) | (Doctor.slug == "")
        ).all()
        
        print(f"\n📝 Migrating {len(doctors)} doctors...")
        
        migrated = 0
        for doctor in doctors:
            # Get doctor's name from user relationship
            if doctor.user and doctor.user.full_name:
                doctor_name = doctor.user.full_name
            else:
                doctor_name = f"doctor-{doctor.id}"
            
            slug = generate_doctor_slug(db, doctor_name, doctor.id)
            doctor.slug = slug
            
            # Commit each one individually to ensure unique constraint works
            db.commit()
            db.refresh(doctor)
            migrated += 1
            print(f"  - Doctor {doctor.id}: {doctor_name} → {slug}")
        
        print(f"✅ Migrated {migrated} doctor slugs")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error migrating doctors: {e}")
        raise
    finally:
        db.close()


def migrate_service_slugs():
    """Generate slugs for all services without slugs"""
    db = SessionLocal()
    try:
        services = db.query(Service).filter(
            (Service.slug == None) | (Service.slug == "")
        ).all()
        
        print(f"\n📝 Migrating {len(services)} services...")
        
        migrated = 0
        for service in services:
            slug = generate_service_slug(db, service.name, service.id)
            service.slug = slug
            
            # Commit each one individually to ensure unique constraint works
            db.commit()
            db.refresh(service)
            migrated += 1
            print(f"  - Service {service.id}: {service.name} → {slug}")
        
        print(f"✅ Migrated {migrated} service slugs")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error migrating services: {e}")
        raise
    finally:
        db.close()


def create_indexes():
    """Create indexes on slug columns for faster lookups"""
    with engine.connect() as conn:
        try:
            conn.execute(text("CREATE INDEX IF NOT EXISTS ix_doctors_slug ON doctors(slug)"))
            conn.execute(text("CREATE INDEX IF NOT EXISTS ix_services_slug ON services(slug)"))
            conn.commit()
            print("\n✅ Created indexes on slug columns")
        except Exception as e:
            print(f"⚠️  Index creation: {e}")


if __name__ == "__main__":
    print("=" * 50)
    print("🔄 Slug Migration Script")
    print("=" * 50)
    
    # Step 1: Add columns
    print("\n📦 Step 1: Adding slug columns...")
    add_slug_columns()
    
    # Step 2: Migrate doctors
    print("\n👨‍⚕️ Step 2: Migrating doctor slugs...")
    migrate_doctor_slugs()
    
    # Step 3: Migrate services
    print("\n🏥 Step 3: Migrating service slugs...")
    migrate_service_slugs()
    
    # Step 4: Create indexes
    print("\n📇 Step 4: Creating indexes...")
    create_indexes()
    
    print("\n" + "=" * 50)
    print("✅ Migration complete!")
    print("=" * 50)
