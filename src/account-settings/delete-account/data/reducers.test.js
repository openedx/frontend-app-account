import reducer from './reducers';
import {
  deleteAccountConfirmation,
  deleteAccountBegin,
  deleteAccountSuccess,
  deleteAccountFailure,
  deleteAccountReset,
  deleteAccountCancel,
} from './actions';

describe('delete-account reducer', () => {
  let state = null;

  beforeEach(() => {
    state = reducer();
  });

  it('should process DELETE_ACCOUNT.CONFIRMATION', () => {
    const result = reducer(state, deleteAccountConfirmation());
    expect(result).toEqual({
      errorType: null,
      status: 'confirming',
    });
  });

  it('should process DELETE_ACCOUNT.BEGIN', () => {
    const result = reducer(state, deleteAccountBegin());
    expect(result).toEqual({
      errorType: null,
      status: 'pending',
    });
  });

  it('should process DELETE_ACCOUNT.SUCCESS', () => {
    const result = reducer(state, deleteAccountSuccess());
    expect(result).toEqual({
      errorType: null,
      status: 'deleted',
    });
  });

  it('should process DELETE_ACCOUNT.FAILURE no reason', () => {
    const result = reducer(state, deleteAccountFailure());
    expect(result).toEqual({
      errorType: 'server',
      status: 'failed',
    });
  });

  it('should process DELETE_ACCOUNT.FAILURE with reason', () => {
    const result = reducer(state, deleteAccountFailure('carnivorous buns'));
    expect(result).toEqual({
      errorType: 'carnivorous buns',
      status: 'failed',
    });
  });

  it('should process DELETE_ACCOUNT.RESET no status', () => {
    const result = reducer(state, deleteAccountReset());
    expect(result).toEqual({
      errorType: null,
      status: null,
    });
  });

  it('should process DELETE_ACCOUNT.RESET with failed old status', () => {
    const result = reducer(
      {
        errorType: 'carnivorous buns',
        status: 'failed',
      },
      deleteAccountReset(),
    );
    expect(result).toEqual({
      errorType: null,
      status: 'confirming',
    });
  });

  it('should process DELETE_ACCOUNT.RESET with pending old status', () => {
    const result = reducer(
      {
        errorType: 'carnivorous buns',
        status: 'pending',
      },
      deleteAccountReset(),
    );
    expect(result).toEqual({
      errorType: null,
      status: 'pending',
    });
  });

  it('should process DELETE_ACCOUNT.CANCEL', () => {
    const result = reducer(
      {
        errorType: 'carnivorous buns',
        status: 'failed',
      },
      deleteAccountCancel(),
    );
    expect(result).toEqual({
      errorType: null,
      status: null,
    });
  });
});
