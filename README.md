# 3D Car Configurator

![Main View](./src/assets/readme.png)

## Quick Start

```bash
npm install
npm run dev
```

## Deployment

### Vercel
```bash
npm i -g vercel
vercel login
vercel link
git push origin main
```

### Render
1. Create Web Service at render.com
2. Connect GitHub repository
3. Add deploy hook to GitHub secrets
4. Push to main

### GitHub Secrets Required
```
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
RENDER_DEPLOY_HOOK_URL
```

## Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run server       # Start backend
npm run lint         # Run linter
npm test             # Run tests
```

## Tech Stack

- Three.js
- Express
- MongoDB
- Webpack
- GSAP

## Environment Variables

```env
NODE_ENV=production
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret
EMAIL_USER=your_email
EMAIL_PASS=your_password
```

## License

ISC
