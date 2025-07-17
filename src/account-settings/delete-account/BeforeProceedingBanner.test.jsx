import renderer from 'react-test-renderer';
import { IntlProvider } from '@edx/frontend-platform/i18n';

jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: jest.fn(node => node), // Mock portal behavior
}));

import BeforeProceedingBanner from './BeforeProceedingBanner'; // eslint-disable-line import/first

describe('BeforeProceedingBanner', () => {
  it('should match the snapshot if SUPPORT_URL_TO_UNLINK_SOCIAL_MEDIA_ACCOUNT does not have a support link', () => {
    const props = {
      instructionMessageId: 'account.settings.delete.account.please.unlink',
      supportArticleUrl: '',
    };
    const tree = renderer
      .create((
        <IntlProvider locale="en">
          <BeforeProceedingBanner
            {...props}
          />
        </IntlProvider>
      ))
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should match the snapshot when SUPPORT_URL_TO_UNLINK_SOCIAL_MEDIA_ACCOUNT has a support link', () => {
    const props = {
      instructionMessageId: 'account.settings.delete.account.please.unlink',
      supportArticleUrl: 'http://test-support.edx',
    };
    const tree = renderer
      .create((
        <IntlProvider locale="en">
          <BeforeProceedingBanner
            {...props}
          />
        </IntlProvider>
      ))
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
