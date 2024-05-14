import showEmailChannel from './utils';

export const NOTIFICATION_CHANNELS = showEmailChannel();

export const EMAIL_CADENCE = {
  DAILY: 'Daily',
  WEEKLY: 'Weekly',
  IMMEDIATELY: 'Immediately',
  NEVER: 'Never',
};
