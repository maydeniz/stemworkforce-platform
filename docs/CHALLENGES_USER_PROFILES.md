# Innovation Challenges - User Profiles & Workflows

## Executive Summary

This document outlines the comprehensive design for Innovation Challenges across all user profiles in the STEMWORKFORCE platform. Based on UX research and best practices from leading challenge platforms (HeroX, Kaggle, Devpost, NASA Challenges), we've designed role-specific features and workflows.

---

## User Profile Matrix

| Profile | Primary Goal | Dashboard Location | Key Actions |
|---------|-------------|-------------------|-------------|
| **Challenge Sponsor** | Post & manage challenges | Partner Dashboard | Create, fund, review, select winners |
| **Challenge Solver** | Participate & win | Learner/JobSeeker Dashboard | Browse, register, submit, collaborate |
| **Challenge Reviewer/Judge** | Evaluate submissions | Provider Dashboard | Score, provide feedback, rank |
| **Challenge Admin** | Platform governance | Admin Dashboard | Approve, moderate, resolve disputes |

---

## 1. CHALLENGE SPONSOR (Employers/Partners)

### User Persona
- **Who**: Companies, government agencies, national labs, universities
- **Goal**: Source innovative solutions, recruit talent, build brand
- **Pain Points**: Finding qualified solvers, managing submissions, IP concerns

### Dashboard Features (Partner Dashboard - `/dashboard`)

#### A. Challenges Tab (New)
```
📊 My Challenges Overview
├── Active Challenges (3)
│   ├── AI Healthcare Challenge - 45 submissions, 12 days left
│   ├── Clean Energy Innovation - Registration open
│   └── Quantum Computing Sprint - Judging phase
├── Draft Challenges (2)
├── Completed Challenges (8)
└── Total Prize Pool Distributed: $450,000
```

#### B. Challenge Management Panel
- **Challenge Cards** showing:
  - Status badge (Draft/Active/Judging/Complete)
  - Submission count & registration count
  - Prize pool remaining
  - Days until deadline
  - Quick actions (View, Edit, Announce)

#### C. Sponsor-Specific Features
1. **Challenge Creation Wizard** (7 steps)
   - Basic Info → Details → Eligibility → Timeline → Awards → Resources → Review

2. **Submission Review Dashboard**
   - Kanban view: New → In Review → Shortlisted → Winner
   - AI pre-screening scores
   - Judge assignment interface
   - Batch operations

3. **Solver Pool Management**
   - View all registered solvers
   - Filter by skills, experience, location
   - Direct messaging capability
   - Invite to future challenges

4. **Analytics Dashboard**
   - Participation funnel (Views → Registrations → Submissions)
   - Demographic breakdown of solvers
   - Quality scores distribution
   - ROI metrics

### Workflow: Creating a Challenge
```
1. Click "Create Challenge" from Partner Dashboard
2. Complete 7-step wizard
3. Challenge goes to "Draft" status
4. Preview and request approval (if org requires)
5. Publish challenge → Status: "Registration Open"
6. Monitor registrations and Q&A
7. Close registration → Review submissions
8. Assign judges → Conduct evaluation
9. Select winners → Make announcement
10. Distribute prizes → Close challenge
```

---

## 2. CHALLENGE SOLVER (Students/Job Seekers)

### User Persona
- **Who**: Students, professionals, researchers, small teams
- **Goal**: Win prizes, build portfolio, gain recognition, network
- **Pain Points**: Finding relevant challenges, team formation, submission requirements

### Dashboard Features (Learner/JobSeeker Dashboard - `/dashboard`)

#### A. Challenges Tab (New)
```
🏆 My Challenge Journey
├── Active Participations (2)
│   ├── AI Healthcare Challenge - Submission due in 5 days
│   └── Hackathon 2025 - Team forming
├── Saved Challenges (7)
├── Completed Challenges (12)
│   └── 🥇 3 wins, 🥈 4 runner-ups
├── My Teams (3)
└── Leaderboard Rank: #127 globally
```

#### B. Challenge Discovery
- Personalized recommendations based on:
  - Skills profile
  - Past participation
  - Industry interests
  - Clearance level
- Filter by: Prize range, deadline, type, industry, team size

#### C. Solver-Specific Features
1. **Challenge Participation Hub**
   - Registration status
   - Team management
   - Submission drafts
   - Timeline tracker
   - Resource library access

