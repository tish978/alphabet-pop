# Deployment Guide - Railway

## Prerequisites

1. **Railway Account:** Sign up at [railway.app](https://railway.app)
2. **Git Repository:** Push your code to GitHub, GitLab, or Bitbucket
3. **Node.js:** Railway will auto-detect Node.js projects

## Local Testing

Before deploying, test locally:

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Or use the start script
npm start
```

The app will be available at: http://localhost:3000

## Deploying to Railway

### Option 1: Deploy via Railway Dashboard (Recommended)

1. **Create a New Project:**
   - Go to [railway.app](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo" (or GitLab/Bitbucket)
   - Choose your repository

2. **Railway Auto-Detection:**
   - Railway will detect the `package.json` and `server.js`
   - It will automatically:
     - Install dependencies (`npm install`)
     - Start the server (`npm start`)

3. **Configure Environment (if needed):**
   - Go to project settings
   - Set `PORT` (Railway auto-assigns, but you can override)
   - The app uses `process.env.PORT || 3000`

4. **Deploy:**
   - Railway will deploy automatically on every push to your main branch
   - Or click "Deploy" in the dashboard

5. **Get Your URL:**
   - Railway provides a `.railway.app` domain
   - You can also add a custom domain in settings

### Option 2: Deploy via Railway CLI

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up
```

## Configuration Files

The project includes these Railway-specific files:

- **`railway.json`**: Railway deployment configuration
- **`nixpacks.toml`**: Build configuration (alternative to railway.json)
- **`package.json`**: NPM scripts and dependencies
- **`server.js`**: Express server for Railway

## Environment Variables

Currently, no environment variables are required. The server uses:
- `PORT`: Automatically set by Railway (defaults to 3000)

To add environment variables:
1. Go to Railway project settings
2. Add variables in the "Variables" tab
3. They'll be available as `process.env.VARIABLE_NAME`

## Build Process

Railway will:
1. Install dependencies: `npm install`
2. Run build (if needed): `npm run build`
3. Start server: `npm start`

Since this is a static PWA, no build step is required - files are served as-is.

## Service Worker & PWA

The service worker and PWA manifest work correctly on Railway:
- Service Worker is served from root (`/service-worker.js`)
- Manifest is cached properly
- All static assets are served with correct headers

## HTTPS & Security

Railway provides HTTPS automatically:
- Your `.railway.app` domain uses HTTPS
- Required for PWA features (Service Worker, Web Speech API)
- No additional configuration needed

## Custom Domain

To add a custom domain:
1. Go to Railway project settings
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Update DNS records as instructed

## Troubleshooting

### Build Fails
- Check Railway logs for errors
- Ensure `package.json` is correct
- Verify Node.js version (requires >= 18.0.0)

### Service Worker Not Working
- Ensure using HTTPS (Railway provides this)
- Check browser console for errors
- Verify service worker is registered

### App Not Loading
- Check Railway logs: `railway logs`
- Verify PORT is set correctly
- Ensure all static files are in the repo

### PWA Not Installable
- Icons must be present (`icon-192.png`, `icon-512.png`)
- App must be served over HTTPS (Railway does this)
- Check manifest.json is valid

## Monitoring

Railway provides:
- **Logs:** View real-time logs in dashboard
- **Metrics:** CPU, memory, network usage
- **Deployments:** History of all deployments

## Continuous Deployment

Railway automatically deploys when you:
- Push to the connected branch (usually `main` or `master`)
- Manually trigger deployment in dashboard

## Rollback

To rollback to a previous deployment:
1. Go to Railway dashboard
2. Click on "Deployments"
3. Select the deployment to rollback to
4. Click "Redeploy"

## Cost

Railway offers:
- Free tier with generous limits
- Pay-as-you-go pricing
- $5 free credit monthly

Check [railway.app/pricing](https://railway.app/pricing) for current pricing.

