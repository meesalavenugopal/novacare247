"""
Add cancellation_reason column to bookings table
Run: python add_cancellation_reason.py
"""

import sys
sys.path.insert(0, '.')

from sqlalchemy import text
from app.database import engine

def add_column():
    with engine.connect() as conn:
        # Check if column already exists
        result = conn.execute(text("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'bookings' AND column_name = 'cancellation_reason'
        """))
        
        if result.fetchone():
            print("Column 'cancellation_reason' already exists in bookings table")
            return
        
        # Add the column
        conn.execute(text("""
            ALTER TABLE bookings 
            ADD COLUMN cancellation_reason VARCHAR(500)
        """))
        conn.commit()
        print("Successfully added 'cancellation_reason' column to bookings table")

if __name__ == "__main__":
    add_column()
