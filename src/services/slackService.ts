// ===========================================
// SLACK INTEGRATION SERVICE
// Channel management, notifications, team messaging
// For challenge platform communication
// ===========================================

import { supabase } from '@/lib/supabase';
import {
  SlackChannel,
  SlackNotification,
  SlackBlock,
  Challenge,
  ChallengeTeam,
  ChallengeSubmission,
} from '@/types';

// ===========================================
// CONFIGURATION
// ===========================================

interface SlackConfig {
  apiEndpoint: string;
  botToken?: string;
  signingSecret?: string;
  defaultWorkspaceId?: string;
}

const config: SlackConfig = {
  apiEndpoint: '/api/slack',
};

// ===========================================
// CHANNEL TYPES
// ===========================================

type ChannelType =
  | 'challenge-general'      // Main challenge discussion
  | 'challenge-announcements' // Official announcements only
  | 'challenge-qa'           // Q&A with organizers
  | 'team-private'           // Private team channel
  | 'judges-private'         // Judges discussion
  | 'sponsors-private';      // Sponsors coordination

interface ChannelConfig {
  type: ChannelType;
  prefix: string;
  isPrivate: boolean;
  description: string;
}

const CHANNEL_CONFIGS: Record<ChannelType, ChannelConfig> = {
  'challenge-general': {
    type: 'challenge-general',
    prefix: 'ch',
    isPrivate: false,
    description: 'General discussion for challenge participants',
  },
  'challenge-announcements': {
    type: 'challenge-announcements',
    prefix: 'ch-announce',
    isPrivate: false,
    description: 'Official announcements from organizers',
  },
  'challenge-qa': {
    type: 'challenge-qa',
    prefix: 'ch-qa',
    isPrivate: false,
    description: 'Q&A with challenge organizers',
  },
  'team-private': {
    type: 'team-private',
    prefix: 'team',
    isPrivate: true,
    description: 'Private team collaboration space',
  },
  'judges-private': {
    type: 'judges-private',
    prefix: 'judges',
    isPrivate: true,
    description: 'Private channel for judges',
  },
  'sponsors-private': {
    type: 'sponsors-private',
    prefix: 'sponsors',
    isPrivate: true,
    description: 'Private channel for sponsors',
  },
};

// ===========================================
// CHANNEL MANAGEMENT
// ===========================================

/**
 * Generate a Slack-safe channel name
 */
function generateChannelName(prefix: string, name: string, id?: string): string {
  const safeName = name
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 50);

  const suffix = id ? `-${id.substring(0, 8)}` : '';
  return `${prefix}-${safeName}${suffix}`;
}

/**
 * Create a Slack channel for a challenge
 */
export async function createChallengeChannel(
  challenge: Challenge,
  channelType: ChannelType
): Promise<{ success: boolean; channel?: SlackChannel; error?: string }> {
  const channelConfig = CHANNEL_CONFIGS[channelType];

  const channelName = generateChannelName(
    channelConfig.prefix,
    challenge.slug,
    challenge.id
  );

  try {
    const { data, error } = await supabase.functions.invoke('slack-channel', {
      body: {
        action: 'create',
        name: channelName,
        isPrivate: channelConfig.isPrivate,
        description: `${channelConfig.description} - ${challenge.title}`,
        topic: challenge.shortDescription,
        metadata: {
          challengeId: challenge.id,
          channelType,
        },
      },
    });

    if (error) throw error;

    const channel: SlackChannel = {
      id: data.channelId,
      name: channelName,
      isPrivate: channelConfig.isPrivate,
      topic: challenge.shortDescription,
      purpose: channelConfig.description,
      memberCount: 0,
      createdAt: new Date().toISOString(),
    };

    // Log the integration
    await logSlackAction('channel_created', {
      channelId: channel.id,
      channelName,
      challengeId: challenge.id,
      channelType,
    });

    return { success: true, channel };
  } catch (error) {
    console.error('Failed to create Slack channel:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create channel',
    };
  }
}

/**
 * Create a private team channel
 */
