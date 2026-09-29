import { BrowserRouter as Router } from 'react-router-dom';
import {
  render, cleanup, act, screen,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from '@openedx/frontend-base';
import IdVerificationContext from '@src/id-verification/IdVerificationContext';
import { VerifiedNameContext } from '@src/id-verification/VerifiedNameContext';
import GetNameIdPanel from '@src/id-verification/panels/GetNameIdPanel';

jest.mock('@openedx/frontend-base', () => ({
  ...jest.requireActual('@openedx/frontend-base'),
  sendTrackEvent: jest.fn(),
}));

describe('GetNameIdPanel', () => {
  const IDVerificationContextValue = {
    nameOnAccount: 'test',
    userId: 3,
    idPhotoName: '',
    setIdPhotoName: jest.fn(),
    facePhotoFile: 'test.jpg',
    idPhotoFile: 'test.jpg',
  };

  const verifiedNameContextValue = {};

  const getPanel = async (idVerificationContextValue = IDVerificationContextValue) => {
    await act(async () => render((
      <Router>
        <IntlProvider locale="en">
          <VerifiedNameContext.Provider value={verifiedNameContextValue}>
            <IdVerificationContext.Provider value={idVerificationContextValue}>
              <GetNameIdPanel />
            </IdVerificationContext.Provider>
          </VerifiedNameContext.Provider>
        </IntlProvider>
      </Router>
    )));
  };

  afterEach(() => {
    cleanup();
  });

  it('shows feedback message when user has an empty name', async () => {
    await getPanel();
    // Ensure the feedback message on name shows when the user has an empty name
    expect(await screen.queryByTestId('id-name-feedback-message')).toBeTruthy();
  });

  it('does not show feedback message when user has an non-empty name', async () => {
    const idVerificationContextValue = {
      ...IDVerificationContextValue,
      idPhotoName: 'test',
    };
    await getPanel(idVerificationContextValue);
    // Ensure the feedback message on name shows when the user has an empty name
    expect(await screen.queryByTestId('id-name-feedback-message')).toBeNull();
  });

  it('calls setIdPhotoName with correct name', async () => {
    const user = userEvent.setup();

    await getPanel();

    const input = await screen.findByTestId('name-input');
    await user.click(input);
    await user.paste('test');
    expect(IDVerificationContextValue.setIdPhotoName).toHaveBeenCalledWith('test');
  });

  it('routes to SummaryPanel', async () => {
    const user = userEvent.setup();

    await getPanel();

    const button = await screen.findByTestId('next-button');

    await user.click(button);
    expect(window.location.pathname).toEqual('/summary');
  });
});
