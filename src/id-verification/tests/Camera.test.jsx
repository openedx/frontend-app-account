import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import '@testing-library/jest-dom/extend-expect';
import { render, cleanup, screen, act, fireEvent } from '@testing-library/react';
import { injectIntl, IntlProvider } from '@edx/frontend-platform/i18n';
import { IdVerificationContext } from '../IdVerificationContext';
import Camera from '../Camera';

jest.mock('jslib-html5-camera-photo');

window.HTMLMediaElement.prototype.play = () => {};

const IntlCamera = injectIntl(Camera);

const history = createMemoryHistory();

describe('SubmittedPanel', () => {
  const defaultProps = {
    intl: {},
    onImageCapture: jest.fn(),
  };

  const contextValue = {};

  afterEach(() => {
    cleanup();
  });

  it('takes photo', async () => {
    await act(async () => render((
      <Router history={history}>
        <IntlProvider locale="en">
          <IdVerificationContext.Provider value={contextValue}>
            <IntlCamera {...defaultProps} />
          </IdVerificationContext.Provider>
        </IntlProvider>
      </Router>
    )));
    const button = await screen.findByRole('button');
    expect(button).toHaveTextContent('Take Photo');
    fireEvent.click(button);
    expect(defaultProps.onImageCapture).toHaveBeenCalled();
  });
});
