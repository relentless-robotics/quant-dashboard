# Deployment Guide

## Prerequisites

1. **GitHub Account**: Needed to host the repository
2. **Vercel Account**: Free tier is sufficient (sign up at https://vercel.com)

## Step 1: Push to GitHub

### Option A: Using GitHub CLI (Recommended)

```bash
cd C:\Users\Footb\Documents\Github\quant-dashboard
gh repo create quant-dashboard --public --source=. --remote=origin --push
```

### Option B: Manual Setup

1. Go to https://github.com/new
2. Repository name: `quant-dashboard`
3. Set to Public
4. Do NOT initialize with README (we already have one)
5. Click "Create repository"

Then push:

```bash
cd C:\Users\Footb\Documents\Github\quant-dashboard
git remote add origin https://github.com/YOUR_USERNAME/quant-dashboard.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Vercel

### Option A: Using Vercel CLI

```bash
npm install -g vercel
cd C:\Users\Footb\Documents\Github\quant-dashboard
vercel
```

Follow the prompts:
- Link to existing project? **No**
- Project name? **quant-dashboard**
- Deploy? **Yes**

### Option B: Using Vercel Dashboard (Recommended)

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your GitHub account
4. Find and select `quant-dashboard`
5. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`
6. Click "Deploy"

Wait 2-3 minutes for deployment to complete.

## Step 3: Configure Environment (Optional)

If you need environment variables:

1. In Vercel dashboard, go to Project Settings → Environment Variables
2. Add any necessary variables
3. Redeploy

## Step 4: Custom Domain (Optional)

1. In Vercel dashboard, go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

## Troubleshooting

### Build Fails

**Error**: `Module not found: Can't resolve '@/lib/dataLoader'`

**Solution**: Ensure `tsconfig.json` has correct path mappings:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

**Error**: `Dynamic server usage`

**Solution**: This is expected for API routes. They will work correctly in production.

### Data Not Loading

**Issue**: Dashboard shows "No results available"

**Solution**: Check that data files exist:
- `C:\Users\Footb\Documents\Github\Swing\results\backtest_results.json`
- `C:\Users\Footb\Documents\Github\teleclaude-main\logs\trading_performance.json`

Note: Vercel deployment won't have access to local files. You'll need to:

1. Copy the data files to the dashboard project
2. Update paths in `lib/dataLoader.ts`
3. Or set up an API endpoint that reads from a database

## Post-Deployment

### Your Live URL

After deployment, Vercel will provide a URL like:

```
https://quant-dashboard-xxxx.vercel.app
```

You can also configure a custom domain.

### Updating the Dashboard

To push updates:

```bash
git add .
git commit -m "Update: description of changes"
git push
```

Vercel will automatically rebuild and redeploy.

### Adding New Results

Use the helper script:

```bash
node scripts/add-result.js --system Swing --mode backtest --timeframe 4h --sharpe 2.5 --return 0.35 --maxdd 0.15
```

Or add to `trading_performance.json` manually (see README.md).

## Production Considerations

### Data Persistence

For production, consider:

1. **Database**: Store results in PostgreSQL/MongoDB
2. **API**: Create endpoints to fetch data from database
3. **Real-time Updates**: Use WebSocket for live trading data

### Authentication

To restrict access:

1. Add authentication middleware (NextAuth.js)
2. Configure in `middleware.ts`
3. Add login page

### Performance

For better performance:

1. Enable ISR (Incremental Static Regeneration)
2. Add caching headers
3. Optimize images with Next.js Image component
4. Use Server Components where possible

## Support

If deployment fails, check:
- Vercel build logs
- GitHub Actions (if enabled)
- Console errors in browser

For questions, refer to:
- Next.js docs: https://nextjs.org/docs
- Vercel docs: https://vercel.com/docs
- GitHub docs: https://docs.github.com