export async function createTeamChannel(
  team: ChallengeTeam,
  challengeSlug: string
): Promise<{ success: boolean; channel?: SlackChannel; error?: string }> {
  const channelName = generateChannelName('team', team.name, team.id);

  try {
    const { data, error } = await supabase.functions.invoke('slack-channel', {
      body: {
        action: 'create',
        name: channelName,
        isPrivate: true,
        description: `Private team channel for ${team.name}`,
        topic: `Team ${team.name} - Challenge: ${challengeSlug}`,
        metadata: {
          teamId: team.id,
          challengeId: team.challengeId,
          channelType: 'team-private',
        },
      },
    });

    if (error) throw error;

    const channel: SlackChannel = {
      id: data.channelId,
      name: channelName,
      isPrivate: true,
      topic: `Team ${team.name}`,
      purpose: 'Private team collaboration space',
      memberCount: team.memberCount,
      createdAt: new Date().toISOString(),
    };

    // Update team with channel info
    await supabase
      .from('challenge_teams')
      .update({ slack_channel_id: channel.id })
      .eq('id', team.id);

    await logSlackAction('team_channel_created', {
      channelId: channel.id,
      teamId: team.id,
      challengeId: team.challengeId,
    });

    return { success: true, channel };
  } catch (error) {
    console.error('Failed to create team channel:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create team channel',
    };
  }
}

/**
 * Archive a Slack channel
 */
export async function archiveChannel(
  channelId: string,
  reason?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.functions.invoke('slack-channel', {
      body: {
        action: 'archive',
        channelId,
        reason,
      },
    });

    if (error) throw error;

    await logSlackAction('channel_archived', { channelId, reason });

    return { success: true };
  } catch (error) {
    console.error('Failed to archive channel:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to archive channel',
    };
  }
}

/**
 * Invite users to a channel
 */
export async function inviteToChannel(
  channelId: string,
  userEmails: string[]
): Promise<{ success: boolean; invited: number; failed: number; error?: string }> {
  try {
    const { data, error } = await supabase.functions.invoke('slack-channel', {
      body: {
        action: 'invite',
        channelId,
        emails: userEmails,
      },
    });

    if (error) throw error;

    await logSlackAction('users_invited', {
      channelId,
      invitedCount: data.invited,
      failedCount: data.failed,
    });

    return {
      success: true,
      invited: data.invited || 0,
      failed: data.failed || 0,
    };
  } catch (error) {
    console.error('Failed to invite users:', error);
    return {
      success: false,
      invited: 0,
      failed: userEmails.length,
      error: error instanceof Error ? error.message : 'Failed to invite users',
    };
  }
}

// ===========================================
// NOTIFICATIONS
// ===========================================

/**
 * Send a notification to a Slack channel
 */
export async function sendNotification(
  notification: SlackNotification
): Promise<{ success: boolean; messageTs?: string; error?: string }> {
  try {
    const blocks = buildNotificationBlocks(notification);

    const { data, error } = await supabase.functions.invoke('slack-message', {
      body: {
        channelId: notification.channelId,
        text: notification.text,
        blocks,
        metadata: notification.metadata,
      },
    });

    if (error) throw error;

    await logSlackAction('notification_sent', {
      channelId: notification.channelId,
      type: notification.type,
      messageTs: data.ts,
    });

    return { success: true, messageTs: data.ts };
  } catch (error) {
    console.error('Failed to send notification:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send notification',
    };
  }
}

/**
 * Send a direct message to a user
 */
export async function sendDirectMessage(
  userEmail: string,
  message: string,
  blocks?: SlackBlock[]
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.functions.invoke('slack-message', {
      body: {
        action: 'dm',
        email: userEmail,
        text: message,
        blocks,
      },
    });

    if (error) throw error;

    await logSlackAction('dm_sent', { userEmail });

    return { success: true };
  } catch (error) {
    console.error('Failed to send DM:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send message',
    };
  }
}

// ===========================================
// NOTIFICATION TEMPLATES
// ===========================================

type NotificationType =
  | 'challenge_launched'
  | 'challenge_phase_started'
  | 'challenge_deadline_reminder'
  | 'challenge_ended'
  | 'submission_received'
  | 'submission_evaluated'
  | 'team_formed'
  | 'team_join_request'
  | 'announcement'
  | 'winner_announced';

/**
 * Build Slack blocks for a notification
 */
