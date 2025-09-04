# 🚀 Deploying GolfGod Mini to Vercel

## Prerequisites
- GitHub repository (✅ Already set up: https://github.com/ThomasJMcGovern/GolfGod_mini)
- Vercel account (Sign up at https://vercel.com)
- Supabase project with database configured

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Connect GitHub to Vercel**
   - Go to [https://vercel.com/new](https://vercel.com/new)
   - Click "Import Git Repository"
   - Connect your GitHub account if not already connected
   - Select `ThomasJMcGovern/GolfGod_mini` repository

2. **Configure Project**
   - Framework Preset: `Vite` (should auto-detect)
   - Root Directory: `./` (leave as is)
   - Build Command: `bun run build` (should auto-detect from vercel.json)
   - Output Directory: `dist` (Vite default)

3. **Add Environment Variables**
   
   Click "Environment Variables" and add:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
   
   ⚠️ **Important**: These must start with `VITE_` to be exposed to the client

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (usually 1-2 minutes)
   - Your app will be live at `https://golf-god-mini.vercel.app` (or similar)

### Option 2: Deploy via CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   # or
   bun add -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   # From project root
   vercel
   
   # Follow prompts:
   # - Set up and deploy? Yes
   # - Which scope? (select your account)
   # - Link to existing project? No
   # - Project name? golf-god-mini
   # - Directory? ./
   # - Override settings? No
   ```

4. **Set Environment Variables**
   ```bash
   vercel env add VITE_SUPABASE_URL
   vercel env add VITE_SUPABASE_ANON_KEY
   ```

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## Post-Deployment

### Custom Domain (Optional)
1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Domains
4. Add your custom domain (e.g., `golfgod.app`)
5. Follow DNS configuration instructions

### Environment Variables Management
- **Development**: Use `.env.local` (never commit this file)
- **Preview**: Set in Vercel dashboard (applies to PR previews)
- **Production**: Set in Vercel dashboard with "Production" environment

### Automatic Deployments
- **Production**: Every push to `main` branch auto-deploys to production
- **Preview**: Every pull request gets a preview deployment
- **Branch Deployments**: Other branches get preview URLs

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json` (not just devDependencies)
- Verify TypeScript has no errors: `bun run build` locally

### Environment Variables Not Working
- Must prefix with `VITE_` for Vite to expose them
- Check they're added in Vercel dashboard
- Redeploy after adding/changing env vars

### 404 Errors on Routes
- The `vercel.json` includes SPA rewrites
- All routes should redirect to `index.html`
- If issues persist, check React Router configuration

### Supabase Connection Issues
- Verify Supabase URL and anon key are correct
- Check Supabase RLS policies allow anonymous access
- Ensure Supabase project is not paused

## Performance Optimization

### Build Optimizations (Already Configured)
- ✅ Tree shaking via Vite
- ✅ Code splitting for routes
- ✅ Minification in production
- ✅ Brotli compression on Vercel

### Recommended Settings
1. **Analytics**: Enable Web Analytics in Vercel dashboard
2. **Speed Insights**: Enable Speed Insights for Core Web Vitals
3. **Edge Functions**: Consider for API routes (future enhancement)

## Monitoring

### Vercel Dashboard Provides
- Deployment history
- Build logs
- Function logs (if using API routes)
- Analytics (page views, visitors)
- Performance metrics

### Recommended Monitoring
- Set up Vercel Analytics (free tier available)
- Configure error reporting (Sentry integration available)
- Monitor Supabase usage in Supabase dashboard

## CI/CD Best Practices

1. **Branch Protection**
   - Protect `main` branch in GitHub
   - Require PR reviews before merging
   - Enable Vercel preview deployments for PRs

2. **Testing Before Deploy**
   ```bash
   # Add to package.json scripts
   "test": "bun test",
   "type-check": "tsc --noEmit",
   "lint": "eslint .",
   "pre-deploy": "bun run type-check && bun run lint && bun test"
   ```

3. **Staging Environment**
   - Create `staging` branch
   - Deploy to `staging.yourdomain.com`
   - Test thoroughly before merging to `main`

## Cost Considerations

### Vercel Free Tier Includes
- 100GB bandwidth/month
- Unlimited deployments
- Automatic HTTPS
- Preview deployments
- Basic analytics

### When to Upgrade
- Need more bandwidth (>100GB/month)
- Team collaboration features
- Advanced analytics
- Priority support

## Security Notes

⚠️ **Never expose**:
- `SUPABASE_SERVICE_ROLE_KEY` (server-side only)
- Database credentials
- API keys without `VITE_` prefix

✅ **Safe to expose** (with RLS):
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

---

## Quick Deploy Checklist

- [ ] GitHub repo connected
- [ ] Environment variables added in Vercel
- [ ] Supabase RLS policies configured
- [ ] Build succeeds locally (`bun run build`)
- [ ] Preview deployment works
- [ ] Production deployment live
- [ ] Custom domain configured (optional)
- [ ] Analytics enabled (optional)

---

*Last Updated: September 2025*
*Deployment Stack: Vercel + Supabase + Bun*