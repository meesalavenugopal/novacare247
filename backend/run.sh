#!/bin/bash

# Navigate to the backend directory
cd "$(dirname "$0")"

# Activate virtual environment if it exists
if [ -d "venv" ]; then
    source venv/bin/activate
fi

# Set PYTHONPATH to include the backend directory
export PYTHONPATH="$(pwd):$PYTHONPATH"

# Run the FastAPI application with uvicorn
uvicorn app.main:app --reload --port 8000
