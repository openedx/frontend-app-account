import PropTypes from 'prop-types';

import { render, waitFor } from '@testing-library/react';

import { useAsyncCall } from '../hooks';
import { FAILURE_STATUS, LOADING_STATUS, SUCCESS_STATUS } from '../constants';

const TestUseAsyncCallHookComponent = ({ asyncFunc }) => {
  const { status, data } = useAsyncCall(asyncFunc);
  return (
    <>
      <div>{status}</div>
      {data && Object.keys(data).length !== 0 && <div data-testid="data">{ data.data }</div>}
    </>
  );
};

TestUseAsyncCallHookComponent.propTypes = {
  asyncFunc: PropTypes.func.isRequired,
};

describe('useAsyncCall mock', () => {
  it('returns status and data correctly for successful response', async () => {
    const mockAsyncFunc = jest.fn(async () => ({ data: 'data' }));

    const { queryByText } = render(<TestUseAsyncCallHookComponent asyncFunc={mockAsyncFunc} />);

    await waitFor(() => (expect(mockAsyncFunc).toHaveBeenCalledTimes(1)));
    expect(queryByText(SUCCESS_STATUS)).not.toBeNull();
    expect(queryByText('data')).not.toBeNull();
  });
  it('returns status and data correctly for unsuccessful response', async () => {
    const mockAsyncFunc = jest.fn(async () => ({}));

    const { queryByText, queryByTestId } = render(<TestUseAsyncCallHookComponent asyncFunc={mockAsyncFunc} />);

    await waitFor(() => (expect(mockAsyncFunc).toHaveBeenCalledTimes(1)));
    expect(queryByText(FAILURE_STATUS)).not.toBeNull();
    expect(queryByTestId('data')).toBeNull();
  });
  it('returns status and data correctly for pending request', async () => {
    const mockAsyncFunc = jest.fn(async () => ({}));

    const { queryByText, queryByTestId } = render(<TestUseAsyncCallHookComponent asyncFunc={mockAsyncFunc} />);
    expect(queryByText(LOADING_STATUS)).not.toBeNull();
    expect(queryByTestId('data')).toBeNull();

    await waitFor(() => (expect(mockAsyncFunc).toHaveBeenCalledTimes(1)));
  });
});
