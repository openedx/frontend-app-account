import {
  getCommittedValues,
  getFormValues,
  getMostRecentApprovedVerifiedName,
  getMostRecentVerifiedName,
  getSiteLanguageOptions,
  getStaticFields,
  sortVerifiedNameHistory,
  transformTimeZonesToOptions,
} from './derive';

const name = (verifiedName, status, created) => ({ verified_name: verifiedName, status, created });

describe('sortVerifiedNameHistory', () => {
  it('sorts the results newest first without mutating the input', () => {
    const results = [
      name('Older', 'approved', '2021-01-01T00:00:00Z'),
      name('Newest', 'submitted', '2023-01-01T00:00:00Z'),
      name('Middle', 'denied', '2022-01-01T00:00:00Z'),
    ];
    const history = { results };

    expect(sortVerifiedNameHistory(history).map(n => n.verified_name)).toEqual(['Newest', 'Middle', 'Older']);
    expect(results[0].verified_name).toBe('Older');
  });

  it('returns an empty list when there is no history', () => {
    expect(sortVerifiedNameHistory(undefined)).toEqual([]);
    expect(sortVerifiedNameHistory({})).toEqual([]);
    expect(sortVerifiedNameHistory('test')).toEqual([]);
  });
});

describe('getMostRecentVerifiedName', () => {
  it('returns the first entry or null', () => {
    const newest = name('Newest', 'approved', '2023-01-01T00:00:00Z');
    expect(getMostRecentVerifiedName([newest, name('Older', 'approved', '2021-01-01T00:00:00Z')])).toBe(newest);
    expect(getMostRecentVerifiedName([])).toBeNull();
  });
});

describe('getMostRecentApprovedVerifiedName', () => {
  const approved = name('Approved', 'approved', '2021-01-01T00:00:00Z');

  it.each(['approved', 'denied', 'pending'])('returns the latest approved name when the most recent is %s', (status) => {
    const latest = name('Latest', status, '2023-01-01T00:00:00Z');
    expect(getMostRecentApprovedVerifiedName([latest, approved])).toBe(status === 'approved' ? latest : approved);
  });

  it('returns a submitted name while it is under review', () => {
    const submitted = name('Submitted', 'submitted', '2023-01-01T00:00:00Z');
    expect(getMostRecentApprovedVerifiedName([submitted, approved])).toBe(submitted);
  });

  it('returns null without any history', () => {
    expect(getMostRecentApprovedVerifiedName([])).toBeNull();
  });
});

describe('getCommittedValues', () => {
  it('adds the verified name and the certificate preference to the values', () => {
    const result = getCommittedValues({
      values: { name: 'John Doe', email: 'john@example.com' },
      verifiedNameHistory: { use_verified_name_for_certs: true, results: [] },
      confirmationValues: {},
      approvedVerifiedName: name('Johnathan Doe', 'approved', '2021-01-01T00:00:00Z'),
    });

    expect(result).toEqual({
      name: 'John Doe',
      email: 'john@example.com',
      verified_name: 'Johnathan Doe',
      useVerifiedNameForCerts: true,
    });
  });

  it('lets a pending certificate preference win over the fetched one', () => {
    const result = getCommittedValues({
      values: {},
      verifiedNameHistory: { use_verified_name_for_certs: true },
      confirmationValues: { useVerifiedNameForCerts: false },
      approvedVerifiedName: null,
    });

    expect(result.useVerifiedNameForCerts).toBe(false);
    expect(result.verified_name).toBeUndefined();
  });

  it('defaults the certificate preference to false', () => {
    const result = getCommittedValues({
      values: {}, verifiedNameHistory: undefined, confirmationValues: {}, approvedVerifiedName: null,
    });

    expect(result.useVerifiedNameForCerts).toBe(false);
  });
});

describe('getFormValues', () => {
  it('overlays drafts on the committed values', () => {
    const result = getFormValues(
      {
        name: 'John Doe', age: 25, verified_name: undefined, useVerifiedNameForCerts: false,
      },
      { age: 26 },
    );

    expect(result).toEqual({
      name: 'John Doe',
      age: 26,
      verified_name: '',
      useVerifiedNameForCerts: false,
    });
  });

  it('keeps a false draft for boolean fields', () => {
    expect(getFormValues({ useVerifiedNameForCerts: true }, { useVerifiedNameForCerts: false }))
      .toEqual({ useVerifiedNameForCerts: false });
  });

  it('applies a draft to the matching extended profile field', () => {
    const result = getFormValues(
      {
        extended_profile: [
          { field_name: 'test_field', field_value: '5' },
          { field_name: 'other_field', field_value: 'x' },
        ],
      },
      { test_field: '6' },
    );

    expect(result).toEqual({
      extended_profile: [
        { field_name: 'test_field', field_value: '6' },
        { field_name: 'other_field', field_value: 'x' },
      ],
    });
  });

  it('leaves the extended profile alone when the draft is for another field', () => {
    const extendedProfile = [{ field_name: 'test_field', field_value: '5' }];
    const result = getFormValues({ extended_profile: extendedProfile, name: 'A' }, { name: 'B' });

    expect(result.extended_profile).toEqual(extendedProfile);
    expect(result.extended_profile).not.toBe(extendedProfile);
    expect(result.name).toBe('B');
  });
});

describe('getStaticFields', () => {
  it('locks the managed fields when a third party manages the profile', () => {
    expect(getStaticFields('Acme Corp', null)).toEqual(['name', 'email', 'country']);
  });

  it('locks the verified name while it is under review', () => {
    expect(getStaticFields(null, name('X', 'submitted', '2023-01-01T00:00:00Z'))).toEqual(['verifiedName']);
    expect(getStaticFields(null, name('X', 'approved', '2023-01-01T00:00:00Z'))).toEqual([]);
  });

  it('locks nothing by default', () => {
    expect(getStaticFields(null, null)).toEqual([]);
  });
});

describe('option transforms', () => {
  it('turns time zones into select options', () => {
    expect(transformTimeZonesToOptions([{ time_zone: 'America/New_York', description: 'New York (EST)' }]))
      .toEqual([{ value: 'America/New_York', label: 'New York (EST)' }]);
  });

  it('turns the site language list into select options', () => {
    expect(getSiteLanguageOptions([{ code: 'en', name: 'English', released: true }]))
      .toEqual([{ value: 'en', label: 'English' }]);
  });
});
