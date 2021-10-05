import React, { useContext } from 'react';
import { render, cleanup, waitFor } from '@testing-library/react';

import { getVerifiedNameHistory } from '../../account-settings/data/service';
import { VerifiedNameContext, VerifiedNameContextProvider } from '../VerifiedNameContext';

const VerifiedNameContextTestComponent = () => {
  const { verifiedName, verifiedNameEnabled } = useContext(VerifiedNameContext);
  return (
    <>
      {verifiedNameEnabled && (<div data-testid="verified-name">{verifiedName}</div>)}
      <div data-testid="verified-name-enabled">{verifiedNameEnabled ? 'true' : 'false'}</div>
    </>
  );
};

jest.mock('../../account-settings/data/service', () => ({
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
    jest.mock('../../account-settings/data/service', () => ({
      getVerifiedNameHistory: jest.fn(() => ({})),
    }));

    render(<VerifiedNameContextProvider {...defaultProps} />);
    await waitFor(() => expect(getVerifiedNameHistory).toHaveBeenCalledTimes(1));
  });

  it('sets verifiedName and verifiedNameEnabled correctly when verified name feature enabled', async () => {
    const mockReturnValue = {
      verified_name_enabled: true,
      results: [{
        verified_name: 'Michael',
        status: 'approved',
        created: '2021-08-31T18:33:32.489200Z',
      }],
    };
    getVerifiedNameHistory.mockReturnValueOnce(mockReturnValue);

    const { getByTestId } = render((
      <VerifiedNameContextProvider {...defaultProps}>
        <VerifiedNameContextTestComponent />
      </VerifiedNameContextProvider>
    ));

    await waitFor(() => expect(getVerifiedNameHistory).toHaveBeenCalledTimes(1));
    expect(getByTestId('verified-name')).toHaveTextContent('Michael');
    expect(getByTestId('verified-name-enabled')).toHaveTextContent('true');
  });

  it('sets verifiedName and verifiedNameEnabled correctly when verified name feature not enabled', async () => {
    const mockReturnValue = {
      verified_name_enabled: false,
      results: [{
        verified_name: 'Michael',
        status: 'approved',
        created: '2021-08-31T18:33:32.489200Z',
      }],
    };
    getVerifiedNameHistory.mockReturnValueOnce(mockReturnValue);

    const { queryByTestId } = render((
      <VerifiedNameContextProvider {...defaultProps}>
        <VerifiedNameContextTestComponent />
      </VerifiedNameContextProvider>
    ));

    await waitFor(() => expect(getVerifiedNameHistory).toHaveBeenCalledTimes(1));
    expect(queryByTestId('verified-name')).toBeNull();
    expect(queryByTestId('verified-name-enabled')).toHaveTextContent('false');
  });
});