2. **Team Formation Center**
   - Browse recruiting teams
   - Post "Looking for Team" profile
   - Skill matching algorithm
   - Direct messaging with potential teammates
   - Team workspace with shared documents

3. **Submission Builder**
   - Multi-step submission form
   - Progress auto-save
   - File upload with validation
   - Video demo recorder/uploader
   - AI feedback on draft (optional)

4. **Portfolio Integration**
   - Showcase winning submissions
   - Display badges and achievements
   - Export to LinkedIn profile
   - Generate shareable certificates

### Workflow: Participating in a Challenge
```
1. Browse challenges from Dashboard or /challenges
2. View challenge details, check eligibility
3. Click "Register" → Accept terms
4. Choose: Solo or Team participation
5. (If team) Create team or join existing
6. Access challenge resources
7. Work on solution (track progress)
8. Submit before deadline
9. Receive AI pre-screening feedback
10. Wait for results / Improve submission
11. View final scores and feedback
12. (If winner) Claim prize, get recognition
```

---

## 3. CHALLENGE REVIEWER/JUDGE (Experts)

### User Persona
- **Who**: Industry experts, professors, researchers, past winners
- **Goal**: Evaluate quality, provide mentorship, earn compensation
- **Pain Points**: Time management, fair evaluation, detailed feedback

### Dashboard Features (Provider Dashboard - `/provider` or new Judge Portal)

#### A. Judging Queue
```
⚖️ My Judging Assignments
├── Pending Reviews (15)
│   ├── AI Healthcare - 8 submissions (Due: 3 days)
│   └── Clean Energy - 7 submissions (Due: 5 days)
├── Completed Reviews (42)
├── Average Score Given: 72/100
└── Feedback Quality Rating: 4.8/5
```

#### B. Evaluation Interface
- Side-by-side view: Criteria + Submission
- Scoring rubric with guidance
- Structured feedback forms
- Plagiarism/AI detection flags
- Comparison view for tied scores

#### C. Reviewer-Specific Features
1. **Evaluation Workbench**
   - Criteria-based scoring (weighted)
   - Rich text feedback per criterion
   - Overall recommendation
   - Flag for further review
   - Time tracking per submission

2. **Calibration Tools**
   - Sample submission scoring
   - Score distribution visualization
   - Peer reviewer comparisons
   - Consensus building interface

3. **Judge Profile & Reputation**
   - Expertise areas
   - Availability calendar
   - Rating from sponsors
   - Compensation history

### Workflow: Judging Submissions
```
1. Receive invitation to judge (email + dashboard)
2. Accept assignment, review criteria
3. Complete calibration exercise (if required)
4. Access submission queue
5. For each submission:
   a. Review deliverables
   b. Score each criterion
   c. Write detailed feedback
   d. Make recommendation
   e. Submit evaluation
6. Participate in consensus review (if needed)
7. Receive compensation
```

---

## 4. CHALLENGE ADMIN (Platform Staff)

### User Persona
- **Who**: Platform administrators, compliance officers
- **Goal**: Ensure quality, fair play, legal compliance
- **Pain Points**: Disputes, fraud detection, content moderation

### Dashboard Features (Admin Dashboard - `/admin`)

#### A. Challenge Moderation Tab (New)
```
🛡️ Challenge Administration
├── Pending Approvals (5)
├── Active Challenges (23)
├── Flagged Submissions (3)
├── Open Disputes (2)
├── Compliance Reviews (1)
└── This Month: 45 challenges, $2.3M in prizes
```

#### B. Admin-Specific Features
1. **Challenge Approval Queue**
   - Review new challenge submissions
   - Check sponsor verification
   - Validate prize funding
   - Legal/compliance review
   - Approve/Reject with notes

2. **Dispute Resolution Center**
   - View dispute details
   - Communication thread
   - Evidence review
   - Decision logging
   - Appeal handling

3. **Fraud Detection Dashboard**
   - AI similarity scores
   - Plagiarism reports
   - Multi-account detection
   - Suspicious activity alerts

4. **Compliance & Reporting**
   - Export regulations check
   - IP assignment verification
   - Prize payout compliance
   - Tax documentation

---

## Integration Architecture

### Dashboard Integration Points

