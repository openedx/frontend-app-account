/* eslint-disable react/jsx-no-useless-fragment */
import React, { useContext } from 'react';
import { render, cleanup, waitFor } from '@testing-library/react';

import { getVerifiedNameHistory } from '@src/account-settings/data/api';
import { createWrapper } from '@src/tests/renderWithProviders';
import { VerifiedNameContext, VerifiedNameContextProvider } from '@src/id-verification/VerifiedNameContext';

const VerifiedNameContextTestComponent = () => {
  const { verifiedName } = useContext(VerifiedNameContext);
  return (
    <>
      {verifiedName && (<div data-testid="verified-name">{verifiedName}</div>)}
    </>
  );
};

jest.mock('@src/account-settings/data/api', () => ({
  getVerifiedNameHistory: jest.fn(() => ({})),
}));

describe('VerifiedNameContextProvider', () => {
  const defaultProps = {
    children: <div />,
    intl: {},
  };

  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it('calls getVerifiedNameHistory', async () => {
    render(<VerifiedNameContextProvider {...defaultProps} />, { wrapper: createWrapper() });
    await waitFor(() => expect(getVerifiedNameHistory).toHaveBeenCalledTimes(1));
  });

  it('sets verifiedName', async () => {
    const mockReturnValue = {
      results: [{
        verified_name: 'Michael',
        status: 'approved',
        created: '2021-08-31T18:33:32.489200Z',
      }],
    };
    getVerifiedNameHistory.mockReturnValueOnce(mockReturnValue);

    const { getByTestId } = render(
      <VerifiedNameContextProvider {...defaultProps}>
        <VerifiedNameContextTestComponent />
      </VerifiedNameContextProvider>,
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(getByTestId('verified-name')).toHaveTextContent('Michael'));
    expect(getVerifiedNameHistory).toHaveBeenCalledTimes(1);
  });
});
