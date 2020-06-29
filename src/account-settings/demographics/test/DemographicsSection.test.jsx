import * as auth from '@edx/frontend-platform/auth';
import * as selectors from '../../data/selectors';

import { IntlProvider, injectIntl } from '@edx/frontend-platform/i18n';

import DemographicsSection from '../DemographicsSection';
import { Provider } from 'react-redux';
import React from 'react';
import { SELF_DESCRIBE } from '../../data/constants';
import { act } from 'react-dom/test-utils';
import configureStore from 'redux-mock-store';
import { faItalic } from '@fortawesome/free-solid-svg-icons';
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
    selectors.mockClear(); // TJ thinks this may not be needed, I can test with removing it and see if everything still works
    
    const reduxWrapper = children => (
        <IntlProvider locale="en">
            <Provider store={store}>{children}</Provider>
        </IntlProvider>
    );
    
    // same as a "Setup method"
    beforeEach(() => {
        store = mockStore();
        props = {
            updateDraft: undefined, //?
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
        auth.getAuthenticatedUser = jest.fn(() => ({ userId: 3 }));
    });

    // each "it" is an individual unit test
    it('should render', () => {
        const wrapper = renderer.create(reduxWrapper(<IntlDemographicsSection {...props} />)).toJSON();
        expect(wrapper).toMatchSnapshot();
    });

    it('should render alert if error occurred', () => {
        props = {
            ...props,
            formErrors: {
                demographicsError: "api-error"
            }
        };

        const wrapper = renderer.create(reduxWrapper(<IntlDemographicsSection {...props} />)).toJSON();
        expect(wrapper).toMatchSnapshot();
    });
});
