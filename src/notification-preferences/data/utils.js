import { getConfig } from '@edx/frontend-platform';

const notificationChannels = () => ({ WEB: 'web', ...(getConfig().SHOW_EMAIL_CHANNEL === 'true' && { EMAIL: 'email' }) });

export default notificationChannels;
