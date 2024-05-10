import { getConfig } from '@edx/frontend-platform';

const showEmailChannel = getConfig().SHOW_EMAIL_CHANNEL === 'true' || false;

export const NOTIFICATION_CHANNELS = showEmailChannel
  ? { WEB: 'web', EMAIL: 'email' }
  : { WEB: 'web' };

export const EMAIL_CADENCE = {
  DAILY: 'Daily',
  WEEKLY: 'Weekly',
  IMMEDIATELY: 'Immediately',
  NEVER: 'Never',
};
