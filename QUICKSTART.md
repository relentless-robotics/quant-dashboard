# Quick Start Guide

## 🚀 Deploy in 3 Steps

### 1. Push to GitHub

```bash
cd C:\Users\Footb\Documents\Github\quant-dashboard

# Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/quant-dashboard.git

# Push
git branch -M main
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select `quant-dashboard`
4. Click "Deploy"

### 3. Done!

Your dashboard will be live at:
```
https://quant-dashboard-xxxx.vercel.app
```

---

## 📊 Add Results (3 Ways)

### CLI Script (Easiest)

```bash
node scripts/add-result.js \
  --system Swing \
  --mode backtest \
  --timeframe 4h \
  --sharpe 2.5 \
  --return 0.35 \
  --maxdd 0.15 \
  --sector Technology
```

### JSON File

```bash
node scripts/add-result.js --file path/to/results.json
```

Format:
```json
{
  "system": "Swing",
  "mode": "backtest",
  "timeframe": "4h",
  "metrics": {
    "sharpe": 2.5,
    "totalReturn": 0.35,
    "maxDrawdown": 0.15,
    "winRate": 0.65
  }
}
```

### Direct Edit

Edit: `C:\Users\Footb\Documents\Github\teleclaude-main\logs\trading_performance.json`

---

## 🧪 Test Locally

```bash
npm run dev
```

Open: http://localhost:3000

---

## 📖 Full Documentation

- **README.md** - Project overview
- **DEPLOYMENT.md** - Detailed deployment guide
- **USAGE.md** - How to use and extend
- **ARCHITECTURE.md** - Technical details

---

## 🎯 Quick Commands

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build for production
npm start            # Start production server

# Deployment
git push             # Vercel auto-deploys

# Add result
node scripts/add-result.js --system Swing --sharpe 2.5 ...
```

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `app/page.tsx` | Overview page |
| `app/swing/page.tsx` | Swing system page |
| `lib/dataLoader.ts` | Data loading logic |
| `trading_performance.json` | Centralized results log |
| `components/` | Reusable UI components |

---

## 🆘 Troubleshooting

### Build Error

```bash
npm install
npm run build
```

### Data Not Showing

Check these files exist:
- `C:\Users\Footb\Documents\Github\Swing\results\backtest_results.json`
- `C:\Users\Footb\Documents\Github\teleclaude-main\logs\trading_performance.json`

### Vercel Deployment Fails

1. Check build logs in Vercel dashboard
2. Ensure `package.json` scripts are correct
3. Check environment variables if needed

---

## 🔧 Customization

### Add New System

1. Create `app/newsystem/page.tsx`
2. Add loader in `lib/dataLoader.ts`
3. Update sidebar in `components/Sidebar.tsx`

### Add New Metric

1. Update `lib/types.ts` → `PerformanceMetrics`
2. Calculate in `lib/dataLoader.ts`
3. Display in `components/MetricCard.tsx`

### Change Colors

Edit `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: '#your-color'
    }
  }
}
```

---

## ✅ Checklist

Before deploying:
- [ ] GitHub repo created
- [ ] Code pushed to GitHub
- [ ] Vercel account ready
- [ ] Data files exist

After deploying:
- [ ] Test all pages load
- [ ] Check metrics display correctly
- [ ] Verify charts render
- [ ] Test on mobile

---

## 📞 Support

For issues, check:
1. Browser console for errors
2. Vercel build logs
3. Data file structure
4. Documentation files

---

**That's it! Your quant dashboard is ready to go.** 🎉