```typescript
// Partner Dashboard - Add Challenges Tab
const PARTNER_SIDEBAR_ITEMS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'jobs', label: 'Job Postings', icon: Briefcase },
  { id: 'challenges', label: 'Challenges', icon: Trophy }, // NEW
  { id: 'applications', label: 'Applications', icon: FileText },
  { id: 'talent', label: 'Talent Pool', icon: Users },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
];

// Learner Dashboard - Add Challenges Tab
const LEARNER_SIDEBAR_ITEMS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'applications', label: 'Applications', icon: FileText },
  { id: 'challenges', label: 'Challenges', icon: Trophy }, // NEW
  { id: 'saved', label: 'Saved Jobs', icon: Bookmark },
  { id: 'teams', label: 'My Teams', icon: Users }, // NEW
  { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
];

// Admin Dashboard - Add Challenge Moderation
const ADMIN_TABS = [
  // ... existing tabs
  { id: 'challenges', label: 'Challenges', icon: Trophy }, // NEW
  { id: 'disputes', label: 'Disputes', icon: AlertTriangle }, // NEW
];
```

### API Endpoints Needed

```typescript
// Sponsor APIs
POST   /api/challenges                    // Create challenge
GET    /api/challenges/my-hosted          // Get sponsor's challenges
PUT    /api/challenges/:id                // Update challenge
DELETE /api/challenges/:id                // Delete draft
POST   /api/challenges/:id/publish        // Publish challenge
GET    /api/challenges/:id/submissions    // Get all submissions
POST   /api/challenges/:id/announce       // Announce winners

// Solver APIs
GET    /api/challenges/recommended        // AI-recommended challenges
GET    /api/challenges/my-participations  // User's registered challenges
POST   /api/challenges/:id/register       // Register for challenge
GET    /api/challenges/:id/my-submission  // Get own submission
POST   /api/challenges/:id/submit         // Create/update submission
GET    /api/teams/recruiting              // Find teams to join
POST   /api/teams                         // Create team
POST   /api/teams/:id/join                // Request to join team

// Judge APIs
GET    /api/judge/assignments             // Get judging assignments
GET    /api/judge/submissions/:id         // Get submission to review
POST   /api/judge/submissions/:id/score   // Submit evaluation
GET    /api/judge/calibration/:id         // Get calibration exercises

// Admin APIs
GET    /api/admin/challenges/pending      // Pending approvals
POST   /api/admin/challenges/:id/approve  // Approve challenge
POST   /api/admin/challenges/:id/reject   // Reject challenge
GET    /api/admin/disputes                // Get open disputes
POST   /api/admin/disputes/:id/resolve    // Resolve dispute
```

---

## Implementation Phases

### Phase 1: Core Dashboard Integration (Week 1-2)
- [ ] Add Challenges tab to Partner Dashboard
- [ ] Add Challenges tab to Learner/JobSeeker Dashboard
- [ ] Create "My Challenges" overview components
- [ ] Integrate challenge stats into dashboard overview

### Phase 2: Sponsor Features (Week 3-4)
- [ ] Challenge management panel
- [ ] Submission review interface
- [ ] Solver pool viewer
- [ ] Basic analytics

### Phase 3: Solver Features (Week 5-6)
- [ ] Challenge discovery and recommendations
- [ ] Team formation center
- [ ] Submission builder improvements
- [ ] Portfolio integration

### Phase 4: Judge Portal (Week 7-8)
- [ ] Evaluation workbench
- [ ] Calibration tools
- [ ] Judge assignment system
- [ ] Compensation tracking

### Phase 5: Admin Tools (Week 9-10)
- [ ] Challenge moderation queue
- [ ] Dispute resolution center
- [ ] Fraud detection alerts
- [ ] Compliance reporting

---

## Key Metrics to Track

| Metric | Target | Owner |
|--------|--------|-------|
| Challenge completion rate | >80% | Product |
| Solver satisfaction | >4.5/5 | UX |
| Time to first submission | <7 days | Growth |
| Judge evaluation time | <30 min/submission | Operations |
| Dispute resolution time | <72 hours | Support |
| Sponsor return rate | >60% | Sales |

---

## Next Steps

1. Review and approve this design document
2. Create detailed wireframes for each dashboard view
3. Prioritize features for MVP vs. future releases
4. Begin Phase 1 implementation
5. Set up analytics tracking
6. Plan user testing sessions
