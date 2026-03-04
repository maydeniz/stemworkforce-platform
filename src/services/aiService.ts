// ===========================================
// AI SERVICE FOR CHALLENGE PLATFORM
// Integrates with Claude, Gemini, and ChatGPT
// Features: Brief generation, submission evaluation, feedback
// ===========================================

import { supabase } from '@/lib/supabase';
import {
  AIProvider,
  AIServiceConfig,
  AIGenerationResponse,
  AISubmissionEvaluation,
  Challenge,
  ChallengeSubmission,
  JudgingCriteria,
} from '@/types';

// ===========================================
// CONFIGURATION
// ===========================================

const AI_CONFIGS: Record<AIProvider, AIServiceConfig> = {
  claude: {
    provider: 'claude',
    enabled: true,
    apiKeyConfigured: false,
    apiEndpoint: '/api/ai/claude',
    model: 'claude-3-sonnet-20240229',
    maxTokens: 4096,
    temperature: 0.7,
  },
  gemini: {
    provider: 'gemini',
    enabled: true,
    apiKeyConfigured: false,
    apiEndpoint: '/api/ai/gemini',
    model: 'gemini-pro',
    maxTokens: 4096,
    temperature: 0.7,
  },
  chatgpt: {
    provider: 'chatgpt',
    enabled: true,
    apiKeyConfigured: false,
    apiEndpoint: '/api/ai/chatgpt',
    model: 'gpt-4-turbo-preview',
    maxTokens: 4096,
    temperature: 0.7,
  },
};

// Default provider - can be changed via admin settings
let defaultProvider: AIProvider = 'claude';

// ===========================================
// PROMPT TEMPLATES
// ===========================================

