# WeatherApp — Advanced Next.js Weather Application

A full-stack weather app with user accounts, search history, favourite cities and 5-day forecasts.

## Features
- 🌤️ Real-time weather for any city worldwide
- 📅 5-day forecast with daily breakdown
- 🔐 User accounts (sign up / login)
- ❤️ Save favourite cities
- 🕐 Automatic search history
- 🔑 API key hidden server-side (secure)
- 📱 Fully responsive, dark UI

## Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS v4
- **Database:** Neon (serverless Postgres)
- **ORM:** Drizzle ORM
- **Auth:** Better Auth
- **Weather API:** OpenWeatherMap
- **Deployment:** Vercel

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
```bash
cp .env.example .env.local
```

Fill in `.env.local`:
```env
DATABASE_URL="postgresql://..."         # from neon.tech
BETTER_AUTH_SECRET="..."               # openssl rand -base64 32
BETTER_AUTH_URL="http://localhost:3000"
OPENWEATHER_API_KEY="..."              # from openweathermap.org
```

### 3. Push database schema
```bash
npm run db:push
```

### 4. Run locally
```bash
npm run dev
```

Open http://localhost:3000

## Deployment (Vercel)

1. Push to GitHub
2. Import repo on vercel.com
3. Add all 4 environment variables in Vercel dashboard
   - Change `BETTER_AUTH_URL` to your Vercel URL
4. Deploy

Every `git push` auto-redeploys the site.

## Project Structure
```
app/
  page.tsx                  # Landing / search page
  weather/[city]/page.tsx   # Weather detail + 5-day forecast
  dashboard/page.tsx        # Favourites + search history
  login/page.tsx
  signup/page.tsx
  api/
    auth/[...all]/          # Better Auth handler
    favourites/             # POST / DELETE favourites
    history/                # DELETE search history

components/
  navbar.tsx
  search-bar.tsx
  favourite-button.tsx
  delete-history-button.tsx
  nav-actions.tsx
  ui/                       # button, input, card, label

db/
  schema.ts                 # All tables
  index.ts                  # Drizzle client

lib/
  weather.ts                # OpenWeatherMap API helpers
  auth/                     # Better Auth config
  utils.ts
```