function buildNotificationBlocks(notification: SlackNotification): SlackBlock[] {
  const blocks: SlackBlock[] = [];

  // Header block
  if (notification.title) {
    blocks.push({
      type: 'header',
      text: {
        type: 'plain_text',
        text: notification.title,
        emoji: true,
      },
    });
  }

  // Main text block
  blocks.push({
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: notification.text,
    },
  });

  // Add fields if provided
  if (notification.fields && notification.fields.length > 0) {
    blocks.push({
      type: 'section',
      fields: notification.fields.map(field => ({
        type: 'mrkdwn',
        text: `*${field.title}*\n${field.value}`,
      })),
    });
  }

  // Add actions/buttons if provided
  if (notification.actions && notification.actions.length > 0) {
    blocks.push({
      type: 'actions',
      elements: notification.actions.map(action => ({
        type: 'button',
        text: {
          type: 'plain_text',
          text: action.text,
          emoji: true,
        },
        url: action.url,
        style: action.style,
      })),
    });
  }

  // Divider before footer
  blocks.push({ type: 'divider' });

  // Footer context
  blocks.push({
    type: 'context',
    elements: [
      {
        type: 'mrkdwn',
        text: `STEMWORKFORCE Challenges | ${new Date().toLocaleDateString()}`,
      },
    ],
  });

  return blocks;
}

/**
 * Send challenge launch notification
 */
export async function notifyChallengeLaunched(
  challenge: Challenge,
  channelId: string
): Promise<{ success: boolean; error?: string }> {
  const notification: SlackNotification = {
    channelId,
    type: 'challenge_launched',
    title: '🚀 New Challenge Launched!',
    text: `*${challenge.title}*\n\n${challenge.shortDescription}\n\n*Prize Pool:* $${challenge.totalPrizePool.toLocaleString()}\n*Deadline:* ${new Date(challenge.endDate).toLocaleDateString()}`,
    fields: [
      { title: 'Industry', value: challenge.industry, short: true },
      { title: 'Type', value: challenge.type, short: true },
    ],
    actions: [
      {
        text: 'View Challenge',
        url: `${window.location.origin}/challenges/${challenge.slug}`,
        style: 'primary',
      },
      {
        text: 'Register Now',
        url: `${window.location.origin}/challenges/${challenge.slug}/register`,
      },
    ],
  };

  return sendNotification(notification);
}

/**
 * Send phase start notification
 */
export async function notifyPhaseStarted(
  challenge: Challenge,
  phaseName: string,
  phaseDescription: string,
  channelId: string
): Promise<{ success: boolean; error?: string }> {
  const notification: SlackNotification = {
    channelId,
    type: 'challenge_phase_started',
    title: '📢 New Phase Started',
    text: `*${challenge.title}* has entered a new phase:\n\n*${phaseName}*\n${phaseDescription}`,
    actions: [
      {
        text: 'View Details',
        url: `${window.location.origin}/challenges/${challenge.slug}`,
        style: 'primary',
      },
    ],
  };

  return sendNotification(notification);
}

/**
 * Send deadline reminder
 */
export async function notifyDeadlineReminder(
  challenge: Challenge,
  daysRemaining: number,
  channelId: string
): Promise<{ success: boolean; error?: string }> {
  const urgencyEmoji = daysRemaining <= 1 ? '🔴' : daysRemaining <= 3 ? '🟡' : '⏰';

  const notification: SlackNotification = {
    channelId,
    type: 'challenge_deadline_reminder',
    title: `${urgencyEmoji} Deadline Reminder`,
    text: `*${challenge.title}*\n\n${daysRemaining === 0 ? 'Submissions close TODAY!' : `Only *${daysRemaining} day${daysRemaining > 1 ? 's' : ''}* remaining to submit your solution!`}`,
    actions: [
      {
        text: 'Submit Now',
        url: `${window.location.origin}/challenges/${challenge.slug}/submit`,
        style: 'primary',
      },
    ],
  };

  return sendNotification(notification);
}

/**
 * Send submission received notification
 */