const PROMPTS = {
  // Challenge Brief Generation
  generateBrief: (data: {
    title: string;
    industry: string;
    problemStatement: string;
    goals: string[];
    constraints?: string[];
  }) => `
You are an expert innovation challenge designer. Generate a comprehensive challenge brief based on the following information:

**Challenge Title:** ${data.title}
**Industry:** ${data.industry}
**Problem Statement:** ${data.problemStatement}
**Goals:** ${data.goals.join(', ')}
${data.constraints ? `**Constraints:** ${data.constraints.join(', ')}` : ''}

Please generate a detailed challenge brief that includes:
1. **Executive Summary** (2-3 paragraphs explaining the challenge and its importance)
2. **Background & Context** (industry context, why this matters now)
3. **Technical Requirements** (specific technical deliverables expected)
4. **Evaluation Criteria** (how submissions will be judged)
5. **Success Metrics** (what a winning solution looks like)

Format your response in Markdown with clear section headers.
`,

  // Submission Screening/Evaluation
  evaluateSubmission: (data: {
    challengeTitle: string;
    challengeDescription: string;
    criteria: JudgingCriteria[];
    submissionTitle: string;
    submissionDescription: string;
    technicalApproach?: string;
  }) => `
You are an expert judge for innovation challenges. Evaluate the following submission against the challenge criteria.

**Challenge:** ${data.challengeTitle}
**Challenge Description:** ${data.challengeDescription}

**Judging Criteria:**
${data.criteria.map(c => `- ${c.name} (${c.weight}%): ${c.description}`).join('\n')}

**Submission:** ${data.submissionTitle}
**Description:** ${data.submissionDescription}
${data.technicalApproach ? `**Technical Approach:** ${data.technicalApproach}` : ''}

Please provide:
1. **Overall Assessment** (brief summary of the submission quality)
2. **Criteria Scores** (score each criterion from 0-100 with justification)
3. **Strengths** (list 3-5 key strengths)
4. **Areas for Improvement** (list 3-5 areas that need work)
5. **Recommendation** (ADVANCE, NEEDS_REVISION, or REJECT with explanation)

Be constructive but thorough in your evaluation.
`,

  // Feedback Generation for Solvers
  generateFeedback: (data: {
    submissionTitle: string;
    evaluation: AISubmissionEvaluation;
    criteriaScores: { criterion: string; score: number; maxScore: number }[];
  }) => `
You are a helpful mentor providing constructive feedback to an innovation challenge participant.

**Submission:** ${data.submissionTitle}
**Overall Score:** ${data.evaluation.overallScore}/100
**Recommendation:** ${data.evaluation.recommendation}

**Scores by Criteria:**
${data.criteriaScores.map(s => `- ${s.criterion}: ${s.score}/${s.maxScore}`).join('\n')}

**Identified Strengths:**
${data.evaluation.strengths.join('\n')}

**Areas for Improvement:**
${data.evaluation.improvements.join('\n')}

Please write a friendly, encouraging feedback message (300-500 words) that:
1. Acknowledges their effort and highlights their strongest points
2. Explains the areas where improvement is needed in constructive terms
3. Provides specific, actionable suggestions for enhancement
4. Encourages them to continue innovating

Keep the tone professional but warm and supportive.
`,

  // Team Matching Suggestions
  suggestTeammates: (data: {
    challengeTitle: string;
    challengeSkills: string[];
    solverProfile: {
      skills: string[];
      experience: string;
      lookingFor: string[];
    };
    availableSolvers: {
      id: string;
      name: string;
      skills: string[];
      experience: string;
    }[];
  }) => `
You are an expert at building high-performing innovation teams.

**Challenge:** ${data.challengeTitle}
**Required Skills:** ${data.challengeSkills.join(', ')}

**Current Solver:**
- Skills: ${data.solverProfile.skills.join(', ')}
- Experience: ${data.solverProfile.experience}
- Looking for teammates with: ${data.solverProfile.lookingFor.join(', ')}

**Available Solvers:**
${data.availableSolvers.map(s => `- ${s.name}: ${s.skills.join(', ')} (${s.experience})`).join('\n')}

Please suggest the top 3 best potential teammates and explain why they would be a good match. Consider:
1. Complementary skills
2. Experience level compatibility
3. Coverage of required challenge skills

Format as a ranked list with explanations.
`,

  // Solution Improvement Suggestions
  improveSolution: (data: {
    challengeRequirements: string[];
    currentSolution: string;
    weakAreas: string[];
  }) => `
You are a technical advisor helping improve an innovation challenge solution.

**Challenge Requirements:**
${data.challengeRequirements.map((r, i) => `${i + 1}. ${r}`).join('\n')}

**Current Solution Approach:**
${data.currentSolution}

**Areas Identified for Improvement:**
${data.weakAreas.map(a => `- ${a}`).join('\n')}

Please provide specific, actionable recommendations to strengthen this solution:
1. Technical improvements
2. Better alignment with requirements
3. Innovative approaches to consider
4. Resources or references that might help

Be specific and practical in your suggestions.
`,

  // Career Guidance with CareerNet RAG context
  careerGuidance: (data: {
    studentQuestion: string;
    relevantQA: { questionTitle: string; answerBody: string }[];
    industry?: string;
  }) => `
You are an expert career advisor specializing in STEM careers. A student is seeking career guidance.

**Student's Question:** ${data.studentQuestion}
${data.industry ? `**Industry Focus:** ${data.industry}` : ''}

${data.relevantQA.length > 0 ? `Here are relevant expert answers from CareerVillage.org to inform your response:

${data.relevantQA.map((qa, i) => `--- Expert Answer ${i + 1} ---
Q: ${qa.questionTitle}
A: ${qa.answerBody}
`).join('\n')}` : ''}

Please provide personalized career guidance that:
1. Directly addresses the student's specific question
2. Synthesizes insights from the expert answers above when available
3. Provides specific, actionable next steps
4. Mentions relevant resources, programs, or certifications
5. Is encouraging and supportive

When referencing specific advice from the expert answers, cite CareerVillage.org as a source.
Keep the response concise (200-400 words) and practical.
`,
};

