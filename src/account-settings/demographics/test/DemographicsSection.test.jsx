import * as auth from '@edx/frontend-platform/auth';

import { IntlProvider, injectIntl } from '@edx/frontend-platform/i18n';

import { Provider } from 'react-redux';
import React from 'react';
import configureStore from 'redux-mock-store';
import renderer from 'react-test-renderer';
import DemographicsSection from '../DemographicsSection';

jest.mock('@edx/frontend-platform/auth');

const IntlDemographicsSection = injectIntl(DemographicsSection);

jest.mock('../../data/selectors', () => jest.fn().mockImplementation(() => ({ demographicsSectionSelector: () => ({}) })));

const mockStore = configureStore();

describe('DemographicsSection', () => {
  let props = {};
  let store = {};

  const reduxWrapper = children => (
    <IntlProvider locale="en">
      <Provider store={store}>{children}</Provider>
    </IntlProvider>
  );

  beforeEach(() => {
    store = mockStore();
    props = {
      updateDraft: jest.fn(),
      formValues: {
        demographics_gender: 'declined',
        demographics_gender_description: '',
        demographics_user_ethnicity: [],
        demographics_income: 'declined',
        demographics_military_history: 'declined',
        demographics_learner_education_level: 'declined',
        demographics_parent_education_level: 'declined',
        demographics_work_status: 'declined',
        demographics_work_status_description: '',
        demographics_current_work_sector: 'declined',
        demographics_future_work_sector: 'declined',
        demographics_user: 1,
        demographicsOptions: {
          actions: {
            POST: {
              gender: {
                choices: [
                  {
                    value: 'woman',
                    display_name: 'Woman',
                  },
                  {
                    value: 'man',
                    display_name: 'Man',
                  },
                  {
                    value: 'non-binary',
                    display_name: 'Non-binary',
                  },
                  {
                    value: 'self-describe',
                    display_name: 'Prefer to self describe',
                  },
                  {
                    value: 'declined',
                    display_name: 'Prefer not to respond',
                  },
                ],
              },
              income: {
                choices: [
                  {
                    value: 'less-than-10k',
                    display_name: 'Less than US $10,000',
                  },
                  {
                    value: '10k-25k',
                    display_name: 'US $10,000 - $25,000',
                  },
                  {
                    value: '25k-50k',
                    display_name: 'US $25,000 - $50,000',
                  },
                  {
                    value: '50k-75k',
                    display_name: 'US $50,000 - $75,000',
                  },
                  {
                    value: '75k-100k',
                    display_name: 'US $75,000 - $100,000',
                  },
                  {
                    value: 'over-100k',
                    display_name: 'Over US $100,000',
                  },
                  {
                    value: 'unsure',
                    display_name: "I don't know",
                  },
                  {
                    value: 'declined',
                    display_name: 'Prefer not to respond',
                  },
                ],
              },
              learner_education_level: {
                choices: [
                  {
                    value: 'no-high-school',
                    display_name: 'No High School',
                  },
                  {
                    value: 'some-high-school',
                    display_name: 'Some High School',
                  },
                  {
                    value: 'high-school-ged-equivalent',
                    display_name: 'High School diploma, GED, or equivalent',
                  },
                  {
                    value: 'some-college',
                    display_name: 'Some college, but no degree',
                  },
                  {
                    value: 'associates',
                    display_name: 'Associates degree',
                  },
                  {
                    value: 'bachelors',
                    display_name: 'Bachelors degree',
                  },
                  {
                    value: 'masters',
                    display_name: 'Masters degree',
                  },
                  {
                    value: 'professional',
                    display_name: 'Professional degree',
                  },
                  {
                    value: 'doctorate',
                    display_name: 'Doctorate degree',
                  },
                  {
                    value: 'declined',
                    display_name: 'Prefer not to respond',
                  },
                ],
              },
              parent_education_level: {
                choices: [
                  {
                    value: 'no-high-school',
                    display_name: 'No High School',
                  },
                  {
                    value: 'some-high-school',
                    display_name: 'Some High School',
                  },
                  {
                    value: 'high-school-ged-equivalent',
                    display_name: 'High School diploma, GED, or equivalent',
                  },
                  {
                    value: 'some-college',
                    display_name: 'Some college, but no degree',
                  },
                  {
                    value: 'associates',
                    display_name: 'Associates degree',
                  },
                  {
                    value: 'bachelors',
                    display_name: 'Bachelors degree',
                  },
                  {
                    value: 'masters',
                    display_name: 'Masters degree',
                  },
                  {
                    value: 'professional',
                    display_name: 'Professional degree',
                  },
                  {
                    value: 'doctorate',
                    display_name: 'Doctorate degree',
                  },
                  {
                    value: 'declined',
                    display_name: 'Prefer not to respond',
                  },
                ],
              },
              military_history: {
                choices: [
                  {
                    value: 'never-served',
                    display_name: 'Never served in the military',
                  },
                  {
                    value: 'training',
                    display_name: 'Only on active duty for training',
                  },
                  {
                    value: 'active',
                    display_name: 'Now on active duty',
                  },
                  {
                    value: 'previously-active',
                    display_name: 'On active duty in the past, but not now',
                  },
                  {
                    value: 'declined',
                    display_name: 'Prefer not to respond',
                  },
                ],
              },
              work_status: {
                choices: [
                  {
                    value: 'full-time',
                    display_name: 'Employed, working full-time',
                  },
                  {
                    value: 'part-time',
                    display_name: 'Employed, working part-time',
                  },
                  {
                    value: 'self-employed',
                    display_name: 'Self-Employed',
                  },
                  {
                    value: 'not-employed-looking',
                    display_name: 'Not employed, looking for work',
                  },
                  {
                    value: 'not-employed-not-looking',
                    display_name: 'Not employed, not looking for work',
                  },
                  {
                    value: 'unable',
                    display_name: 'Unable to work',
                  },
                  {
                    value: 'retired',
                    display_name: 'Retired',
                  },
                  {
                    value: 'other',
                    display_name: 'Other',
                  },
                  {
                    value: 'declined',
                    display_name: 'Prefer not to respond',
                  },
                ],
              },
              current_work_sector: {
                choices: [
                  {
                    value: 'accommodation-food',
                    display_name: 'Accommodation and Food Services',
                  },
                  {
                    value: 'administrative-support-waste-remediation',
                    display_name: 'Administrative and Support and Waste Management and Remediation Services',
                  },
                  {
                    value: 'agriculture-forestry-fishing-hunting',
                    display_name: 'Agriculture, Forestry, Fishing and Hunting',
                  },
                  {
                    value: 'arts-entertainment-recreation',
                    display_name: 'Arts, Entertainment, and Recreation',
                  },
                  {
                    value: 'construction',
                    display_name: 'Construction',
                  },
                  {
                    value: 'educational',
                    display_name: 'Education Services',
                  },
                  {
                    value: 'finance-insurance',
                    display_name: 'Finance and Insurance',
                  },
                  {
                    value: 'healthcare-social',
                    display_name: 'Health Care and Social Assistance',
                  },
                  {
                    value: 'information',
                    display_name: 'Information',
                  },
                  {
                    value: 'management',
                    display_name: 'Management of Companies and Enterprises',
                  },
                  {
                    value: 'manufacturing',
                    display_name: 'Manufacturing',
                  },
                  {
                    value: 'mining-quarry-oil-gas',
                    display_name: 'Mining, Quarrying, and Oil and Gas Extraction',
                  },
                  {
                    value: 'professional-scientific-technical',
                    display_name: 'Professional, Scientific, and Technical Services',
                  },
                  {
                    value: 'public-admin',
                    display_name: 'Public Administration',
                  },
                  {
                    value: 'real-estate',
                    display_name: 'Real Estate and Rental and Leasing',
                  },
                  {
                    value: 'retail',
                    display_name: 'Retail Trade',
                  },
                  {
                    value: 'transport-warehousing',
                    display_name: 'Transportation and Warehousing',
                  },
                  {
                    value: 'utilities',
                    display_name: 'Utilities',
                  },
                  {
                    value: 'trade',
                    display_name: 'Wholesale Trade',
                  },
                  {
                    value: 'other',
                    display_name: 'Other',
                  },
                  {
                    value: 'declined',
                    display_name: 'Prefer not to respond',
                  },
                ],
              },
              future_work_sector: {
                choices: [
                  {
                    value: 'accommodation-food',
                    display_name: 'Accommodation and Food Services',
                  },
                  {
                    value: 'administrative-support-waste-remediation',
                    display_name: 'Administrative and Support and Waste Management and Remediation Services',
                  },
                  {
                    value: 'agriculture-forestry-fishing-hunting',
                    display_name: 'Agriculture, Forestry, Fishing and Hunting',
                  },
                  {
                    value: 'arts-entertainment-recreation',
                    display_name: 'Arts, Entertainment, and Recreation',
                  },
                  {
                    value: 'construction',
                    display_name: 'Construction',
                  },
                  {
                    value: 'educational',
                    display_name: 'Education Services',
                  },
                  {
                    value: 'finance-insurance',
                    display_name: 'Finance and Insurance',
                  },
                  {
                    value: 'healthcare-social',
                    display_name: 'Health Care and Social Assistance',
                  },
                  {
                    value: 'information',
                    display_name: 'Information',
                  },
                  {
                    value: 'management',
                    display_name: 'Management of Companies and Enterprises',
                  },
                  {
                    value: 'manufacturing',
                    display_name: 'Manufacturing',
                  },
                  {
                    value: 'mining-quarry-oil-gas',
                    display_name: 'Mining, Quarrying, and Oil and Gas Extraction',
                  },
                  {
                    value: 'professional-scientific-technical',
                    display_name: 'Professional, Scientific, and Technical Services',
                  },
                  {
                    value: 'public-admin',
                    display_name: 'Public Administration',
                  },
                  {
                    value: 'real-estate',
                    display_name: 'Real Estate and Rental and Leasing',
                  },
                  {
                    value: 'retail',
                    display_name: 'Retail Trade',
                  },
                  {
                    value: 'transport-warehousing',
                    display_name: 'Transportation and Warehousing',
                  },
                  {
                    value: 'utilities',
                    display_name: 'Utilities',
                  },
                  {
                    value: 'trade',
                    display_name: 'Wholesale Trade',
                  },
                  {
                    value: 'other',
                    display_name: 'Other',
                  },
                  {
                    value: 'declined',
                    display_name: 'Prefer not to respond',
                  },
                ],
              },
              user_ethnicity: {
                child: {
                  children: {
                    ethnicity: {
                      choices: [
                        {
                          value: 'american-indian-or-alaska-native',
                          display_name: 'American Indian or Alaska Native',
                        },
                        {
                          value: 'asian',
                          display_name: 'Asian',
                        },
                        {
                          value: 'black-or-african-american',
                          display_name: 'Black or African American',
                        },
                        {
                          value: 'hispanic-latin-spanish',
                          display_name: 'Hispanic, Latin, or Spanish origin',
                        },
                        {
                          value: 'middle-eastern-or-north-african',
                          display_name: 'Middle Eastern or North African',
                        },
                        {
                          value: 'native-hawaiian-or-pacific-islander',
                          display_name: 'Native Hawaiian or Other Pacific Islander',
                        },
                        {
                          value: 'white',
                          display_name: 'White',
                        },
                        {
                          value: 'other',
                          display_name: 'Some other race, ethnicity, or origin',
                        },
                        {
                          value: 'declined',
                          display_name: 'Prefer not to respond',
                        },
                      ],
                    },
                  },
                },
              },
            },
          },
        },
      },
      formErrors: {},
      intl: {},
      forwardRef: () => {},
      drafts: {},
    };
    auth.getAuthenticatedHttpClient = jest.fn(() => ({
      patch: async () => ({
        data: { status: 200 },
        catch: () => {},
      }),
    }));
    auth.getAuthenticatedUser = jest.fn(() => ({ userId: 1 }));
  });

  it('should render', () => {
    const wrapper = renderer.create(reduxWrapper(<IntlDemographicsSection {...props} />)).toJSON();
    expect(wrapper).toMatchSnapshot();
  });

  it('should render an Alert if an error occurs', () => {
    props = {
      ...props,
      formErrors: {
        demographicsError: 'api-error',
      },
    };

    const wrapper = renderer.create(reduxWrapper(<IntlDemographicsSection {...props} />)).toJSON();
    expect(wrapper).toMatchSnapshot();
  });

  it('should set user input correctly when user provides gender self-description', () => {
    props = {
      ...props,
      formValues: {
        ...props.formValues,
        demographics_gender: 'self-describe',
        demographics_gender_description: 'test',
      },
    };

    const wrapper = renderer.create(reduxWrapper(<IntlDemographicsSection {...props} />)).toJSON();
    expect(wrapper).toMatchSnapshot();
  });

  it('should set user input correctly when user provides answers to work_status question', () => {
    props = {
      ...props,
      formValues: {
        ...props.formValues,
        demographics_work_status: 'other',
        demographics_work_status_description: 'test',
      },
    };

    const wrapper = renderer.create(reduxWrapper(<IntlDemographicsSection {...props} />)).toJSON();
    expect(wrapper).toMatchSnapshot();
  });

  it('should render ethnicity text correctly', () => {
    props = {
      ...props,
      formValues: {
        ...props.formValues,
        demographics_user_ethnicity: ['asian'],
      },
    };

    const wrapper = renderer.create(reduxWrapper(<IntlDemographicsSection {...props} />)).toJSON();
    expect(wrapper).toMatchSnapshot();
  });

  it('should render ethnicity correctly when multiple options are selected', () => {
    props = {
      ...props,
      formValues: {
        ...props.formValues,
        demographics_user_ethnicity: ['hispanic-latin-spanish', 'white'],
      },
    };

    const wrapper = renderer.create(reduxWrapper(<IntlDemographicsSection {...props} />)).toJSON();
    expect(wrapper).toMatchSnapshot();
  });

  it('should render an Alert when demographicsOptions props are empty', () => {
    props = {
      ...props,
      formValues: {
        demographicsOptions: null,
      },
    };

    const wrapper = renderer.create(reduxWrapper(<IntlDemographicsSection {...props} />)).toJSON();
    expect(wrapper).toMatchSnapshot();
  });
});
