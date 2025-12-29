# One TN Portal - Product Roadmap

## Current State (v1.0) - Live

- **65 Tools** - Comprehensive calculators for TN Government employees
- **Reference Sections** - GOs, Links, FAQs, Forms, Exams
- **PWA Enabled** - Installable on mobile devices
- **Deployed** - Google Cloud Run

---

## Phase 1: Quick Wins (1-2 Weeks)

### 1.1 Google AdSense Integration
- **Goal**: Passive income from free users
- **Effort**: Low
- **Revenue**: ₹5K-50K/month (traffic dependent)
- **Tasks**:
  - [ ] Create AdSense account
  - [ ] Add ad units to layout (sidebar, between content)
  - [ ] Implement responsive ad placements
  - [ ] Exclude ads from print views

### 1.2 Affiliate Marketing
- **Goal**: Earn commission on book/course referrals
- **Effort**: Low
- **Revenue**: ₹10K-1L/month
- **Opportunities**:
  - [ ] TNPSC preparation books (Amazon Affiliate)
  - [ ] Online courses (Udemy, Unacademy partnerships)
  - [ ] Insurance/Investment products (careful with compliance)

### 1.3 Analytics & Tracking
- **Goal**: Understand user behavior for optimization
- **Tasks**:
  - [ ] Google Analytics 4 setup
  - [ ] Track tool usage (which calculators are popular)
  - [ ] User flow analysis
  - [ ] Conversion funnel setup

---

## Phase 2: User Accounts (3-4 Weeks)

### 2.1 Authentication System
- **Goal**: Enable personalized features
- **Options**:
  - NextAuth.js (already partially configured)
  - Google/Phone OTP login (preferred for govt employees)
- **Tasks**:
  - [ ] Implement Google OAuth
  - [ ] Add Phone OTP login (Twilio/MSG91)
  - [ ] User profile page
  - [ ] Session management

### 2.2 User Dashboard
- **Features**:
  - [ ] Saved calculations history
  - [ ] Bookmarked GOs (already have bookmarks, need persistence)
  - [ ] Personal profile (pay level, department, district)
  - [ ] Quick access to frequently used tools

### 2.3 Database Schema Updates
- **New Tables**:
  ```
  users (id, email, phone, name, created_at)
  user_profiles (user_id, pay_level, department, district, doj)
  saved_calculations (user_id, tool, inputs, results, created_at)
  user_preferences (user_id, notifications, theme)
  ```

---

## Phase 3: Premium Features (4-6 Weeks)

### 3.1 Subscription Tiers

| Feature | Free | Premium (₹99/mo) | Pro (₹299/mo) |
|---------|------|------------------|---------------|
| All 65 Calculators | ✅ | ✅ | ✅ |
| Ads | Yes | No | No |
| Save Calculations | 5 | Unlimited | Unlimited |
| PDF Export | Basic | Branded | Custom Header |
| Email GO Alerts | ❌ | Weekly | Daily |
| Retirement Planner | Basic | Detailed | Personalized |
| Priority Support | ❌ | Email | WhatsApp |
| Salary Comparison | ❌ | ❌ | ✅ |

### 3.2 Payment Integration
- **Recommended**: Razorpay (best for India)
- **Tasks**:
  - [ ] Razorpay account setup
  - [ ] Subscription plans creation
  - [ ] Payment page UI
  - [ ] Webhook handling for subscription events
  - [ ] Invoice generation

### 3.3 Premium Features Development

#### PDF Export (Premium)
- Branded calculation reports
- Official-looking format for office submission
- Include date, employee details, calculation breakdown

#### Email GO Alerts
- Daily/Weekly digest of new GOs
- Filtered by user's department preference
- Requires email service (SendGrid/AWS SES)

#### Personalized Retirement Planner
- Input: DOB, DOJ, Current Pay, GPF balance
- Output: Year-by-year projection till retirement
- Includes: Expected pension, gratuity, GPF corpus, leave encashment

