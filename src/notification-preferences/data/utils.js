import { getConfig } from '@edx/frontend-platform';

const showNotificationChannels = () => ({ WEB: 'web', ...(getConfig().SHOW_EMAIL_CHANNEL === 'true' && { EMAIL: 'email' }) });

export default showNotificationChannels;
