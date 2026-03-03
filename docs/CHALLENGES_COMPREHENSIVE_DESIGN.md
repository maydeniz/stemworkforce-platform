# Innovation Challenges - Comprehensive System Design

## Executive Summary

This document outlines the complete design for the STEMWORKFORCE Innovation Challenges platform, based on UX research from leading platforms (HeroX, Kaggle, Devpost, InnoCentive, Topcoder, NASA Challenges) and consultation with domain experts.

---

## Table of Contents

1. [User Journeys & Workflows](#1-user-journeys--workflows)
2. [Component Architecture](#2-component-architecture)
3. [Modal Specifications](#3-modal-specifications)
4. [Form Designs](#4-form-designs)
5. [Backend API Design](#5-backend-api-design)
6. [Database Enhancements](#6-database-enhancements)
7. [Notification System](#7-notification-system)
8. [AI Integration](#8-ai-integration)

---

## 1. User Journeys & Workflows

### 1.1 Challenge Sponsor Journey

```
SPONSOR WORKFLOW

1. DISCOVERY & DECISION
   └── Visits /challenges/post landing page
   └── Reviews pricing, features, success stories
   └── Clicks "Post a Challenge"

2. AUTHENTICATION CHECK
   ├── If not logged in → AuthModal with sponsor context
   └── If logged in → Check role/organization

3. CHALLENGE CREATION (7-Step Wizard)
   Step 1: Basics
   ├── Challenge title
   ├── Challenge type (ideation/prototype/solution/research/hackathon/grand)
   ├── Primary industry
   └── Short description (tagline)

   Step 2: Details
   ├── Problem statement (rich text)
   ├── Goals & success metrics
   ├── Full description
   └── AI Brief Generator (optional)

   Step 3: Eligibility
   ├── Solver types allowed
   ├── Geographic restrictions
   ├── Age/experience requirements
   ├── IP assignment terms
   └── NDA requirement

   Step 4: Timeline
   ├── Registration deadline
   ├── Submission deadline
   ├── Judging period
   ├── Winners announcement
   └── Multi-phase configuration (optional)

   Step 5: Awards
   ├── Total prize pool
   ├── Individual awards (1st, 2nd, 3rd, etc.)
   ├── Non-cash benefits
   └── Hiring intent toggle

   Step 6: Resources & Judging
   ├── Resources (datasets, APIs, docs)
   ├── Requirements (deliverables)
   ├── Judging criteria with weights
   └── Judge recruitment option

   Step 7: Review & Publish
   ├── Preview challenge page
   ├── Payment/billing confirmation
   ├── Terms acceptance
   └── Publish or Save Draft

4. POST-LAUNCH MANAGEMENT
   ├── Monitor registrations
   ├── Answer Q&A / Discussion
   ├── Post announcements
   ├── Review submissions (during judging)
   ├── Assign judges
   ├── Approve scores
   └── Announce winners

5. POST-CHALLENGE
   ├── Connect with winners (hiring)
   ├── Download analytics report
   ├── Request testimonials
   └── Plan next challenge
```

### 1.2 Challenge Solver Journey

```
SOLVER WORKFLOW

1. DISCOVERY
   ├── Browse /challenges page
   ├── Filter by skills/industry/prize/deadline
   ├── View personalized recommendations
   ├── Search by keyword
   └── Receive email alerts for matching challenges

2. CHALLENGE EVALUATION
   └── View Challenge Detail Page
       ├── Overview tab (problem, goals)
       ├── Rules tab (eligibility, requirements)
       ├── Resources tab (downloads, APIs)
       ├── Timeline tab (deadlines, phases)
       ├── Awards tab (prizes, benefits)
       ├── Discussion tab (Q&A)
       └── Leaderboard tab (if applicable)

3. REGISTRATION
   ├── Check eligibility requirements
   ├── Click "Register for Challenge"
   ├── Accept terms & IP agreement
   ├── Receive confirmation modal
   └── Join Slack channel (optional)

4. TEAM FORMATION (if applicable)
   Option A: Create Team
   ├── Name team
   ├── Set skills needed
   ├── Enable recruiting
   └── Invite teammates

   Option B: Join Existing Team
   ├── Browse recruiting teams
   ├── Filter by skills needed
   ├── Send join request
   └── Wait for acceptance

   Option C: Find Teammates
   ├── Use AI matching
   ├── Browse solver profiles
   ├── Send invitation
   └── Form team together

5. SOLUTION DEVELOPMENT
   ├── Access challenge resources
   ├── Track progress in dashboard
   ├── Collaborate with team (if applicable)
   ├── Ask questions in discussion
   └── Receive deadline reminders

6. SUBMISSION
   Step 1: Project Overview
   ├── Title
   ├── Tagline (140 chars)
   └── Thumbnail image

   Step 2: Team Confirmation
   ├── Verify members
   └── Assign contributions

   Step 3: Project Details
   ├── Description (rich text)
   ├── Technologies used
   └── Image gallery

   Step 4: Demo & Deliverables
   ├── Video demo link
   ├── File uploads
   ├── Repository URL
   └── Live demo URL

   Step 5: Challenge Questions
   ├── Custom sponsor questions
   ├── Category/track selection
   └── AI tools disclosure

   Step 6: Review & Submit
   ├── Preview submission
   ├── Terms acceptance
   └── Submit (or save draft)

7. POST-SUBMISSION
   ├── Receive confirmation
   ├── Edit until deadline
   ├── View leaderboard position (if public)
   └── Wait for results

8. RESULTS
   ├── Receive notification
   ├── View final rank/score
   ├── Read judge feedback
   └── If winner: Claim prize
```

### 1.3 Judge/Reviewer Journey

```
JUDGE WORKFLOW

1. INVITATION
   ├── Receive judging invitation
   ├── Review challenge details
   ├── Accept/decline assignment
   └── Declare conflicts of interest

2. CALIBRATION
   ├── Review judging criteria
   ├── Score sample submissions
   ├── Align with other judges
   └── Confirm understanding

3. EVALUATION
   For each assigned submission:
   ├── Review deliverables
   ├── Watch video demo
   ├── Test live demo (if applicable)
   ├── Score each criterion (1-5 scale)
   ├── Write criterion feedback
   ├── Overall recommendation
   ├── Flag exceptional work
   └── Submit evaluation

4. CONSENSUS (if needed)
   ├── Review score distributions
   ├── Discuss outliers
   ├── Finalize rankings
   └── Approve final results

5. POST-JUDGING
   ├── Receive compensation
   └── Provide feedback on process
```

---

## 2. Component Architecture

### 2.1 New Components to Create

```
src/components/challenges/
├── modals/
│   ├── ChallengeRegistrationModal.tsx      # Register for challenge
│   ├── TeamFormationModal.tsx              # Create/join/find team
│   ├── TeamInvitationModal.tsx             # Accept/decline invite
│   ├── SubmissionConfirmationModal.tsx     # Post-submit confirmation
│   ├── WinnerAnnouncementModal.tsx         # Results notification
│   ├── EligibilityCheckModal.tsx           # Pre-registration check
│   ├── DeadlineReminderModal.tsx           # Deadline approaching
│   └── IPTermsModal.tsx                    # Detailed IP explanation
│
├── forms/
│   ├── SubmissionWizard.tsx                # 6-step submission form
│   ├── JudgeEvaluationForm.tsx             # Scoring interface
│   ├── TeamCreateForm.tsx                  # Team creation
│   ├── SolverProfileForm.tsx               # Skill/experience setup
│   └── SponsorQuestionBuilder.tsx          # Custom questions for sponsors
│
├── cards/
│   ├── ChallengeCard.tsx                   # Discovery grid card
│   ├── SubmissionCard.tsx                  # Submission preview
│   ├── TeamCard.tsx                        # Team preview
│   ├── SolverCard.tsx                      # Solver profile card
│   ├── JudgeAssignmentCard.tsx             # Judge task card
│   └── LeaderboardEntry.tsx                # Leaderboard row
│
├── sections/
│   ├── ChallengeHero.tsx                   # Challenge detail header
│   ├── ChallengeTimeline.tsx               # Visual timeline
│   ├── ChallengePrizes.tsx                 # Award showcase
│   ├── ChallengeRequirements.tsx           # Requirements list
│   ├── ChallengeDiscussion.tsx             # Q&A forum
│   ├── ChallengeLeaderboard.tsx            # Rankings table
│   └── ChallengeResources.tsx              # Downloads/links
│
├── dashboards/
│   ├── SponsorChallengeDashboard.tsx       # Full sponsor management
│   ├── SolverChallengeDashboard.tsx        # Full solver tracking
│   ├── JudgeDashboard.tsx                  # Judging interface
│   └── ChallengeAnalytics.tsx              # Metrics & reports
│
└── shared/
    ├── ProgressIndicator.tsx               # Step progress
    ├── DeadlineCountdown.tsx               # Time remaining
    ├── PrizeDisplay.tsx                    # Prize formatting
    ├── SkillTagSelector.tsx                # Multi-select skills
    ├── RichTextEditor.tsx                  # Description editor
    └── FileUploader.tsx                    # Drag-drop uploads
```

### 2.2 Component Hierarchy

```
ChallengeDetailPage
├── ChallengeHero
│   ├── SponsorBadge
│   ├── ChallengeStatusBadge
│   ├── DeadlineCountdown
│   └── RegisterButton → ChallengeRegistrationModal
│
├── ChallengeTabsNav
│   ├── OverviewTab
│   │   ├── ProblemStatement
│   │   ├── ChallengeGoals
│   │   └── SuccessMetrics
│   │
│   ├── RulesTab
│   │   ├── EligibilityRequirements
│   │   ├── SubmissionRequirements
│   │   └── LegalTerms
│   │
│   ├── ResourcesTab
│   │   ├── ResourceDownloadList
│   │   └── ExternalLinks
│   │
│   ├── TimelineTab
│   │   └── ChallengeTimeline (visual)
│   │
│   ├── AwardsTab
│   │   ├── PrizeBreakdown
│   │   └── NonCashBenefits
│   │
│   ├── DiscussionTab
│   │   ├── AnnouncementsBanner
│   │   ├── CommentThread
│   │   └── NewCommentForm
│   │
│   └── LeaderboardTab
│       └── ChallengeLeaderboard
│
└── StickyBottomBar
    ├── PrizeDisplay
    ├── DeadlineDisplay
    └── CTAButton (Register/Submit)
```

---

## 3. Modal Specifications

### 3.1 ChallengeRegistrationModal

```typescript
interface ChallengeRegistrationModalProps {
  challenge: Challenge;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (registration: ChallengeSolver) => void;
}

// Content Structure:
//
// ✨ Join [Challenge Title]
//
// Eligibility Checklist:
// ☑ I am 18 years or older
// ☑ I am located in [eligible countries]
// ☑ I accept the IP assignment terms
// ☑ I agree to the challenge rules
//
// Skills (optional):
// [Tag selector for relevant skills]
//
// Participation Type:
// ○ Individual
// ○ Team (form/join later)
//
// [Cancel] [Register]
```

### 3.2 TeamFormationModal

```typescript
interface TeamFormationModalProps {
  challenge: Challenge;
  mode: 'create' | 'join' | 'find';
  existingTeam?: ChallengeTeam;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (team: ChallengeTeam) => void;
}

// Mode: Create
//
// 🚀 Create Your Team
//
// Team Name: [input]
// Description: [textarea]
//
// Skills Needed:
// [Tag selector]
//
// ☑ Open to new members
//
// [Cancel] [Create Team]

// Mode: Join
//
// 👥 Recruiting Teams
//
// [Search teams...]
//
// Team Cards:
// ┌─────────────────────────────────┐
// │ Team Alpha                      │
// │ 3/5 members | Looking for: ML  │
// │ [View Details] [Request Join]  │
// └─────────────────────────────────┘

// Mode: Find
//
// 🔍 Find Teammates
//
// Skills Wanted:
// [Tag selector]
//
// Matching Solvers:
// [Solver cards with invite button]
```

### 3.3 SubmissionConfirmationModal

```typescript
interface SubmissionConfirmationModalProps {
  submission: ChallengeSubmission;
  challenge: Challenge;
  isUpdate: boolean;
  isOpen: boolean;
  onClose: () => void;
}

// Content:
//
// 🎉 Submission Received!
//
// "[Submission Title]"
// successfully submitted to [Challenge Title]
//
// ┌────────────────────────────────┐
// │ Submission ID: #12345         │
// │ Version: 2                     │
// │ Submitted: Jan 12, 2026 3:45PM│
// │ Status: ✓ Under Review        │
// └────────────────────────────────┘
//
// ⚠️ You can edit until [deadline]
//
// What's Next:
// 1. Eligibility review (1-2 days)
// 2. Judge evaluation ([dates])
// 3. Results: [date]
//
// [View Submission] [Share] [Close]
```

### 3.4 WinnerAnnouncementModal

```typescript
interface WinnerAnnouncementModalProps {
  challenge: Challenge;
  userResult: {
    isWinner: boolean;
    place?: number;
    prize?: number;
    rank: number;
    score: number;
    percentile: number;
    feedback?: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

// Winner Version:
//
// 🏆🎊 CONGRATULATIONS! 🎊🏆
//
// You've won 2nd Place!
// in [Challenge Title]
//
// Your Prize: $15,000
//
// What's Next:
// ✓ Verification email (24 hours)
// ✓ Prize payment (30 days)
// ✓ Winner spotlight (optional)
//
// [Share Victory 🎉] [View Results]

// Non-Winner Version:
//
// 📊 Results Are In!
//
// [Challenge Title] has concluded.
//
// Your Result:
// ┌────────────────────────────────┐
// │ Rank: #47 out of 312          │
// │ Score: 78.5/100               │
// │ Top 15%                       │
// └────────────────────────────────┘
//
// 💪 Keep building! Your next win
// is one challenge away.
//
// [View Full Leaderboard] [Browse Challenges]
```

---

## 4. Form Designs

### 4.1 SubmissionWizard (6 Steps)

```typescript
interface SubmissionWizardProps {
  challengeId: string;
  existingDraft?: ChallengeSubmission;
  challenge: Challenge;
  team?: ChallengeTeam;
  onAutoSave: (draft: Partial<ChallengeSubmission>) => void;
  onSubmit: (submission: ChallengeSubmission) => void;
}

// Step 1: Project Overview
fields: {
  title: { type: 'text', required: true, maxLength: 100 },
  tagline: { type: 'text', required: true, maxLength: 140 },
  thumbnail: { type: 'image', maxSize: '5MB', aspectRatio: '3:2' }
}

// Step 2: Team Confirmation (if team)
fields: {
  confirmMembers: { type: 'checkbox-list' },
  contributions: { type: 'text-per-member' }
}

// Step 3: Project Details
fields: {
  description: { type: 'richtext', required: true, minLength: 500 },
  technicalApproach: { type: 'richtext' },
  builtWith: { type: 'tag-selector', predefined: true },
  imageGallery: { type: 'multi-image', maxCount: 10, maxSize: '10MB' }
}

// Step 4: Demo & Deliverables
fields: {
  videoUrl: { type: 'url', platforms: ['youtube', 'vimeo'] },
  repositoryUrl: { type: 'url', platforms: ['github', 'gitlab'] },
  demoUrl: { type: 'url' },
  files: { type: 'multi-file', maxSize: '35MB', formats: ['zip', 'pdf'] }
}

// Step 5: Challenge Questions
fields: {
  customQuestions: { type: 'dynamic', from: challenge.customQuestions },
  categories: { type: 'checkbox', from: challenge.categories },
  aiDisclosure: { type: 'tag-selector' }
}

// Step 6: Review & Submit
fields: {
  termsAccepted: { type: 'checkbox', required: true },
  originalWork: { type: 'checkbox', required: true }
}
```

### 4.2 JudgeEvaluationForm

```typescript
interface JudgeEvaluationFormProps {
  submission: ChallengeSubmission;
  challenge: Challenge;
  rubric: JudgingCriteria[];
  existingScores?: SubmissionScore;
  onSave: (scores: SubmissionScore, status: 'draft' | 'final') => void;
}

// Layout:
//
// ┌─────────────────────────────────────────────────────────┐
// │ Submission: "[Title]"                                   │
// │ Team: [Name] | Submitted: [Date]                        │
// └─────────────────────────────────────────────────────────┘
//
// ┌─ Deliverables ──────────────────────────────────────────┐
// │ 📹 Video Demo [Watch]                                   │
// │ 📁 Files [Download All]                                 │
// │ 🔗 Repository [Open]                                    │
// │ 🌐 Live Demo [Visit]                                    │
// └─────────────────────────────────────────────────────────┘
//
// ┌─ Evaluation ────────────────────────────────────────────┐
// │                                                         │
// │ Innovation & Creativity (25%)                          │
// │ ○ 1  ○ 2  ○ 3  ○ 4  ● 5                               │
// │ Feedback: [textarea]                                    │
// │                                                         │
// │ Technical Implementation (20%)                          │
// │ ○ 1  ○ 2  ● 3  ○ 4  ○ 5                               │
// │ Feedback: [textarea]                                    │
// │                                                         │
// │ [... more criteria ...]                                 │
// │                                                         │
// │ Overall Comments:                                       │
// │ [textarea]                                              │
// │                                                         │
// │ ☐ Exceeds Expectations (Recommend for special award)   │
// │                                                         │
// │ [Save Draft] [Submit Final Scores]                      │
// └─────────────────────────────────────────────────────────┘
```

---

## 5. Backend API Design

### 5.1 New API Endpoints

```typescript
// Submission Management
POST   /api/challenges/:id/submissions           // Create submission
PUT    /api/challenges/:id/submissions/:subId    // Update submission
POST   /api/challenges/:id/submissions/:subId/submit  // Final submit
GET    /api/challenges/:id/submissions/mine      // Get user's submission
GET    /api/challenges/:id/submissions           // Sponsor: all submissions

// Team Management
POST   /api/challenges/:id/teams                 // Create team
GET    /api/challenges/:id/teams/recruiting      // List recruiting teams
POST   /api/challenges/:id/teams/:teamId/join    // Request to join
PUT    /api/challenges/:id/teams/:teamId/members/:userId  // Accept/decline
DELETE /api/challenges/:id/teams/:teamId/leave   // Leave team
GET    /api/challenges/:id/teams/mine            // Get user's team

// Judging
POST   /api/challenges/:id/judges                // Assign judge
GET    /api/challenges/:id/judges/assignments    // Get judge's queue
POST   /api/submissions/:id/scores               // Submit scores
GET    /api/challenges/:id/scores                // Get all scores (sponsor)
POST   /api/challenges/:id/finalize              // Finalize results

// Leaderboard
GET    /api/challenges/:id/leaderboard           // Public leaderboard
GET    /api/challenges/:id/leaderboard/private   // Private (post-judging)

// Analytics
GET    /api/challenges/:id/analytics             // Challenge metrics
GET    /api/challenges/:id/funnel                // Registration funnel

// Notifications
POST   /api/challenges/:id/announcements         // Post announcement
GET    /api/challenges/:id/announcements         // List announcements
POST   /api/challenges/:id/notify                // Send notifications
```

### 5.2 Webhook Events

```typescript
// Challenge Lifecycle
'challenge.created'
'challenge.published'
'challenge.registration-opened'
'challenge.submission-deadline-approaching'  // 48h, 24h
'challenge.submission-closed'
'challenge.judging-started'
'challenge.winners-announced'
'challenge.completed'

// Solver Events
'solver.registered'
'solver.team-invited'
'solver.team-accepted'
'solver.submission-created'
'solver.submission-submitted'
'solver.result-available'

// Judge Events
'judge.assigned'
'judge.evaluation-due'
'judge.evaluation-submitted'

// Sponsor Events
'sponsor.submission-received'
'sponsor.judging-complete'
'sponsor.action-required'
```

---

## 6. Database Enhancements

### 6.1 Additional Tables

```sql
-- Solver skill assessments
CREATE TABLE solver_skill_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  skill TEXT NOT NULL,
  level TEXT CHECK (level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  verified BOOLEAN DEFAULT false,
  verified_by UUID REFERENCES auth.users(id),
  verified_at TIMESTAMPTZ,
  endorsements_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Challenge recommendations
CREATE TABLE challenge_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  challenge_id UUID REFERENCES challenges(id),
  score DECIMAL(5,2),
  reasons JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- Judge calibration scores
CREATE TABLE judge_calibrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID REFERENCES challenges(id),
  judge_id UUID REFERENCES auth.users(id),
  sample_submission_id UUID,
  expected_score DECIMAL(5,2),
  actual_score DECIMAL(5,2),
  deviation DECIMAL(5,2),
  calibrated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Winner certificates
CREATE TABLE winner_certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID REFERENCES challenges(id),
  solver_id UUID REFERENCES auth.users(id),
  team_id UUID REFERENCES challenge_teams(id),
  place INT,
  prize_amount DECIMAL(12,2),
  certificate_url TEXT,
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  claimed BOOLEAN DEFAULT false
);
```

---

## 7. Notification System

### 7.1 Notification Types

```typescript
interface ChallengeNotification {
  type:
    | 'registration_confirmed'
    | 'team_invitation'
    | 'team_response'
    | 'submission_received'
    | 'deadline_reminder'
    | 'announcement'
    | 'judge_assignment'
    | 'results_available'
    | 'winner_notification'
    | 'sponsor_message';

  channels: ('email' | 'in-app' | 'push' | 'slack')[];

  data: {
    challengeId: string;
    userId: string;
    [key: string]: any;
  };
}
```

### 7.2 Email Templates

```
- challenge_registration_confirmed
- team_invitation_received
- team_join_accepted
- team_join_declined
- submission_received
- deadline_reminder_48h
- deadline_reminder_24h
- challenge_extended
- results_announced_winner
- results_announced_participant
- judge_invitation
- judge_deadline_reminder
- sponsor_new_submission
- sponsor_judging_complete
```

---

## 8. AI Integration

### 8.1 AI-Powered Features

```typescript
// Challenge Creation
interface AIBriefGenerator {
  generateProblemStatement(keywords: string[], industry: IndustryType): Promise<string>;
  suggestJudgingCriteria(challengeType: ChallengeType): Promise<JudgingCriteria[]>;
  recommendPrizeStructure(industry: IndustryType, duration: number): Promise<ChallengeAward[]>;
}

// Submission Evaluation
interface AIPreScreener {
  evaluateSubmission(submission: ChallengeSubmission): Promise<{
    score: number;
    strengths: string[];
    weaknesses: string[];
    plagiarismRisk: number;
    recommendations: string[];
  }>;
}

// Challenge Matching
interface AIRecommender {
  matchSolverToChallenges(userId: string): Promise<{
    challengeId: string;
    matchScore: number;
    reasons: string[];
  }[]>;

  suggestTeammates(userId: string, challengeId: string): Promise<{
    userId: string;
    compatibilityScore: number;
    complementarySkills: string[];
  }[]>;
}
```

---

## Implementation Priority

### Phase 1: Core Modals & Forms (Week 1-2)
- [ ] ChallengeRegistrationModal
- [ ] TeamFormationModal
- [ ] SubmissionWizard
- [ ] SubmissionConfirmationModal

### Phase 2: Dashboard & Management (Week 3-4)
- [ ] SolverChallengeDashboard
- [ ] SponsorChallengeDashboard
- [ ] ChallengeLeaderboard
- [ ] ChallengeDiscussion enhancements

### Phase 3: Judging System (Week 5-6)
- [ ] JudgeDashboard
- [ ] JudgeEvaluationForm
- [ ] Score aggregation logic
- [ ] WinnerAnnouncementModal

### Phase 4: AI & Analytics (Week 7-8)
- [ ] AI pre-screening integration
- [ ] Recommendation engine
- [ ] Analytics dashboard
- [ ] Certificate generation

---

*Document Version: 1.0*
*Last Updated: January 2026*
*Authors: STEMWORKFORCE Engineering & UX Team*
