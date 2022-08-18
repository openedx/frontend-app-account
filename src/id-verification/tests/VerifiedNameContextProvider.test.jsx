import React, { useContext } from 'react';
import { render, cleanup, waitFor } from '@testing-library/react';

import { getVerifiedNameHistory } from '../../account-settings/data/service';
import { VerifiedNameContext, VerifiedNameContextProvider } from '../VerifiedNameContext';

const VerifiedNameContextTestComponent = () => {
  const { verifiedName } = useContext(VerifiedNameContext);
  return (
    <>
      {verifiedName && (<div data-testid="verified-name">{verifiedName}</div>)}
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

  it('sets verifiedName', async () => {
    const mockReturnValue = {
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
  });
});
