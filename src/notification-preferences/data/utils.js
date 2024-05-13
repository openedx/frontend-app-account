import { getConfig } from '@edx/frontend-platform';

const showEmailChannel = () => {
  if (getConfig().SHOW_EMAIL_CHANNEL === 'true') {
    return { WEB: 'web', EMAIL: 'email' };
  }
  return { WEB: 'web' };
};

export default showEmailChannel;