export async function notifySubmissionReceived(
  submission: ChallengeSubmission,
  challengeTitle: string,
  channelId: string
): Promise<{ success: boolean; error?: string }> {
  const notification: SlackNotification = {
    channelId,
    type: 'submission_received',
    title: '📥 New Submission Received',
    text: `A new submission has been received for *${challengeTitle}*\n\n*${submission.title}*\n${submission.description.substring(0, 200)}${submission.description.length > 200 ? '...' : ''}`,
  };

  return sendNotification(notification);
}

/**
 * Send team formation notification
 */
export async function notifyTeamFormed(
  team: ChallengeTeam,
  challengeTitle: string,
  channelId: string
): Promise<{ success: boolean; error?: string }> {
  const notification: SlackNotification = {
    channelId,
    type: 'team_formed',
    title: '👥 New Team Formed',
    text: `Team *${team.name}* has formed to compete in *${challengeTitle}*\n\n${team.description || ''}`,
    fields: [
      { title: 'Members', value: `${team.memberCount}/${team.maxSize}`, short: true },
      { title: 'Looking for More', value: team.lookingForMembers ? 'Yes' : 'No', short: true },
    ],
  };

  return sendNotification(notification);
}

/**
 * Send winner announcement
 */
export async function notifyWinnerAnnounced(
  challenge: Challenge,
  winners: Array<{ place: number; name: string; prize: number }>,
  channelId: string
): Promise<{ success: boolean; error?: string }> {
  const placeEmojis = ['🥇', '🥈', '🥉'];
  const winnerText = winners
    .map((w, i) => `${placeEmojis[i] || '🏆'} *${w.place}${getOrdinalSuffix(w.place)} Place:* ${w.name} - $${w.prize.toLocaleString()}`)
    .join('\n');

  const notification: SlackNotification = {
    channelId,
    type: 'winner_announced',
    title: '🎉 Winners Announced!',
    text: `*${challenge.title}* has concluded!\n\nCongratulations to our winners:\n\n${winnerText}`,
    actions: [
      {
        text: 'View Results',
        url: `${window.location.origin}/challenges/${challenge.slug}/results`,
        style: 'primary',
      },
    ],
  };

  return sendNotification(notification);
}

/**
 * Send a general announcement
 */
export async function sendAnnouncement(
  channelId: string,
  title: string,
  message: string,
  linkUrl?: string,
  linkText?: string
): Promise<{ success: boolean; error?: string }> {
  const notification: SlackNotification = {
    channelId,
    type: 'announcement',
    title: `📣 ${title}`,
    text: message,
    actions: linkUrl
      ? [{ text: linkText || 'Learn More', url: linkUrl, style: 'primary' }]
      : undefined,
  };

  return sendNotification(notification);
}

// ===========================================
// SCHEDULED NOTIFICATIONS
// ===========================================

/**
 * Schedule deadline reminders for a challenge
 */
export async function scheduleDeadlineReminders(
  challengeId: string,
  endDate: string,
  channelId: string
): Promise<{ success: boolean; scheduled: number; error?: string }> {
  const deadline = new Date(endDate);
  const now = new Date();
  const reminders = [7, 3, 1, 0]; // Days before deadline
  let scheduled = 0;

  try {
    for (const daysBeforeDeadline of reminders) {
      const reminderDate = new Date(deadline);
      reminderDate.setDate(reminderDate.getDate() - daysBeforeDeadline);
      reminderDate.setHours(9, 0, 0, 0); // 9 AM

      if (reminderDate > now) {
        await supabase.from('scheduled_notifications').insert({
          challenge_id: challengeId,
          channel_id: channelId,
          notification_type: 'deadline_reminder',
          scheduled_for: reminderDate.toISOString(),
          payload: { daysRemaining: daysBeforeDeadline },
          status: 'pending',
        });
        scheduled++;
      }
    }

    return { success: true, scheduled };
  } catch (error) {
    console.error('Failed to schedule reminders:', error);
    return {
      success: false,
      scheduled,
      error: error instanceof Error ? error.message : 'Failed to schedule',
    };
  }
}

// ===========================================
// WEBHOOK HANDLING
// ===========================================

interface SlackEvent {
  type: string;
  channel?: string;
  user?: string;
  text?: string;
  ts?: string;
}

/**
 * Handle incoming Slack events (for webhooks)
 */