---

## Phase 4: Job Board (6-8 Weeks)

### 4.1 TN Government Jobs Section
- **Revenue Model**:
  - Free job listings (aggregate from TRB, TNPSC)
  - Paid featured listings for coaching institutes
  - Sponsored job alerts

### 4.2 Features
- [ ] Job listings aggregator (scrape TRB, TNPSC, DGE)
- [ ] Filter by qualification, district, department
- [ ] Job alerts via email/SMS
- [ ] Coaching institute directory (paid listings)
- [ ] Exam preparation resources

### 4.3 Revenue Potential
- Coaching institute listings: ₹5K-20K/month per institute
- Job alert subscriptions: ₹49/month
- Estimated: ₹50K-2L/month

---

## Phase 5: Advanced Features (8-12 Weeks)

### 5.1 Mobile App (React Native)
- Reuse existing components
- Offline-first calculators
- Push notifications for GOs
- App Store presence increases trust

### 5.2 WhatsApp Bot
- Query salary, pension, DA rates via WhatsApp
- GO search and delivery
- High engagement channel for govt employees
- Revenue: Premium bot features

### 5.3 API for Third Parties
- Provide calculation APIs to other apps
- B2B revenue stream
- Rate-limited free tier, paid for higher limits

### 5.4 Regional Language Support
- Full Tamil UI option
- Voice input for calculators
- Increases accessibility

---

## Technical Debt & Maintenance

### Ongoing Tasks
- [ ] Keep DA rates updated (Jan & July)
- [ ] Add new GOs regularly
- [ ] Monitor and fix broken external links
- [ ] Performance optimization
- [ ] Security updates

### Infrastructure Scaling
- Current: Cloud Run (auto-scaling)
- Future: Consider dedicated instance if traffic grows
- CDN for static assets (already via Next.js)
- Database: Turso (current) → Consider PlanetScale for scale

---

## Revenue Projections

### Year 1 Targets

| Quarter | Focus | Expected Revenue |
|---------|-------|------------------|
| Q1 | AdSense + Affiliate | ₹20K-50K/month |
| Q2 | Premium Subscriptions | ₹50K-1L/month |
| Q3 | Job Board | ₹1L-2L/month |
| Q4 | Scale & Optimize | ₹2L-5L/month |

### Key Metrics to Track
- Monthly Active Users (MAU)
- Tool usage by category
- Premium conversion rate (target: 2-5%)
- Churn rate
- Customer Acquisition Cost (CAC)
- Lifetime Value (LTV)

---

## Competitive Landscape

| Competitor | Strengths | Our Advantage |
|------------|-----------|---------------|
| Kalvisolai | Established, content | Better tools, modern UX |
| Padasalai | Large audience | Comprehensive calculators |
| Individual blogs | Niche content | All-in-one solution |

### Differentiation Strategy
1. **Best-in-class calculators** - Accurate, comprehensive, easy to use
2. **Modern UX** - Mobile-first, fast, clean design
3. **Trustworthy** - Cite GO numbers, transparent calculations
4. **Community** - User feedback, regular updates

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Low traffic | SEO, social media, teacher WhatsApp groups |
| Payment failures | Multiple payment options, UPI |
| Competition | Continuous feature improvement |
| Policy changes | Quick updates when GOs change |
| Server costs | Efficient scaling, monitor costs |

---

## Next Steps

1. **Immediate**: Decide on Phase 1 (AdSense) timeline
2. **This Month**: Set up analytics to understand current traffic
3. **Decision Needed**: Premium pricing strategy
4. **Decision Needed**: Build vs Buy for auth (NextAuth vs Clerk)

---

## Contact & Notes

- **Repository**: github.com/rAtOOns/onetn
- **Live URL**: https://onetn-portal-734553869592.asia-south1.run.app
- **Last Updated**: December 2025

---

*This roadmap is a living document. Update as priorities change.*
