# Political Ideology Profiler

A production-ready political ideology quiz and analytics platform. Place users on ideological axes, compare them with historical political figures, classify them into ideological clusters, and build an open political science dataset.

## Features

### Core Platform
- **24-question ideology quiz** across 4 policy domains with importance weighting
- **Two-axis scoring** — Economic (socialist to market liberal) and Social (progressive to conservative)
- **Historical figure alignment** — compare with 17 figures from Marx to Friedman
- **8 ideological clusters** with probability scoring
- **7-dimension radar analysis** — State Capacity, Labour Power, Anti-Monopoly, Globalism, Progressivism, Economic Left, Movement Orientation
- **Country party comparison** — Australia, US, UK, Germany, Sweden

### Advanced Features (v2.0)
- **User Accounts & Profiles** (`/profile`) — save results, track ideology changes over time
- **Ideology Evolution Tracker** — visual timeline of how your ideology shifts across quiz retakes
- **Debate Mode** (`/debate/[id]`) — generate challenge links, compare two participants' ideologies
- **Public Dataset API** (`/api/ideology-stats`) — anonymized aggregate stats for researchers
- **Research Dashboard** (`/admin`) — internal analytics with charts and country data
- **Geographic Ideology Map** (`/map`) — world map visualization of ideological trends by country
- **Advertisement Integration** — Google AdSense, Carbon Ads, custom sponsor banners (configurable)
- **Viral Sharing** — shareable ideology cards for Twitter, Reddit, LinkedIn with PNG download
- **Result Permalinks** (`/result/[id]`) — permanent shareable URLs for quiz results
- **Privacy Safeguards** — anonymized data, no tracking, full data deletion support

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite 5 |
| Charts | Recharts |
| Maps | react-simple-maps |
| Image Export | html2canvas |
| Fonts | Playfair Display, IBM Plex Sans, IBM Plex Mono |
| Storage | localStorage (Supabase-ready architecture) |
| Deployment | Vercel |

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## Build for Production

```bash
npm run build
npm run preview
```

## Deploy to Vercel

1. Push to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Deploy — no configuration needed

For SPA routing, create `vercel.json`:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

## Project Structure

```
src/
  App.jsx                         # Root component with routing
  main.jsx                        # Entry point
  index.css                       # Global styles and design tokens
  components/
    LandingPage.jsx               # Home page
    QuizPage.jsx                  # 24-question quiz with importance weighting
    ResultsPage.jsx               # Full results with charts and sharing
    ResultPermalink.jsx           # Shareable permanent result URLs
    AlignmentCard.jsx             # Historical figure alignment card
    ShareCardGenerator.jsx        # Shareable image card with social sharing
    AdSlot.jsx                    # Multi-provider ad component
    PremiumGate.jsx               # Stripe-ready premium paywall
    PricingSection.jsx            # Premium feature pricing
    ProfilePage.jsx               # User account, ideology timeline
    DebatePage.jsx                # Debate creation and challenge flow
    FriendCompare.jsx             # Side-by-side ideology comparison
    DeepAnalysis.jsx              # 7-dimension radar deep analysis
    CountryComparison.jsx         # Party alignment across 5 countries
    MethodologyPage.jsx           # Research methodology and references
    AdminDashboard.jsx            # Internal analytics dashboard
    GlobalIdeologyMap.jsx         # World map ideology visualization
    IdeologyStatsAPI.jsx          # Public dataset API endpoint
    PrivacyPage.jsx               # Privacy policy and data deletion
  charts/
    IdeologyScatter.jsx           # Two-axis scatter plot
    RadarAnalysis.jsx             # 7-dimension radar chart
    EvolutionChart.jsx            # Ideology timeline line chart
  data/
    questions.js                  # 24 quiz questions with weights
    figures.js                    # 17 historical figures
    clusters.js                   # 8 ideological clusters
    parties.js                    # Political parties for 5 countries
  utils/
    calcResults.js                # Scoring algorithm
    math.js                       # Mathematical utilities
    analytics.js                  # Event tracking (PostHog/Plausible/GA ready)
    resultsStore.js               # Result and debate persistence
    authStore.js                  # User authentication (Supabase-ready)
    adConfig.js                   # Advertisement provider configuration
```

## Database Schema (Supabase Migration)

When migrating to Supabase, use this schema:

```sql
-- Users (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quiz results (anonymized)
CREATE TABLE results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  economic DECIMAL(4,1) NOT NULL,
  social DECIMAL(4,1) NOT NULL,
  cluster TEXT NOT NULL,
  radar_scores JSONB,
  top_issues TEXT[],
  country TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Debates
CREATE TABLE debates (
  id TEXT PRIMARY KEY,
  user1_result UUID REFERENCES results(id),
  user2_result UUID REFERENCES results(id),
  summary TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_results_cluster ON results(cluster);
CREATE INDEX idx_results_country ON results(country);
CREATE INDEX idx_results_user ON results(user_id);
CREATE INDEX idx_results_created ON results(created_at);

-- Row Level Security
ALTER TABLE results ENABLE ROW LEVEL SECURITY;
ALTER TABLE debates ENABLE ROW LEVEL SECURITY;

-- Public read for aggregate stats
CREATE POLICY "Anyone can read aggregate stats"
  ON results FOR SELECT USING (true);

-- Users can manage their own results
CREATE POLICY "Users manage own results"
  ON results FOR ALL USING (auth.uid() = user_id);
```

## Routes

| Route | Description |
|-------|------------|
| `/` | Landing page |
| `/quiz` | Ideology quiz |
| `/results/:id` | Full results page |
| `/result/:id` | Shareable permalink |
| `/profile` | User account & ideology timeline |
| `/debate/new` | Create debate challenge |
| `/debate/:id` | Join/view debate |
| `/compare/:id` | Debate comparison view |
| `/deep-analysis` | Premium radar analysis |
| `/country-comparison` | Premium party comparison |
| `/methodology` | Research methodology |
| `/map` | Geographic ideology map |
| `/admin` | Research dashboard |
| `/api/ideology-stats` | Public dataset API |
| `/privacy` | Privacy policy & data deletion |
| `/pricing` | Premium features |

## Environment Variables

Copy `.env.example` to `.env` for optional integrations:

```bash
cp .env.example .env
```

## Future Roadmap

- Supabase backend integration for persistent storage
- Stripe payment processing for premium features
- PostHog/Plausible analytics integration
- PDF political personality report generation
- WebSocket-based real-time debate mode
- Additional countries and political parties
- Multilingual support
- Academic peer review of question calibration
