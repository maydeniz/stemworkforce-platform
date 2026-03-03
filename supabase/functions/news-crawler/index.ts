// ===========================================
// News Crawler Edge Function
// Fetches STEM workforce news from RSS feeds and Google News
// Classifies, tags, scores, deduplicates, and stores articles
// Triggered on cron schedule (every 24 hours) or manually
// ===========================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { DOMParser } from 'https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// ===========================================
// RSS FEED SOURCES CONFIGURATION
// ===========================================

interface FeedSource {
  name: string;
  url: string;
  type: 'rss' | 'atom' | 'google_news';
  defaultCategory?: string;
  defaultAuthor?: string;
}

const RSS_FEEDS: FeedSource[] = [
  // Government / Policy sources
  {
    name: 'DOE News',
    url: 'https://www.energy.gov/rss/articles.xml',
    type: 'rss',
    defaultCategory: 'policy',
    defaultAuthor: 'Department of Energy',
  },
  {
    name: 'NSF News',
    url: 'https://www.nsf.gov/rss/rss_www_news.xml',
    type: 'rss',
    defaultCategory: 'policy',
    defaultAuthor: 'National Science Foundation',
  },
  {
    name: 'NIST News',
    url: 'https://www.nist.gov/news-events/news/rss.xml',
    type: 'rss',
    defaultCategory: 'technology',
    defaultAuthor: 'NIST',
  },

  // Google News - STEM workforce queries
  {
    name: 'STEM Workforce News',
    url: 'https://news.google.com/rss/search?q=STEM+workforce+policy+funding&hl=en-US&gl=US&ceid=US:en',
    type: 'google_news',
  },
  {
    name: 'Semiconductor Jobs',
    url: 'https://news.google.com/rss/search?q=semiconductor+workforce+jobs+CHIPS+Act&hl=en-US&gl=US&ceid=US:en',
    type: 'google_news',
  },
  {
    name: 'Nuclear Energy Workforce',
    url: 'https://news.google.com/rss/search?q=nuclear+energy+workforce+jobs+hiring&hl=en-US&gl=US&ceid=US:en',
    type: 'google_news',
  },
  {
    name: 'Quantum Computing Careers',
    url: 'https://news.google.com/rss/search?q=quantum+computing+careers+workforce+hiring&hl=en-US&gl=US&ceid=US:en',
    type: 'google_news',
  },
  {
    name: 'DOE National Labs',
    url: 'https://news.google.com/rss/search?q=DOE+national+laboratory+hiring+workforce&hl=en-US&gl=US&ceid=US:en',
    type: 'google_news',
  },
  {
    name: 'Cybersecurity Workforce',
    url: 'https://news.google.com/rss/search?q=cybersecurity+workforce+shortage+careers&hl=en-US&gl=US&ceid=US:en',
    type: 'google_news',
  },
  {
    name: 'Aerospace Defense STEM',
    url: 'https://news.google.com/rss/search?q=aerospace+defense+STEM+jobs+hiring&hl=en-US&gl=US&ceid=US:en',
    type: 'google_news',
  },
  {
    name: 'AI Workforce Trends',
    url: 'https://news.google.com/rss/search?q=artificial+intelligence+workforce+training+jobs&hl=en-US&gl=US&ceid=US:en',
    type: 'google_news',
  },
];