export async function handleSlackEvent(event: SlackEvent): Promise<void> {
  switch (event.type) {
    case 'member_joined_channel':
      await logSlackAction('member_joined', {
        channelId: event.channel,
        userId: event.user,
      });
      break;

    case 'member_left_channel':
      await logSlackAction('member_left', {
        channelId: event.channel,
        userId: event.user,
      });
      break;

    case 'message':
      // Could trigger AI analysis, Q&A bot, etc.
      break;

    default:
      console.log('Unhandled Slack event:', event.type);
  }
}

// ===========================================
// HELPER FUNCTIONS
// ===========================================

function getOrdinalSuffix(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

/**
 * Log Slack actions for analytics
 */
async function logSlackAction(
  action: string,
  details: Record<string, unknown>
): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    await supabase.from('slack_integration_logs').insert({
      action,
      details,
      user_id: user?.id,
      created_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to log Slack action:', error);
  }
}

// ===========================================
// BULK OPERATIONS
// ===========================================

/**
 * Set up all channels for a new challenge
 */
export async function setupChallengeChannels(
  challenge: Challenge
): Promise<{
  success: boolean;
  channels: Record<ChannelType, SlackChannel | null>;
  errors: string[];
}> {
  const channels: Record<ChannelType, SlackChannel | null> = {
    'challenge-general': null,
    'challenge-announcements': null,
    'challenge-qa': null,
    'team-private': null,
    'judges-private': null,
    'sponsors-private': null,
  };
  const errors: string[] = [];

  // Create public channels
  const publicTypes: ChannelType[] = ['challenge-general', 'challenge-announcements', 'challenge-qa'];
  for (const type of publicTypes) {
    const result = await createChallengeChannel(challenge, type);
    if (result.success && result.channel) {
      channels[type] = result.channel;
    } else {
      errors.push(`Failed to create ${type}: ${result.error}`);
    }
  }

  // Create private channels
  const judgesResult = await createChallengeChannel(challenge, 'judges-private');
  if (judgesResult.success && judgesResult.channel) {
    channels['judges-private'] = judgesResult.channel;
  } else {
    errors.push(`Failed to create judges channel: ${judgesResult.error}`);
  }

  const sponsorsResult = await createChallengeChannel(challenge, 'sponsors-private');
  if (sponsorsResult.success && sponsorsResult.channel) {
    channels['sponsors-private'] = sponsorsResult.channel;
  } else {
    errors.push(`Failed to create sponsors channel: ${sponsorsResult.error}`);
  }

  return {
    success: errors.length === 0,
    channels,
    errors,
  };
}

/**
 * Archive all channels for a closed challenge
 */
export async function archiveChallengeChannels(
  challengeId: string
): Promise<{ success: boolean; archived: number; errors: string[] }> {
  const errors: string[] = [];
  let archived = 0;

  try {
    // Get all channels associated with this challenge from logs
    const { data: logs } = await supabase
      .from('slack_integration_logs')
      .select('details')
      .eq('action', 'channel_created')
      .contains('details', { challengeId });

    if (logs) {
      for (const log of logs) {
        const channelId = (log.details as Record<string, unknown>)?.channelId as string;
        if (channelId) {
          const result = await archiveChannel(channelId, 'Challenge closed');
          if (result.success) {
            archived++;
          } else {
            errors.push(`Failed to archive ${channelId}: ${result.error}`);
          }
        }
      }
    }

    return { success: errors.length === 0, archived, errors };
  } catch (error) {
    return {
      success: false,
      archived,
      errors: [error instanceof Error ? error.message : 'Unknown error'],
    };
  }
}

// ===========================================
// EXPORTS
// ===========================================

export const slackService = {
  // Channel management
  createChallengeChannel,
  createTeamChannel,
  archiveChannel,
  inviteToChannel,
  setupChallengeChannels,
  archiveChallengeChannels,

  // Notifications
  sendNotification,
  sendDirectMessage,
  sendAnnouncement,

  // Specific notifications
  notifyChallengeLaunched,
  notifyPhaseStarted,
  notifyDeadlineReminder,
  notifySubmissionReceived,
  notifyTeamFormed,
  notifyWinnerAnnounced,

  // Scheduling
  scheduleDeadlineReminders,

  // Webhooks
  handleSlackEvent,
};

export default slackService;
