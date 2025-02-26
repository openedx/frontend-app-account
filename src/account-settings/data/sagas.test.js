import { runSaga } from 'redux-saga';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';
import {
  fetchSettingsBegin,
  fetchSettingsSuccess,
  fetchSettingsFailure,
  saveSettingsBegin,
  saveSettingsSuccess,
  fetchTimeZonesSuccess,
  getExtendedProfileFieldsBegin,
  getExtendedProfileFieldsSuccess,
  getExtendedProfileFieldsFailure,
} from './actions';
import {
  getSettings,
  patchSettings,
  getTimeZones,
  getExtendedProfileFields,
} from './service';
import {
  handleFetchSettings,
  handleSaveSettings,
  handleFetchTimeZones,
  fetchThirdPartyAuthContext,
} from './sagas';

jest.mock('@edx/frontend-platform/auth', () => ({
  getAuthenticatedUser: jest.fn(), // Mock de la función
}));

jest.mock('./service', () => ({
  getSettings: jest.fn(),
  patchSettings: jest.fn(),
  getTimeZones: jest.fn(),
  getVerifiedNameHistory: jest.fn(),
  getExtendedProfileFields: jest.fn(), // Asegurar que está incluido aquí
}));

describe('Saga Tests', () => {
  test('handleFetchSettings success', async () => {
    const dispatched = [];
    const mockUser = { username: 'testuser', userId: 1, roles: [] };
    const mockSettings = {
      values: {},
      thirdPartyAuthProviders: {},
      profileDataManager: {},
      timeZones: {},
      verifiedNameHistory: undefined,
    };
    getAuthenticatedUser.mockReturnValue(mockUser);
    getSettings.mockResolvedValue(mockSettings);

    await runSaga(
      {
        dispatch: (action) => dispatched.push(action),
      },
      handleFetchSettings,
    ).toPromise();

    expect(dispatched).toContainEqual(fetchSettingsBegin());
    expect(dispatched).toContainEqual(fetchSettingsSuccess({
      // due to sagas.js and its ...values, we have to add the ...rest in values to pass test
      ...mockSettings,
      values: {
        values: mockSettings.values,
        verifiedNameHistory: undefined,
      },
    }));
  });

  test('handleFetchSettings failure', async () => {
    const dispatched = [];
    const errorMessage = 'Failed to fetch';

    getAuthenticatedUser.mockReturnValue({ username: 'testuser', userId: 1, roles: [] });
    getSettings.mockRejectedValue(new Error(errorMessage));

    await expect(runSaga(
      {
        dispatch: (action) => dispatched.push(action),
      },
      handleFetchSettings,
    ).toPromise()).rejects.toThrow(errorMessage);

    expect(dispatched).toContainEqual(fetchSettingsBegin());
    expect(dispatched).toContainEqual(fetchSettingsFailure(errorMessage));
  });

  test('handleSaveSettings success', async () => {
    const dispatched = [];
    const mockUser = { username: 'testuser', userId: 1 };
    const mockAction = {
      payload: {
        commitValues: { exampleKey: 'exampleValue' },
        formId: 'someForm',
        extendedProfile: {}, // Asegura que no sea undefined
      },
    };
    const mockSavedValues = {};

    getAuthenticatedUser.mockReturnValue(mockUser);
    patchSettings.mockResolvedValue(mockSavedValues);

    await runSaga(
      {
        dispatch: (action) => dispatched.push(action),
      },
      handleSaveSettings,
      mockAction,
    ).toPromise();

    expect(dispatched).toContainEqual(saveSettingsBegin());
    expect(dispatched).toContainEqual(saveSettingsSuccess(
      mockSavedValues,
      { [mockAction.payload.formId]: mockAction.payload.commitValues },
    ));
  });

  test('handleFetchTimeZones success', async () => {
    const dispatched = [];
    const mockedAction = { payload: { country: 'US' } };
    const mockResponse = ['EST', 'PST'];

    getTimeZones.mockResolvedValue(mockResponse);

    await runSaga(
      {
        dispatch: (action) => dispatched.push(action),
      },
      handleFetchTimeZones,
      mockedAction,
    ).toPromise();

    expect(dispatched).toContainEqual(fetchTimeZonesSuccess(mockResponse, 'US'));
  });

  test('fetchThirdPartyAuthContext success', async () => {
    const dispatched = [];
    const mockedAction = { payload: { urlParams: {} } };
    const mockFields = { field1: 'value1' };

    getExtendedProfileFields.mockResolvedValue({ fields: mockFields });

    await runSaga(
      {
        dispatch: (action) => dispatched.push(action),
      },
      fetchThirdPartyAuthContext,
      mockedAction,
    ).toPromise();

    expect(dispatched).toContainEqual(getExtendedProfileFieldsBegin());
    expect(dispatched).toContainEqual(getExtendedProfileFieldsSuccess(mockFields));
  });

  test('fetchThirdPartyAuthContext failure', async () => {
    const dispatched = [];
    const mockedAction = { payload: { urlParams: {} } };

    getExtendedProfileFields.mockRejectedValue(new Error('API error'));

    await expect(runSaga(
      {
        dispatch: (action) => dispatched.push(action),
      },
      fetchThirdPartyAuthContext,
      mockedAction,
    ).toPromise()).rejects.toThrow('API error');

    expect(dispatched).toContainEqual(getExtendedProfileFieldsBegin());
    expect(dispatched).toContainEqual(getExtendedProfileFieldsFailure());
  });

  test('getExtendedProfileFields success', async () => {
    const dispatched = [];
    const mockUrlParams = { param1: 'value1' };
    const mockFields = [{ name: 'field1', value: 'value1' }];

    getExtendedProfileFields.mockResolvedValue({ fields: mockFields });

    await runSaga(
      {
        dispatch: (action) => dispatched.push(action),
      },
      fetchThirdPartyAuthContext,
      { payload: { urlParams: mockUrlParams } },
    ).toPromise();

    expect(dispatched).toContainEqual(getExtendedProfileFieldsBegin());
    expect(dispatched).toContainEqual(getExtendedProfileFieldsSuccess(mockFields));
  });

  test('getExtendedProfileFields failure', async () => {
    const dispatched = [];
    const mockUrlParams = { param1: 'value1' };
    const errorMessage = 'API error';

    getExtendedProfileFields.mockRejectedValue(new Error(errorMessage));

    await expect(runSaga(
      {
        dispatch: (action) => dispatched.push(action),
      },
      fetchThirdPartyAuthContext,
      { payload: { urlParams: mockUrlParams } },
    ).toPromise()).rejects.toThrow(errorMessage);

    expect(dispatched).toContainEqual(getExtendedProfileFieldsBegin());
    expect(dispatched).toContainEqual(getExtendedProfileFieldsFailure());
  });
});