// ===========================================
// CATEGORY CLASSIFICATION KEYWORDS
// ===========================================

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  policy: [
    'funding', 'budget', 'legislation', 'congress', 'bill', 'act',
    'appropriation', 'executive order', 'regulation', 'doe ', ' nsf',
    'chips act', 'itar', 'export control', 'clearance', 'policy',
    'government', 'federal', 'bipartisan', 'investment', 'grant',
    'national security', 'ostp', 'white house', 'billion', 'million',
    'department of energy', 'national science foundation', 'announcement',
  ],
  workforce: [
    'hiring', 'recruitment', 'shortage', 'workforce', 'pipeline',
    'retention', 'salary', 'compensation', 'remote work', 'hybrid',
    'talent', 'skills gap', 'labor market', 'employment', 'jobs',
    'careers', 'job market', 'layoff', 'diversity', 'inclusion',
    'underrepresented', 'veteran', 'clearance processing', 'worker',
    'employer', 'employee', 'staffing', 'human resources',
  ],
  education: [
    'training', 'internship', 'fellowship', 'scholarship', 'suli',
    'university', 'college', 'student', 'graduate', 'doctoral',
    'curriculum', 'certification', 'boot camp', 'upskill', 'reskill',
    'apprenticeship', 'mentorship', 'program', 'course', 'degree',
    'community college', 'k-12', 'stem education', 'academic',
    'research experience', 'postdoc', 'faculty', 'professor',
  ],
  technology: [
    'semiconductor', 'quantum', ' ai ', 'artificial intelligence',
    'machine learning', 'nuclear', 'fusion', 'fission', 'reactor',
    'cybersecurity', 'aerospace', 'rocket', 'satellite', 'space',
    'robotics', 'autonomous', 'cloud', 'supercomputer', 'hpc',
    'battery', 'clean energy', 'solar', 'wind', 'hydrogen',
    'materials science', 'nanotechnology', 'biotech', 'chip',
    'fab ', 'fabrication', 'deep learning', 'neural network',
  ],
};

// ===========================================
// TAG EXTRACTION KEYWORDS
// ===========================================

const TAG_KEYWORDS: string[] = [
  'DOE', 'NSF', 'NIST', 'NASA', 'DARPA', 'DOD',
  'National Labs', 'CHIPS Act', 'ITAR', 'EAR',
  'Semiconductors', 'Quantum', 'AI', 'Nuclear', 'Fusion',
  'Cybersecurity', 'Aerospace', 'Robotics', 'HPC',
  'Clearance', 'Workforce', 'Internship', 'Fellowship',
  'SULI', 'Diversity', 'Training', 'Skills Gap',
  'Community College', 'Hiring', 'Funding',
  'Manufacturing', 'Clean Energy', 'Hydrogen',
];

// ===========================================
// IMAGE COLOR MAPPING
// ===========================================

const CATEGORY_COLORS: Record<string, string[]> = {
  policy: ['blue', 'indigo', 'purple'],
  workforce: ['amber', 'orange', 'rose'],
  education: ['emerald', 'teal', 'cyan'],
  technology: ['purple', 'violet', 'indigo'],
};

function getImageColor(category: string, index: number): string {
  const colors = CATEGORY_COLORS[category] || ['blue', 'indigo', 'purple'];
  return colors[index % colors.length];
}

// ===========================================
// CLASSIFICATION FUNCTIONS
// ===========================================

function classifyCategory(title: string, description: string, defaultCategory?: string): string {
  const text = ` ${title} ${description} `.toLowerCase();
  const scores: Record<string, number> = { policy: 0, workforce: 0, education: 0, technology: 0 };

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const keyword of keywords) {
      if (text.includes(keyword.toLowerCase())) {
        scores[category]++;
      }
    }
  }

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  if (sorted[0][1] > 0) return sorted[0][0];
  return defaultCategory || 'workforce';
}

function extractTags(title: string, description: string): string[] {
  const text = `${title} ${description}`;
  const tags: string[] = [];

  for (const tag of TAG_KEYWORDS) {
    if (text.toLowerCase().includes(tag.toLowerCase())) {
      tags.push(tag);
    }
  }

  return tags.slice(0, 5);
}

function calculateReadTime(text: string): number {
  const wordCount = text.split(/\s+/).length;
  const readTime = Math.ceil(wordCount / 200);
  return Math.max(3, Math.min(readTime, 12));
}

function calculateRelevanceScore(title: string, description: string, tags: string[]): number {
  let score = 0;
  const text = ` ${title} ${description} `.toLowerCase();

  const highValueKeywords = [
    'workforce', 'stem', 'national lab', 'doe', 'nsf',
    'semiconductor', 'nuclear', 'quantum', 'cybersecurity',
    'hiring', 'jobs', 'careers', 'funding', 'chips act',
  ];

  for (const keyword of highValueKeywords) {
    if (text.includes(keyword)) score += 12;
  }

  // Title matches are more valuable
  const titleLower = ` ${title} `.toLowerCase();
  for (const keyword of highValueKeywords) {
    if (titleLower.includes(keyword)) score += 8;
  }

  // More tags = more relevant
  score += tags.length * 4;

  return Math.min(score, 100);
}

