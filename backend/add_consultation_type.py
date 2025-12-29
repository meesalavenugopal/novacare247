"""
Migration script to add consultation_type column to bookings table.
Run this script to update the database schema.
"""

import psycopg2
from app.config import settings

def run_migration():
    """Add consultation_type column to bookings table if it doesn't exist."""
    
    # Parse DATABASE_URL
    db_url = settings.DATABASE_URL
    
    try:
        conn = psycopg2.connect(db_url)
        cursor = conn.cursor()
        
        # Check if column exists
        cursor.execute("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'bookings' AND column_name = 'consultation_type';
        """)
        
        if cursor.fetchone() is None:
            # Add the column
            cursor.execute("""
                ALTER TABLE bookings 
                ADD COLUMN consultation_type VARCHAR(20) DEFAULT 'clinic';
            """)
            conn.commit()
            print("✅ Successfully added 'consultation_type' column to bookings table")
        else:
            print("ℹ️ Column 'consultation_type' already exists in bookings table")
        
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"❌ Error running migration: {e}")
        raise e

if __name__ == "__main__":
    run_migration()
