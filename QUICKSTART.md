# Quick Start Guide

## 🚀 Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   npm run dev
   ```
   Or:
   ```bash
   npm start
   ```

3. **Open in browser:**
   - Go to: http://localhost:3000
   - Voice features work on localhost!

## 📦 Build (if needed)

Since this is a static PWA, no build step is required:
```bash
npm run build
```

All files are ready to deploy as-is.

## 🚂 Deploy to Railway

### Method 1: GitHub Integration (Easiest)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy on Railway:**
   - Go to [railway.app](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Railway auto-detects and deploys!

### Method 2: Railway CLI

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize (creates railway.json)
railway init

# Deploy
railway up
```

## ✅ What Railway Does Automatically

1. Detects Node.js project (finds `package.json`)
2. Runs `npm install`
3. Runs `npm start` (starts `server.js`)
4. Provides HTTPS domain (required for PWA)
5. Auto-deploys on git push

## 📝 Files Created for Railway

- `package.json` - NPM configuration
- `server.js` - Express server for Railway
- `railway.json` - Railway deployment config
- `nixpacks.toml` - Alternative build config
- `.gitignore` - Git ignore rules

## 🌐 After Deployment

Your app will be live at:
- `your-project-name.railway.app`

You can also:
- Add a custom domain in Railway settings
- Set environment variables if needed
- View logs in Railway dashboard

## 🔧 Troubleshooting

**Server won't start locally?**
- Check if port 3000 is available
- Ensure dependencies are installed: `npm install`

**Railway deployment fails?**
- Check Railway logs in dashboard
- Ensure `package.json` has `"start"` script
- Verify Node.js version (requires 18+)

**PWA not working?**
- Railway provides HTTPS automatically ✅
- Service worker works on HTTPS ✅
- Voice API works on HTTPS ✅

## 📚 More Info

- Full testing guide: [TESTING.md](TESTING.md)
- Detailed deployment: [DEPLOYMENT.md](DEPLOYMENT.md)
- Main README: [README.md](README.md)

