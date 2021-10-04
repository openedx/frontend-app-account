import PropTypes from 'prop-types';
import { render, waitFor } from '@testing-library/react';

import { useAsyncCall } from '../hooks';

const TestUseAsyncCallHookComponent = (props) => {
  const { asyncFunc } = props;
  const [isCallLoading, callData] = useAsyncCall(asyncFunc);

  return (
    <>
      { isCallLoading && <div>loading</div> }
      <div>{ callData }</div>
    </>
  );
};

TestUseAsyncCallHookComponent.propTypes = {
  asyncFunc: PropTypes.func.isRequired,
};

describe('useAsyncCall mock', () => {
  it('returns data correctly for response', async () => {
    const mockAsyncFunc = jest.fn(async () => ('data'));

    const { queryByText } = render(<TestUseAsyncCallHookComponent asyncFunc={mockAsyncFunc} />);

    await waitFor(() => (expect(mockAsyncFunc).toHaveBeenCalledTimes(1)));
    expect(queryByText('data')).not.toBeNull();
  });
  it('returns data correctly for no response', async () => {
    const mockAsyncFunc = jest.fn(async () => {});

    const { queryByText } = render(<TestUseAsyncCallHookComponent asyncFunc={mockAsyncFunc} />);

    await waitFor(() => (expect(mockAsyncFunc).toHaveBeenCalledTimes(1)));
    expect(queryByText('data')).toBeNull();
  });
  it('returns isLoading correctly', async () => {
    const mockAsyncFunc = jest.fn(async () => {});

    const { queryByText } = render(<TestUseAsyncCallHookComponent asyncFunc={mockAsyncFunc} />);
    expect(queryByText('loading')).not.toBeNull();
    expect(queryByText('data')).toBeNull();
  });
});