// ===========================================
// CORE AI SERVICE FUNCTIONS
// ===========================================

/**
 * Call the AI provider API
 */
async function callAI(
  prompt: string,
  provider: AIProvider = defaultProvider,
  options?: Partial<AIServiceConfig>
): Promise<AIGenerationResponse> {
  const config = { ...AI_CONFIGS[provider], ...options };
  const startTime = Date.now();

  try {
    // In production, this would call actual AI APIs
    // For now, we'll use Supabase Edge Functions as proxies
    const { data, error } = await supabase.functions.invoke('ai-generate', {
      body: {
        provider,
        model: config.model,
        prompt,
        maxTokens: config.maxTokens,
        temperature: config.temperature,
      },
    });

    if (error) throw error;

    const response: AIGenerationResponse = {
      success: true,
      content: data.content,
      provider,
      model: config.model || '',
      tokensUsed: data.tokensUsed || 0,
      cached: false,
      generatedAt: new Date().toISOString(),
    };

    // Log the AI call for analytics
    await logAICall(provider, 'generate', startTime, true);

    return response;
  } catch (error) {
    console.error(`AI ${provider} error:`, error);

    // Log failed call
    await logAICall(provider, 'generate', startTime, false, error);

    return {
      success: false,
      content: '',
      provider,
      model: config.model || '',
      tokensUsed: 0,
      cached: false,
      generatedAt: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Log AI API calls for analytics and billing
 */
async function logAICall(
  provider: AIProvider,
  operation: string,
  startTime: number,
  success: boolean,
  error?: unknown
): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    await supabase.from('ai_evaluation_logs').insert({
      provider,
      operation,
      model: AI_CONFIGS[provider].model,
      tokens_used: 0, // Will be updated from response
      processing_time_ms: Date.now() - startTime,
      status: success ? 'completed' : 'failed',
      error_message: error instanceof Error ? error.message : undefined,
      created_by: user?.id,
    });
  } catch (logError) {
    console.error('Failed to log AI call:', logError);
  }
}

// ===========================================
// CHALLENGE BRIEF GENERATION
// ===========================================

export interface BriefGenerationInput {
  title: string;
  industry: string;
  problemStatement: string;
  goals: string[];
  constraints?: string[];
}

export interface GeneratedBrief {
  executiveSummary: string;
  background: string;
  technicalRequirements: string;
  evaluationCriteria: string;
  successMetrics: string;
  fullMarkdown: string;
}

/**
 * Generate a comprehensive challenge brief using AI
 */
export async function generateChallengeBrief(
  input: BriefGenerationInput,
  provider?: AIProvider
): Promise<{ success: boolean; brief?: GeneratedBrief; error?: string }> {
  const prompt = PROMPTS.generateBrief(input);
  const response = await callAI(prompt, provider);

  if (!response.success) {
    return { success: false, error: response.error };
  }

  // Parse the markdown response into sections
  const sections = parseMarkdownSections(response.content);

  return {
    success: true,
    brief: {
      executiveSummary: sections['Executive Summary'] || '',
      background: sections['Background & Context'] || sections['Background'] || '',
      technicalRequirements: sections['Technical Requirements'] || '',
      evaluationCriteria: sections['Evaluation Criteria'] || '',
      successMetrics: sections['Success Metrics'] || '',
      fullMarkdown: response.content,
    },
  };
}

// ===========================================
// SUBMISSION EVALUATION
// ===========================================

export interface SubmissionEvaluationInput {
  challenge: Challenge;
  submission: ChallengeSubmission;
}

/**
 * Evaluate a submission using AI
 */
export async function evaluateSubmission(
  input: SubmissionEvaluationInput,
  provider?: AIProvider
): Promise<{ success: boolean; evaluation?: AISubmissionEvaluation; error?: string }> {
  const { challenge, submission } = input;

  const prompt = PROMPTS.evaluateSubmission({
    challengeTitle: challenge.title,
    challengeDescription: challenge.description,
    criteria: challenge.judgingCriteria,
    submissionTitle: submission.title,
    submissionDescription: submission.description,
    technicalApproach: submission.technicalApproach,
  });

  const response = await callAI(prompt, provider);

  if (!response.success) {
    return { success: false, error: response.error };
  }

  // Parse the evaluation response
  const evaluation = parseEvaluationResponse(response.content, challenge.judgingCriteria);

  // Store the evaluation in the database
  try {
    const { data: { user } } = await supabase.auth.getUser();

    await supabase.from('ai_evaluation_logs').insert({
      submission_id: submission.id,
      challenge_id: challenge.id,
      provider: provider || defaultProvider,
      model: AI_CONFIGS[provider || defaultProvider].model,
      evaluation_data: evaluation,
      status: 'completed',
      created_by: user?.id,
    });
  } catch (dbError) {
    console.error('Failed to store evaluation:', dbError);
  }

  return { success: true, evaluation };
}

/**
 * Generate constructive feedback for a solver based on their evaluation
 */
export async function generateSolverFeedback(
  submission: ChallengeSubmission,
  evaluation: AISubmissionEvaluation,
  provider?: AIProvider
): Promise<{ success: boolean; feedback?: string; error?: string }> {
  const criteriaScores = evaluation.criteriaScores.map(s => ({
    criterion: s.criterionId ?? '',
    score: s.score,
    maxScore: 100,
  }));

  const prompt = PROMPTS.generateFeedback({
    submissionTitle: submission.title,
    evaluation,
    criteriaScores,
  });

  const response = await callAI(prompt, provider);

  if (!response.success) {
    return { success: false, error: response.error };
  }

  return { success: true, feedback: response.content };
}

// ===========================================
// TEAM MATCHING
// ===========================================

export interface TeamMatchInput {
  challengeId: string;
  solverProfile: {
    skills: string[];
    experience: string;
    lookingFor: string[];
  };
}

export interface TeamMatchSuggestion {
  solverId: string;
  name: string;
  skills: string[];
  matchScore: number;
  matchReason: string;
}

/**
 * Get AI-powered team matching suggestions
 */
export async function getTeamMatchSuggestions(
  input: TeamMatchInput,
  provider?: AIProvider
): Promise<{ success: boolean; suggestions?: TeamMatchSuggestion[]; error?: string }> {
  // First, get challenge details and available solvers
  const { data: challenge, error: challengeError } = await supabase
    .from('challenges')
    .select('title, required_skills')
    .eq('id', input.challengeId)
    .single();

  if (challengeError || !challenge) {
    return { success: false, error: 'Challenge not found' };
  }

  // Get solvers looking for teams
  const { data: solvers, error: solversError } = await supabase
    .from('challenge_solvers')
    .select(`
      id,
      user_id,
      display_name,
      skills,
      experience_level
    `)
    .eq('challenge_id', input.challengeId)
    .eq('looking_for_team', true)
    .limit(20);

  if (solversError) {
    return { success: false, error: 'Failed to fetch available solvers' };
  }

  if (!solvers || solvers.length === 0) {
    return { success: true, suggestions: [] };
  }

  const prompt = PROMPTS.suggestTeammates({
    challengeTitle: challenge.title,
    challengeSkills: challenge.required_skills || [],
    solverProfile: input.solverProfile,
    availableSolvers: solvers.map(s => ({
      id: s.id,
      name: s.display_name || 'Anonymous',
      skills: s.skills || [],
      experience: s.experience_level || 'intermediate',
    })),
  });

  const response = await callAI(prompt, provider);

  if (!response.success) {
    return { success: false, error: response.error };
  }

  // Parse suggestions from response
  const suggestions = parseTeamSuggestions(response.content, solvers);

  return { success: true, suggestions };
}

// ===========================================
// SOLUTION IMPROVEMENT
// ===========================================

export interface SolutionImprovementInput {
  challengeId: string;
  currentSolution: string;
  weakAreas?: string[];
}

/**
 * Get AI suggestions to improve a solution
 */
export async function getSolutionImprovements(
  input: SolutionImprovementInput,
  provider?: AIProvider
): Promise<{ success: boolean; improvements?: string; error?: string }> {
  // Get challenge requirements
  const { data: challenge, error: challengeError } = await supabase
    .from('challenges')
    .select('requirements')
    .eq('id', input.challengeId)
    .single();

  if (challengeError || !challenge) {
    return { success: false, error: 'Challenge not found' };
  }

  const requirements = challenge.requirements as { technical?: string[] } | null;

  const prompt = PROMPTS.improveSolution({
    challengeRequirements: requirements?.technical || [],
    currentSolution: input.currentSolution,
    weakAreas: input.weakAreas || [],
  });

  const response = await callAI(prompt, provider);

  if (!response.success) {
    return { success: false, error: response.error };
  }

  return { success: true, improvements: response.content };
}

// ===========================================
// HELPER FUNCTIONS
// ===========================================

/**
 * Parse markdown content into sections by headers
 */
function parseMarkdownSections(content: string): Record<string, string> {
  const sections: Record<string, string> = {};
  const lines = content.split('\n');
  let currentSection = '';
  let currentContent: string[] = [];

  for (const line of lines) {
    const headerMatch = line.match(/^##?\s+\*?\*?(.+?)\*?\*?\s*$/);
    if (headerMatch) {
      if (currentSection) {
        sections[currentSection] = currentContent.join('\n').trim();
      }
      currentSection = headerMatch[1].replace(/\*/g, '').trim();
      currentContent = [];
    } else {
      currentContent.push(line);
    }
  }

  if (currentSection) {
    sections[currentSection] = currentContent.join('\n').trim();
  }

  return sections;
}

/**
 * Parse AI evaluation response into structured format
 */
function parseEvaluationResponse(
  content: string,
  criteria: JudgingCriteria[]
): AISubmissionEvaluation {
  const sections = parseMarkdownSections(content);

  // Extract criteria scores - simplified parsing
  const criteriaScores = criteria.map(c => {
    // Try to find score in content
    const scoreMatch = content.match(new RegExp(`${c.name}[:\\s]*([0-9]+)`, 'i'));
    return {
      criterionId: c.id,
      criterionName: c.name,
      score: scoreMatch ? parseInt(scoreMatch[1], 10) : 70,
      maxScore: 100,
      feedback: '',
    };
  });

  // Calculate overall score
  let totalWeight = 0;
  let weightedScore = 0;
  criteriaScores.forEach((score, index) => {
    const weight = criteria[index]?.weight || 1;
    totalWeight += weight;
    weightedScore += score.score * weight;
  });
  const overallScore = totalWeight > 0 ? Math.round(weightedScore / totalWeight) : 0;

  // Parse strengths and improvements
  const strengthsSection = sections['Strengths'] || '';
  const improvementsSection = sections['Areas for Improvement'] || '';

  const strengths = strengthsSection
    .split('\n')
    .filter(line => line.trim().startsWith('-') || line.trim().match(/^\d+\./))
    .map(line => line.replace(/^[-\d.]\s*/, '').trim())
    .filter(Boolean);

  const improvements = improvementsSection
    .split('\n')
    .filter(line => line.trim().startsWith('-') || line.trim().match(/^\d+\./))
    .map(line => line.replace(/^[-\d.]\s*/, '').trim())
    .filter(Boolean);

  // Parse recommendation
  let recommendation: 'advance' | 'needs_revision' | 'reject' = 'needs_revision';
  const recommendationSection = sections['Recommendation'] || content;
  if (recommendationSection.toLowerCase().includes('advance')) {
    recommendation = 'advance';
  } else if (recommendationSection.toLowerCase().includes('reject')) {
    recommendation = 'reject';
  }

  return {
    overallScore,
    criteriaScores,
    strengths: strengths.length > 0 ? strengths : ['Submission received'],
    improvements: improvements.length > 0 ? improvements : ['Review pending'],
    recommendation,
    summary: sections['Overall Assessment'] || 'Evaluation complete.',
    evaluatedAt: new Date().toISOString(),
  };
}

/**
 * Parse team suggestions from AI response
 */
function parseTeamSuggestions(
  content: string,
  solvers: Array<{ id: string; display_name: string | null; skills: string[] | null }>
): TeamMatchSuggestion[] {
  const suggestions: TeamMatchSuggestion[] = [];

  // Simple parsing - look for solver names in the response
  for (const solver of solvers) {
    const name = solver.display_name || 'Anonymous';
    if (content.includes(name)) {
      suggestions.push({
        solverId: solver.id,
        name,
        skills: solver.skills || [],
        matchScore: 80, // Default score
        matchReason: 'Identified as a good match by AI analysis',
      });
    }
  }

  // Limit to top 3
  return suggestions.slice(0, 3);
}

// ===========================================
// ADMIN / CONFIGURATION
// ===========================================

/**
 * Set the default AI provider
 */
export function setDefaultProvider(provider: AIProvider): void {
  defaultProvider = provider;
}

/**
 * Get current default provider
 */
export function getDefaultProvider(): AIProvider {
  return defaultProvider;
}

/**
 * Get available providers
 */
export function getAvailableProviders(): AIProvider[] {
  return ['claude', 'gemini', 'chatgpt'];
}

/**
 * Test AI provider connectivity
 */
export async function testProviderConnection(
  provider: AIProvider
): Promise<{ success: boolean; latency?: number; error?: string }> {
  const startTime = Date.now();

  try {
    const response = await callAI('Say "Hello, I am working!" in exactly 5 words.', provider);

    return {
      success: response.success,
      latency: Date.now() - startTime,
      error: response.error,
    };
  } catch (error) {
    return {
      success: false,
      latency: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Connection failed',
    };
  }
}

// ===========================================
// BATCH OPERATIONS
// ===========================================

/**
 * Batch evaluate multiple submissions
 */
export async function batchEvaluateSubmissions(
  challenge: Challenge,
  submissions: ChallengeSubmission[],
  provider?: AIProvider,
  onProgress?: (completed: number, total: number) => void
): Promise<{
  results: Array<{ submissionId: string; evaluation?: AISubmissionEvaluation; error?: string }>;
  successCount: number;
  failureCount: number;
}> {
  const results: Array<{ submissionId: string; evaluation?: AISubmissionEvaluation; error?: string }> = [];
  let successCount = 0;
  let failureCount = 0;

  for (let i = 0; i < submissions.length; i++) {
    const submission = submissions[i];
    const result = await evaluateSubmission({ challenge, submission }, provider);

    if (result.success && result.evaluation) {
      results.push({ submissionId: submission.id, evaluation: result.evaluation });
      successCount++;
    } else {
      results.push({ submissionId: submission.id, error: result.error });
      failureCount++;
    }

    onProgress?.(i + 1, submissions.length);

    // Rate limiting - wait between requests
    if (i < submissions.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  return { results, successCount, failureCount };
}

// ===========================================
// EXPORTS
// ===========================================

export const aiService = {
  // Brief generation
  generateChallengeBrief,

  // Evaluation
  evaluateSubmission,
  generateSolverFeedback,
  batchEvaluateSubmissions,

  // Team matching
  getTeamMatchSuggestions,

  // Solution improvement
  getSolutionImprovements,

  // Configuration
  setDefaultProvider,
  getDefaultProvider,
  getAvailableProviders,
  testProviderConnection,
};

export default aiService;
