#!/bin/bash
cd /Users/venugopalmeesala/Developer/Projects/Personal/chinamayi_physiotherapy_clinics/backend
export PYTHONPATH="/Users/venugopalmeesala/Developer/Projects/Personal/chinamayi_physiotherapy_clinics/backend:$PYTHONPATH"
./venv/bin/uvicorn app.main:app --reload --port 8000