// ===========================================
// DEDUPLICATION
// ===========================================

function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 100);
}

async function generateContentHash(title: string, url: string): Promise<string> {
  const data = new TextEncoder().encode(`${title}|${url}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 32);
}

// ===========================================
// RSS PARSING
// ===========================================

interface ParsedArticle {
  title: string;
  excerpt: string;
  sourceUrl: string;
  publishedAt: string;
  sourceName: string;
  sourceFeedUrl: string;
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function fetchAndParseRSS(feed: FeedSource): Promise<ParsedArticle[]> {
  const articles: ParsedArticle[] = [];

  try {
    const response = await fetch(feed.url, {
      headers: {
        'User-Agent': 'STEMWorkforce-NewsCrawler/1.0 (STEM workforce news aggregator)',
        'Accept': 'application/rss+xml, application/atom+xml, application/xml, text/xml, */*',
      },
    });

    if (!response.ok) {
      console.error(`Feed ${feed.name} returned ${response.status}`);
      return articles;
    }

    const text = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/xml');

    if (!doc) {
      console.error(`Failed to parse feed: ${feed.name}`);
      return articles;
    }

    // Handle RSS <item> or Atom <entry>
    const items = doc.querySelectorAll('item');
    const entries = doc.querySelectorAll('entry');
    const feedItems = items.length > 0 ? items : entries;

    // Take max 10 items per feed
    const maxItems = Math.min(feedItems.length, 10);

    for (let i = 0; i < maxItems; i++) {
      const item = feedItems[i];

      const title = item.querySelector('title')?.textContent?.trim();
      if (!title) continue;

      // Skip very short or generic titles
      if (title.length < 15) continue;

      // Get description/excerpt
      let excerpt = item.querySelector('description')?.textContent?.trim()
        || item.querySelector('summary')?.textContent?.trim()
        || item.querySelector('content')?.textContent?.trim()
        || '';

      // Strip HTML from excerpt and truncate
      excerpt = stripHtml(excerpt).substring(0, 350);

      // Get link
      let link = '';
      const linkEl = item.querySelector('link');
      if (linkEl) {
        link = linkEl.textContent?.trim() || linkEl.getAttribute('href') || '';
      }

      if (!link) continue;

      // Get published date
      const pubDate = item.querySelector('pubDate')?.textContent?.trim()
        || item.querySelector('published')?.textContent?.trim()
        || item.querySelector('updated')?.textContent?.trim()
        || '';

      let publishedAt: string;
      try {
        publishedAt = pubDate ? new Date(pubDate).toISOString() : new Date().toISOString();
      } catch {
        publishedAt = new Date().toISOString();
      }

      // Skip articles older than 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      if (new Date(publishedAt) < thirtyDaysAgo) continue;

      // Extract source name for Google News
      let sourceName = feed.defaultAuthor || feed.name;
      if (feed.type === 'google_news') {
        const sourceEl = item.querySelector('source');
        if (sourceEl?.textContent) {
          sourceName = sourceEl.textContent.trim();
        }
      }

      articles.push({
        title,
        excerpt: excerpt || `${title}. Read more at ${sourceName}.`,
        sourceUrl: link,
        publishedAt,
        sourceName,
        sourceFeedUrl: feed.url,
      });
    }
  } catch (err) {
    console.error(`Error fetching feed ${feed.name}:`, err);
  }

  return articles;
}

// ===========================================
// MAIN HANDLER
// ===========================================

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // SECURITY: Server-to-server auth — require service role key in Authorization header
    const authHeader = req.headers.get('Authorization');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    if (!authHeader || authHeader.replace('Bearer ', '') !== serviceRoleKey) {
      return new Response(JSON.stringify({ error: 'Unauthorized: service role key required' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      serviceRoleKey
    );

    // Create crawl job record
    const { data: crawlJob } = await supabase
      .from('blog_crawl_jobs')
      .insert({ status: 'running', started_at: new Date().toISOString() })
      .select()
      .single();

    const jobId = crawlJob?.id;
    let feedsProcessed = 0;
    let articlesFound = 0;
    let articlesCreated = 0;
    let articlesSkipped = 0;
    const errors: Array<{ feed: string; error: string }> = [];

    console.log(`[news-crawler] Starting crawl of ${RSS_FEEDS.length} feeds...`);

    // Process all feeds
    for (const feed of RSS_FEEDS) {
      try {
        console.log(`[news-crawler] Fetching: ${feed.name}`);
        const articles = await fetchAndParseRSS(feed);
        feedsProcessed++;
        articlesFound += articles.length;

        for (const article of articles) {
          try {
            // Generate content hash for deduplication
            const contentHash = await generateContentHash(article.title, article.sourceUrl);
            const titleNormalized = normalizeTitle(article.title);

            // Check for duplicates
            const { data: existing } = await supabase
              .from('blog_posts')
              .select('id')
              .or(`content_hash.eq.${contentHash},title_normalized.eq.${titleNormalized}`)
              .limit(1);

            if (existing && existing.length > 0) {
              articlesSkipped++;
              continue;
            }

            // Classify and enrich
            const category = classifyCategory(article.title, article.excerpt, feed.defaultCategory);
            const tags = extractTags(article.title, article.excerpt);
            const readTime = calculateReadTime(`${article.title} ${article.excerpt}`);
            const relevanceScore = calculateRelevanceScore(article.title, article.excerpt, tags);
            const featured = relevanceScore >= 70;
            const imageColor = getImageColor(category, articlesCreated);

            // Insert article
            const { error: insertError } = await supabase
              .from('blog_posts')
              .insert({
                title: article.title,
                excerpt: article.excerpt,
                category,
                author: article.sourceName,
                published_at: article.publishedAt,
                read_time: readTime,
                featured,
                tags,
                image_color: imageColor,
                source_url: article.sourceUrl,
                source_name: article.sourceName,
                source_feed_url: article.sourceFeedUrl,
                content_hash: contentHash,
                title_normalized: titleNormalized,
                relevance_score: relevanceScore,
                status: 'published',
              });

            if (insertError) {
              if (insertError.code === '23505') {
                // Duplicate URL constraint violation - skip
                articlesSkipped++;
              } else {
                console.error(`Insert error for "${article.title}":`, insertError.message);
                articlesSkipped++;
              }
            } else {
              articlesCreated++;
            }
          } catch (articleErr: any) {
            articlesSkipped++;
            console.error(`Error processing article "${article.title}":`, articleErr.message);
          }
        }

        // Rate limiting between feeds (1 second)
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (feedErr: any) {
        errors.push({ feed: feed.name, error: feedErr.message || String(feedErr) });
        console.error(`Feed error ${feed.name}:`, feedErr.message);
      }
    }

    // Post-processing: cap featured posts at 4
    const { data: featuredPosts } = await supabase
      .from('blog_posts')
      .select('id')
      .eq('featured', true)
      .eq('status', 'published')
      .order('relevance_score', { ascending: false })
      .order('published_at', { ascending: false });

    if (featuredPosts && featuredPosts.length > 4) {
      const toUnfeature = featuredPosts.slice(4).map(p => p.id);
      await supabase
        .from('blog_posts')
        .update({ featured: false })
        .in('id', toUnfeature);
    }

    // Archive articles older than 90 days
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    await supabase
      .from('blog_posts')
      .update({ status: 'archived' })
      .eq('status', 'published')
      .lt('published_at', ninetyDaysAgo.toISOString());

    // Update crawl job record
    if (jobId) {
      await supabase
        .from('blog_crawl_jobs')
        .update({
          status: errors.length > 0 && feedsProcessed === 0 ? 'failed' : 'completed',
          completed_at: new Date().toISOString(),
          feeds_processed: feedsProcessed,
          articles_found: articlesFound,
          articles_created: articlesCreated,
          articles_skipped: articlesSkipped,
          errors,
        })
        .eq('id', jobId);
    }

    const result = {
      success: true,
      feedsProcessed,
      articlesFound,
      articlesCreated,
      articlesSkipped,
      errors: errors.length,
    };

    console.log(`[news-crawler] Complete:`, result);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('[news-crawler] Fatal error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
