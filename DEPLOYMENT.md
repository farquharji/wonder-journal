# Deploying The Living Book to wonderjournal.org

This guide walks through deploying The Living Book to production using Vercel (frontend + backend).

## Architecture

The entire app is hosted on Vercel:
- **Frontend**: React app built with Vite
- **Backend**: Serverless function at `/api/ask`

This is simpler than splitting frontend/backend across different services.

## Prerequisites

- GitHub account (already done ✓)
- Vercel account (https://vercel.com)
- Access to wonderjournal.org domain DNS settings

## Deployment Steps

### Step 1: Push to GitHub ✓

Already completed! Your code is at: https://github.com/farquharji/wonder-journal

### Step 2: Deploy to Vercel

1. Go to https://vercel.com and sign in with GitHub
2. Click **"Add New..."** → **"Project"**
3. Find and import **`farquharji/wonder-journal`**
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave as root)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)
5. Click **"Deploy"**

Vercel will:
- Build your React frontend
- Deploy the `/api/ask` serverless function
- Give you a URL like `wonder-journal-xyz.vercel.app`

### Step 3: Configure Custom Domain

1. In Vercel, go to your project → **Settings** → **Domains**
2. Add domain: `wonderjournal.org`
3. Also add: `www.wonderjournal.org` (optional)
4. Vercel will show you the DNS records you need

### Step 4: Update DNS

In your domain registrar where you bought wonderjournal.org:

**For root domain (wonderjournal.org):**
- Type: `A`
- Name: `@`
- Value: `76.76.21.21`

**For www subdomain (optional):**
- Type: `CNAME`
- Name: `www`
- Value: `cname.vercel-dns.com`

**Note**: DNS changes can take 5-30 minutes (sometimes up to 48 hours).

### Step 5: Test

1. Wait for DNS to propagate
2. Visit https://wonderjournal.org
3. Ask a question
4. Watch the ink emerge

## Verification

Check that everything works:
- Frontend loads at wonderjournal.org
- Question submission works
- Ink animation appears
- No console errors

You can test the API directly:
```bash
curl -X POST https://wonderjournal.org/api/ask \
  -H "Content-Type: application/json" \
  -d '{"question":"test"}'
```

## Troubleshooting

**"Failed to fetch" errors:**
- Check browser console for details
- Verify deployment succeeded in Vercel dashboard
- Check the Functions tab in Vercel to see `/api/ask` logs

**Domain not resolving:**
- DNS can take time to propagate
- Verify DNS records match Vercel's requirements exactly
- Use https://dnschecker.org to check propagation status

**API not working:**
- Go to Vercel dashboard → Functions tab
- Click on `/api/ask` to see logs
- Check for errors in function execution

## Future Updates

To deploy updates:

1. Make your changes locally
2. Commit and push to GitHub:
```bash
git add .
git commit -m "Your update message"
git push
```

3. Vercel will automatically redeploy (takes 1-2 minutes)

## Local Development

To run locally:

```bash
npm install
npm run dev
```

The Vite dev server will proxy `/api/*` requests to the serverless functions.

## Customizing the Response

To change what the book writes, edit `/api/ask.js`. Later you can integrate with:
- OpenAI API
- Anthropic Claude API
- Any other LLM service

Just modify the `answer` object structure to return different content.
