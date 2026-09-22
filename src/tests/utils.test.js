import {
  compareVerifiedNamesByCreatedDate,
  getMostRecentApprovedOrPendingVerifiedName,
  parseEnvArray,
  parseEnvBoolean,
} from '../utils';

describe('getMostRecentApprovedOrPendingVerifiedName', () => {
  it('returns correct verified name if one exists', () => {
    const verifiedNames = [
      {
        created: '2021-08-31T18:33:32.489200Z',
        verified_name: 'Mike',
        status: 'denied',
      },
      {
        created: '2021-09-03T18:33:32.489200Z',
        verified_name: 'Michelangelo',
        status: 'approved',
      },
    ];

    expect(getMostRecentApprovedOrPendingVerifiedName(verifiedNames)).toEqual(verifiedNames[1].verified_name);
  });
  it('returns no verified name if one does not exist', () => {
    const verifiedNames = [
      {
        created: '2021-08-31T18:33:32.489200Z',
        verified_name: 'Mike',
        status: 'denied',
      },
      {
        created: '2021-09-03T18:33:32.489200Z',
        verified_name: 'Michelangelo',
        status: 'submitted',
      },
    ];

    expect(getMostRecentApprovedOrPendingVerifiedName(verifiedNames)).toBeNull();
  });
});

describe('compareVerifiedNamesByCreatedDate', () => {
  it('returns 0 when equal', () => {
    const a = {
      created: '2021-08-31T18:33:32.489200Z',
      verified_name: 'Mike',
      status: 'denied',
    };
    const b = {
      created: '2021-08-31T18:33:32.489200Z',
      verified_name: 'Michael',
      status: 'denied',
    };

    expect(compareVerifiedNamesByCreatedDate(a, b)).toEqual(0);
  });

  it('returns negative number when first argument is greater than second argument', () => {
    const a = {
      created: '2021-09-30T18:33:32.489200Z',
      verified_name: 'Mike',
      status: 'denied',
    };
    const b = {
      created: '2021-08-31T18:33:32.489200Z',
      verified_name: 'Michael',
      status: 'denied',
    };

    expect(compareVerifiedNamesByCreatedDate(a, b)).toBeLessThan(0);
  });

  it('returns positive number when first argument is less than second argument', () => {
    const a = {
      created: '2021-08-31T18:33:32.489200Z',
      verified_name: 'Mike',
      status: 'denied',
    };
    const b = {
      created: '2021-09-30T18:33:32.489200Z',
      verified_name: 'Michael',
      status: 'denied',
    };

    expect(compareVerifiedNamesByCreatedDate(a, b)).toBeGreaterThan(0);
  });
});

describe('parseEnvBoolean', () => {
  it('accepts booleans and their string forms', () => {
    expect(parseEnvBoolean(true)).toBe(true);
    expect(parseEnvBoolean('true')).toBe(true);
    expect(parseEnvBoolean('TRUE')).toBe(true);
    expect(parseEnvBoolean(false)).toBe(false);
    expect(parseEnvBoolean('false')).toBe(false);
  });

  it('treats unset and empty values as false', () => {
    expect(parseEnvBoolean(undefined)).toBe(false);
    expect(parseEnvBoolean('')).toBe(false);
  });
});

describe('parseEnvArray', () => {
  it('returns an array as it is', () => {
    expect(parseEnvArray(['US', 'BR'])).toEqual(['US', 'BR']);
  });

  it('parses a JSON string', () => {
    expect(parseEnvArray('["US", "BR"]')).toEqual(['US', 'BR']);
  });

  it('returns an empty list for unset, empty, invalid or non-list values', () => {
    expect(parseEnvArray(undefined)).toEqual([]);
    expect(parseEnvArray('')).toEqual([]);
    expect(parseEnvArray('not json')).toEqual([]);
    expect(parseEnvArray('{"US": true}')).toEqual([]);
  });
});
