# Deploying The Living Book to wonderjournal.org

This guide walks through deploying The Living Book to production using Railway (backend) and Vercel (frontend).

## Prerequisites

- GitHub account
- Railway account (https://railway.app)
- Vercel account (https://vercel.com)
- Access to wonderjournal.org domain DNS settings

## Step 1: Push Code to GitHub

1. Initialize git repository (if not already done):
```bash
cd /Users/guy/living-book
git init
git add .
git commit -m "Initial commit: The Living Book"
```

2. Create a new repository on GitHub (https://github.com/new)
   - Name it something like "wonder-journal" or "living-book"
   - Don't initialize with README (we already have one)

3. Push to GitHub:
```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy Backend to Railway

1. Go to https://railway.app and sign in
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Configure the service:
   - **Root Directory**: `backend`
   - Railway will auto-detect Node.js and use `npm start`

6. Add environment variables in Railway dashboard:
   - Go to your service → Variables tab
   - Add: `FRONTEND_URL` = `https://wonderjournal.org`
   - (PORT is automatically set by Railway)

7. Deploy and note your Railway URL:
   - It will be something like: `https://your-app.up.railway.app`
   - This is your backend API URL

## Step 3: Deploy Frontend to Vercel

1. Go to https://vercel.com and sign in
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave as root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. Add environment variable:
   - Click "Environment Variables"
   - Add: `VITE_API_URL` = `https://your-app.up.railway.app` (your Railway URL from Step 2)

6. Click "Deploy"

7. Once deployed, note your Vercel URL (something like `your-app.vercel.app`)

## Step 4: Configure Custom Domain

### On Vercel (for wonderjournal.org):

1. Go to your Vercel project → Settings → Domains
2. Add domain: `wonderjournal.org`
3. Also add: `www.wonderjournal.org`
4. Vercel will show you DNS records to add

### In your domain registrar's DNS settings:

Add these records for wonderjournal.org:

**For root domain:**
- Type: `A`
- Name: `@`
- Value: `76.76.21.21` (Vercel's IP)

**For www subdomain:**
- Type: `CNAME`
- Name: `www`
- Value: `cname.vercel-dns.com`

**Note**: DNS changes can take up to 48 hours to propagate, but usually take 5-30 minutes.

## Step 5: Update Backend CORS

After your domain is working:

1. Go back to Railway dashboard
2. Update the `FRONTEND_URL` environment variable:
   - Change from temporary Vercel URL to: `https://wonderjournal.org`
3. Redeploy the backend

## Verification

1. Visit https://wonderjournal.org
2. Ask a question
3. Verify the answer appears with the ink animation
4. Check browser console for any errors

## Troubleshooting

**CORS errors:**
- Make sure Railway's `FRONTEND_URL` matches your domain exactly
- Check that the backend is deployed and running

**"Failed to fetch" errors:**
- Verify the `VITE_API_URL` in Vercel points to your Railway backend
- Check that Railway service is running (green status)
- Test the backend directly: `https://your-railway-url.up.railway.app/health`

**Domain not resolving:**
- DNS can take time to propagate
- Verify DNS records are correct in your registrar
- Use https://dnschecker.org to check propagation

## Future Updates

To deploy updates:

1. Make your changes locally
2. Commit and push to GitHub:
```bash
git add .
git commit -m "Your update message"
git push
```

3. Both Vercel and Railway will automatically redeploy from the main branch

## Local Development

To run locally after deployment:

```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
npm run dev
```

The local frontend will use `http://localhost:3000` for the API (fallback in code).
