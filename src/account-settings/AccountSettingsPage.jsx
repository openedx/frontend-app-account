import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';

import messages from './AccountSettingsPage.messages';

import { fetchAccount, openForm, closeForm, saveAccount } from './actions';
import { pageSelector } from './selectors';

import { PageLoading } from '../common';
import EditableField from './components/EditableField';


class AccountSettingsPage extends React.Component {
  componentDidMount() {
    this.props.fetchAccount('Hello example data!');
  }

  renderSection({
    sectionHeading, sectionDescription, fields,
  }) {
    return (
      <div key={sectionHeading}>
        <h2>{sectionHeading}</h2>
        <p>{sectionDescription}</p>
        {fields.map(field => (
          <EditableField
            {...field}
            key={field.name}
            isEditing={this.props.openFormId === field.name}
          />
        ))}
      </div>
    );
  }

  renderContent() {
    return (
      <div>
        <div className="row">
          <div className="col-md-8 col-lg-6">
            {this.props.fieldSections.map(this.renderSection, this)}
          </div>
        </div>
      </div>
    );
  }

  renderError() {
    return (
      <div>
        {this.props.intl.formatMessage(messages['account.settings.loading.error'], {
          error: this.props.loadingError,
        })}
      </div>
    );
  }

  renderLoading() {
    return (
      <PageLoading srMessage={this.props.intl.formatMessage(messages['account.settings.loading.message'])} />
    );
  }

  render() {
    const {
      loading,
      loaded,
      loadingError,
    } = this.props;

    return (
      <div className="page__account-settings container-fluid py-5">
        <h1>
          {this.props.intl.formatMessage(messages['account.settings.page.heading'])}
        </h1>
        {loading ? this.renderLoading() : null}
        {loaded ? this.renderContent() : null}
        {loadingError ? this.renderError() : null}
      </div>
    );
  }
}

AccountSettingsPage.propTypes = {
  intl: intlShape.isRequired,
  loading: PropTypes.bool,
  loaded: PropTypes.bool,
  loadingError: PropTypes.string,
  openFormId: PropTypes.string,
  fieldSections: PropTypes.arrayOf(PropTypes.shape({
    sectionHeading: PropTypes.node,
    sectionDescription: PropTypes.node,
    fields: PropTypes.array,
  })),

  fetchAccount: PropTypes.func.isRequired,
  openForm: PropTypes.func.isRequired,
  closeForm: PropTypes.func.isRequired,
  saveAccount: PropTypes.func.isRequired,
};

AccountSettingsPage.defaultProps = {
  loading: false,
  loaded: false,
  loadingError: null,
  openFormId: null,
  fieldSections: [
    {
      sectionHeading: 'Account Information',
      sectionDescription: 'These settings include basic information about your account.',
      fields: [
        {
          name: 'fullname',
          label: 'Full Name',
          type: 'text',
          helpText: 'The name that is used for ID verification and that appears on your certificates.',
        },
        {
          name: 'email',
          label: 'Email address',
          type: 'email',
          helpText: 'You receive messages from Your Platform Name Here and course teams at this address.',
        },
        {
          name: 'yearofbirth',
          label: 'Year of birth',
          type: 'select',
          options: (() => {
            const currentYear = new Date().getFullYear();
            const years = [];
            let startYear = currentYear - 120;
            while (startYear < currentYear) {
              startYear += 1;
              years.push({ value: startYear, label: startYear });
            }
            return years.reverse();
          })(),
          defaultValue: new Date().getFullYear() - 35,
          helpText: 'You receive messages from Your Platform Name Here and course teams at this address.',
        },
      ],
    },
  ],
};


export default connect(pageSelector, {
  fetchAccount,
  openForm,
  closeForm,
  saveAccount,
})(injectIntl(AccountSettingsPage));
