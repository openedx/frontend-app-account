import {
  AsyncActionType,
  getModuleState,
} from './reduxUtils';

describe('AsyncActionType', () => {
  it('should return well formatted action strings', () => {
    const actionType = new AsyncActionType('HOUSE_CATS', 'START_THE_RACE');

    expect(actionType.BASE).toBe('HOUSE_CATS__START_THE_RACE');
    expect(actionType.BEGIN).toBe('HOUSE_CATS__START_THE_RACE__BEGIN');
    expect(actionType.SUCCESS).toBe('HOUSE_CATS__START_THE_RACE__SUCCESS');
    expect(actionType.FAILURE).toBe('HOUSE_CATS__START_THE_RACE__FAILURE');
    expect(actionType.RESET).toBe('HOUSE_CATS__START_THE_RACE__RESET');
    expect(actionType.FORBIDDEN).toBe('HOUSE_CATS__START_THE_RACE__FORBIDDEN');
  });
});

describe('getModuleState', () => {
  const state = {
    first: { red: { awesome: 'sauce' }, blue: { weak: 'sauce' } },
    second: { other: 'data' },
  };

  it('should return everything if given an empty path', () => {
    expect(getModuleState(state, [])).toEqual(state);
  });

  it('should resolve paths correctly', () => {
    expect(getModuleState(
      state,
      ['first'],
    )).toEqual({ red: { awesome: 'sauce' }, blue: { weak: 'sauce' } });

    expect(getModuleState(
      state,
      ['first', 'red'],
    )).toEqual({ awesome: 'sauce' });

    expect(getModuleState(state, ['second'])).toEqual({ other: 'data' });
  });

  it('should throw an exception on a bad path', () => {
    expect(() => {
      getModuleState(state, ['uhoh']);
    }).toThrowErrorMatchingSnapshot();
  });

  it('should return non-objects correctly', () => {
    expect(getModuleState(state, ['first', 'red', 'awesome'])).toEqual('sauce');
  });
});
