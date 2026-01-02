# NovaCare247 Landing Page

Healthcare landing page with email contact functionality.

## Deployment

This project is configured for Vercel deployment with serverless functions.

### Environment Variables

Set these in Vercel dashboard:
- `SMTP_HOST=smtp.hostinger.com`
- `SMTP_PORT=465`
- `SMTP_USER=care@novacare247.com`
- `SMTP_PASS=your-password`
- `ADMIN_EMAIL=care@novacare247.com`

### Deploy to Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

## Local Development

```bash
npm install
npm run dev
```

For contact form testing locally:
```bash
npm run server
```
