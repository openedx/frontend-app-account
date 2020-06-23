import * as auth from '@edx/frontend-platform/auth';
import * as selectors from '../../data/selectors';

import { IntlProvider, injectIntl } from '@edx/frontend-platform/i18n';

import DemographicsSection from '../DemographicsSection';
import { Provider } from 'react-redux';
import React from 'react';
import configureStore from 'redux-mock-store';
import renderer from 'react-test-renderer';

jest.mock('@edx/frontend-platform/auth');

const IntlDemographicsSection = injectIntl(DemographicsSection);

jest.mock('../../data/selectors', () => {
   return jest.fn().mockImplementation(() => ({ demographicsSectionSelector: () => ({}) })); 
});

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
            },
            formErrors: {},
            intl: {},
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
                demographicsError: "api-error"
            }
        };

        const wrapper = renderer.create(reduxWrapper(<IntlDemographicsSection {...props} />)).toJSON();
        expect(wrapper).toMatchSnapshot();
    });
    
    it('should set user input correctly when user provides gender self-description', () => {
        props = {
            ...props,
            formValues: {
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
                demographics_work_status: 'other',
                demographics_work_status_description: 'test',
            }
        }

        const wrapper = renderer.create(reduxWrapper(<IntlDemographicsSection {...props} />)).toJSON();
        expect(wrapper).toMatchSnapshot();
    });

    it('should render ethnicity text correctly', () => {
        props = {
            ...props,
            formValues: {
                demographics_user_ethnicity: ['asian']
            }
        }
        
        const wrapper = renderer.create(reduxWrapper(<IntlDemographicsSection {...props} />)).toJSON();
        expect(wrapper).toMatchSnapshot();
    });

    it('should render ethnicity correctly when multiple options are selected', () => {
        props = {
            ...props,
            formValues: {
                demographics_user_ethnicity: ['hispanic-latin-spanish', 'white']
            }
        }

        const wrapper = renderer.create(reduxWrapper(<IntlDemographicsSection {...props} />)).toJSON();
        expect(wrapper).toMatchSnapshot();
    });
});
