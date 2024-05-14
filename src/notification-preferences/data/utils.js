import { getConfig } from '@edx/frontend-platform';

const showEmailChannel = () => ({ WEB: 'web', ...(getConfig().SHOW_EMAIL_CHANNEL === 'true' && { EMAIL: 'email' }) });

export default showEmailChannel;
