"""
Migration script to add home_available and video_available columns to services table.
Run this script to update the database schema.
"""
import os
import sys

# Add the backend directory to the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import text
from app.database import engine

def add_consultation_type_columns():
    """Add home_available and video_available columns to services table"""
    
    with engine.connect() as conn:
        # Check if columns exist
        result = conn.execute(text("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'services' AND column_name IN ('home_available', 'video_available')
        """))
        existing_columns = [row[0] for row in result.fetchall()]
        
        # Add home_available column if it doesn't exist
        if 'home_available' not in existing_columns:
            conn.execute(text("""
                ALTER TABLE services 
                ADD COLUMN home_available BOOLEAN DEFAULT TRUE
            """))
            print("✓ Added 'home_available' column to services table")
        else:
            print("→ 'home_available' column already exists")
        
        # Add video_available column if it doesn't exist
        if 'video_available' not in existing_columns:
            conn.execute(text("""
                ALTER TABLE services 
                ADD COLUMN video_available BOOLEAN DEFAULT FALSE
            """))
            print("✓ Added 'video_available' column to services table")
        else:
            print("→ 'video_available' column already exists")
        
        conn.commit()
        print("\n✓ Migration completed successfully!")
        
        # Show current services with their consultation availability
        result = conn.execute(text("""
            SELECT id, name, home_available, video_available 
            FROM services 
            ORDER BY id
        """))
        services = result.fetchall()
        
        if services:
            print("\nCurrent services consultation availability:")
            print("-" * 60)
            for service in services:
                home = "✓" if service[2] else "✗"
                video = "✓" if service[3] else "✗"
                print(f"  {service[0]}. {service[1]}")
                print(f"     Home: {home} | Video: {video}")

if __name__ == "__main__":
    print("=" * 60)
    print("Adding consultation type availability to services table")
    print("=" * 60)
    add_consultation_type_columns()
