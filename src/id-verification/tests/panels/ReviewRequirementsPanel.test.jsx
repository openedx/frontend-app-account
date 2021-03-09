import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import {
  render, cleanup, act, screen, fireEvent,
} from '@testing-library/react';
import '@edx/frontend-platform/analytics';
import { injectIntl, IntlProvider } from '@edx/frontend-platform/i18n';
import IdVerificationContext from '../../IdVerificationContext';
import ReviewRequirementsPanel from '../../panels/ReviewRequirementsPanel';

jest.mock('@edx/frontend-platform/analytics', () => ({
  sendTrackEvent: jest.fn(),
}));

const IntlReviewRequirementsPanel = injectIntl(ReviewRequirementsPanel);

const history = createMemoryHistory();

describe('ReviewRequirementsPanel', () => {
  const defaultProps = {
    intl: {},
  };

  const context = { setOptimizelyExperimentName: jest.fn() };

  afterEach(() => {
    cleanup();
  });

  it('routes to RequestCameraAccessPanel', async () => {
    await act(async () => render((
      <Router history={history}>
        <IntlProvider locale="en">
          <IntlReviewRequirementsPanel {...defaultProps} />
        </IntlProvider>
      </Router>
    )));
    const button = await screen.findByTestId('next-button');
    fireEvent.click(button);
    expect(history.location.pathname).toEqual('/request-camera-access');
  });

  it('updates optimizely experiment name in context', async () => {
    window.experimentVariables = {};
    window.experimentVariables.experimentName = 'test-experiment';
    await act(async () => render((
      <Router history={history}>
        <IntlProvider locale="en">
          <IdVerificationContext.Provider value={context}>
            <IntlReviewRequirementsPanel {...defaultProps} />
          </IdVerificationContext.Provider>
        </IntlProvider>
      </Router>
    )));
    expect(context.setOptimizelyExperimentName).toHaveBeenCalledWith('test-experiment');
  });
});
