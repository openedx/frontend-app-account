import { compareVerifiedNamesByCreatedDate, getMostRecentApprovedOrPendingVerifiedName, moveCheckboxFieldsToEnd } from '../utils';

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

  describe('moveCheckboxFieldsToEnd', () => {
    it('returns 1 when first field is checkbox and second field is not', () => {
      const a = { type: 'checkbox' };
      const b = { type: 'text' };

      expect(moveCheckboxFieldsToEnd(a, b)).toEqual(1);
    });

    it('returns -1 when first field is not checkbox and second field is', () => {
      const a = { type: 'text' };
      const b = { type: 'checkbox' };

      expect(moveCheckboxFieldsToEnd(a, b)).toEqual(-1);
    });

    it('returns 0 when both fields are checkboxes', () => {
      const a = { type: 'checkbox' };
      const b = { type: 'checkbox' };

      expect(moveCheckboxFieldsToEnd(a, b)).toEqual(0);
    });

    it('returns 0 when neither field is a checkbox', () => {
      const a = { type: 'text' };
      const b = { type: 'text' };

      expect(moveCheckboxFieldsToEnd(a, b)).toEqual(0);
    });
  });
});
