import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import {
  render, cleanup, act, screen, fireEvent,
} from '@testing-library/react';
import { IntlProvider } from '@openedx/frontend-base';
import IdVerificationContext from '@src/id-verification/IdVerificationContext';
import ReviewRequirementsPanel from '@src/id-verification/panels/ReviewRequirementsPanel';

jest.mock('@openedx/frontend-base', () => ({
  ...jest.requireActual('@openedx/frontend-base'),
  sendTrackEvent: jest.fn(),
}));

describe('ReviewRequirementsPanel', () => {
  const context = {};

  const getPanel = async () => {
    await act(async () => render((
      <Router>
        <IntlProvider locale="en">
          <IdVerificationContext.Provider value={context}>
            <ReviewRequirementsPanel />
          </IdVerificationContext.Provider>
        </IntlProvider>
      </Router>
    )));
  };

  afterEach(() => {
    cleanup();
  });

  it('routes to RequestCameraAccessPanel', async () => {
    await getPanel();
    const button = await screen.findByTestId('next-button');
    fireEvent.click(button);
    expect(window.location.pathname).toEqual('/request-camera-access');
  });

  it('links to the next panel under the path the flow is mounted at', async () => {
    window.history.pushState({}, '', '/account/id-verification/review-requirements');
    await act(async () => render((
      <Router>
        <IntlProvider locale="en">
          <IdVerificationContext.Provider value={context}>
            <Routes>
              <Route
                path="account/id-verification/*"
                element={(
                  <Routes>
                    <Route path="review-requirements" element={<ReviewRequirementsPanel />} />
                  </Routes>
                )}
              />
            </Routes>
          </IdVerificationContext.Provider>
        </IntlProvider>
      </Router>
    )));
    const button = await screen.findByTestId('next-button');
    expect(button).toHaveAttribute('href', '/account/id-verification/request-camera-access');
    window.history.pushState({}, '', '/');
  });

  it('displays an alert if the user\'s account information is managed by a third party', async () => {
    context.profileDataManager = 'test-org';
    await getPanel();
    const alert = await screen.getAllByText('test-org');
    expect(alert.length).toEqual(1);
  });
});
