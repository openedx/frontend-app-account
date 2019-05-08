import applyConfiguration from '../common/serviceUtils';

let config = {
  ACCOUNTS_API_BASE_URL: null,
  ECOMMERCE_API_BASE_URL: null,
  LMS_BASE_URL: null,
  PASSWORD_RESET_URL: null,
};

const SOCIAL_PLATFORMS = [
  { id: 'twitter', key: 'social_link_twitter' },
  { id: 'facebook', key: 'social_link_facebook' },
  { id: 'linkedin', key: 'social_link_linkedin' },
];

let apiClient = null;

export function configureApiService(newConfig, newApiClient) {
  config = applyConfiguration(config, newConfig);
  apiClient = newApiClient;
}

function unpackFieldErrors(fieldErrors) {
  const unpackedFieldErrors = fieldErrors;
  if (fieldErrors.social_links) {
    SOCIAL_PLATFORMS.forEach(({ key }) => {
      unpackedFieldErrors[key] = fieldErrors.social_links;
    });
  }
  return Object.entries(unpackedFieldErrors)
    .reduce((acc, [k, v]) => {
      acc[k] = v.user_message;
      return acc;
    }, {});
}

function unpackAccountResponseData(data) {
  const unpackedData = data;

  SOCIAL_PLATFORMS.forEach(({ id, key }) => {
    const platformData = data.social_links.find(({ platform }) => platform === id);
    unpackedData[key] = typeof platformData === 'object' ? platformData.social_link : '';
  });

  if (Array.isArray(data.language_proficiencies)) {
    if (data.language_proficiencies.length) {
      unpackedData.language_proficiencies = data.language_proficiencies[0].code;
    } else {
      unpackedData.language_proficiencies = '';
    }
  }

  return unpackedData;
}
function packAccountCommitData(commitData) {
  const packedData = commitData;

  SOCIAL_PLATFORMS.forEach(({ id, key }) => {
    if (commitData[key]) {
      packedData.social_links = [{ platform: id, social_link: commitData[key] }];
    }
    delete packedData[key];
  });

  if (commitData.language_proficiencies) {
    packedData.language_proficiencies = [{ code: commitData.language_proficiencies }];
  }
  return packedData;
}


function handleRequestError(error) {
  if (error.response && error.response.data.field_errors) {
    const apiError = Object.create(error);
    apiError.fieldErrors = unpackFieldErrors(error.response.data.field_errors);
    throw apiError;
  }
  throw error;
}


export async function getAccount(username) {
  const { data } = await apiClient.get(`${config.ACCOUNTS_API_BASE_URL}/${username}`);
  return unpackAccountResponseData(data);
}

export async function patchAccount(username, commitValues) {
  const requestConfig = {
    headers: { 'Content-Type': 'application/merge-patch+json' },
  };

  const { data } = await apiClient.patch(
    `${config.ACCOUNTS_API_BASE_URL}/${username}`,
    packAccountCommitData(commitValues),
    requestConfig,
  ).catch(handleRequestError);

  return unpackAccountResponseData(data);
}

export async function postResetPassword() {
  const { data } = await apiClient
    .post(config.PASSWORD_RESET_URL)
    .catch(handleRequestError);

  return data;
}

export async function getThirdPartyAuthProviders() {
  const { data } = await apiClient.get(`${config.LMS_BASE_URL}/api/third_party_auth/v0/providers/user_status`)
    .catch(handleRequestError);

  return data.map(({ connect_url: connectUrl, disconnect_url: disconnectUrl, ...provider }) => ({
    ...provider,
    connectUrl: `${config.LMS_BASE_URL}${connectUrl}`,
    disconnectUrl: `${config.LMS_BASE_URL}${disconnectUrl}`,
  }));
}
