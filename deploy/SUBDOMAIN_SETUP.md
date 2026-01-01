# NovaCare247 Subdomain Setup Guide

## Domain Structure

| Domain | Purpose | Application |
|--------|---------|-------------|
| novacare247.com | Main Landing | novacare247-home |
| physio.novacare247.com | Physiotherapy | frontend |
| medicine.novacare247.com | General Medicine | Coming Soon |
| api.novacare247.com | Backend API | backend |

## Step 1: DNS Configuration

Add these DNS records in your domain registrar (e.g., Cloudflare, GoDaddy, Namecheap):

```
Type    Name        Value               TTL
A       @           YOUR_SERVER_IP      3600
A       www         YOUR_SERVER_IP      3600
A       physio      YOUR_SERVER_IP      3600
A       medicine    YOUR_SERVER_IP      3600
A       api         YOUR_SERVER_IP      3600
```

## Step 2: Server Setup

### Install Nginx
```bash
sudo apt update
sudo apt install nginx
```

### Install Certbot for SSL
```bash
sudo apt install certbot python3-certbot-nginx
```

### Generate SSL Certificates
```bash
sudo certbot --nginx -d novacare247.com -d www.novacare247.com
sudo certbot --nginx -d physio.novacare247.com
sudo certbot --nginx -d medicine.novacare247.com
sudo certbot --nginx -d api.novacare247.com
```

## Step 3: Deploy Applications

### Build Applications
```bash
# Build Home Landing
cd novacare247-home
npm run build

# Build Physiotherapy Frontend
cd ../frontend
npm run build
```

### Copy to Server
```bash
# On server, create directories
sudo mkdir -p /var/www/novacare247-home
sudo mkdir -p /var/www/novacare247-frontend

# Copy built files (from local machine)
scp -r novacare247-home/dist/* user@server:/var/www/novacare247-home/
scp -r frontend/dist/* user@server:/var/www/novacare247-frontend/
```

## Step 4: Configure Nginx

```bash
# Copy nginx config to server
sudo cp deploy/nginx.conf /etc/nginx/sites-available/novacare247.conf

# Enable the site
sudo ln -s /etc/nginx/sites-available/novacare247.conf /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

## Step 5: Backend Setup

```bash
# Install Python and dependencies
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Run with Gunicorn (production)
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker -b 127.0.0.1:8000
```

### Using Supervisor for Process Management
```bash
sudo apt install supervisor

# Create supervisor config
sudo nano /etc/supervisor/conf.d/novacare247-api.conf
```

Add:
```ini
[program:novacare247-api]
command=/var/www/novacare247-backend/venv/bin/gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker -b 127.0.0.1:8000
directory=/var/www/novacare247-backend
user=www-data
autostart=true
autorestart=true
stderr_logfile=/var/log/novacare247-api.err.log
stdout_logfile=/var/log/novacare247-api.out.log
```

## Local Development

For local testing with subdomains, add to `/etc/hosts`:
```
127.0.0.1   novacare247.local
127.0.0.1   physio.novacare247.local
127.0.0.1   medicine.novacare247.local
127.0.0.1   api.novacare247.local
```

## Environment Variables

Create `.env.production` files for each app:

### Frontend (.env.production)
```
VITE_API_URL=https://api.novacare247.com
```

### Backend (.env)
```
DATABASE_URL=postgresql://user:pass@localhost/novacare247
SECRET_KEY=your-secret-key
CORS_ORIGINS=https://novacare247.com,https://physio.novacare247.com
```
