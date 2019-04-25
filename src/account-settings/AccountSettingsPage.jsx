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
    this.props.fetchAccount();
  }

  renderSection({
    sectionHeading, sectionDescription, fields,
  }) {
    return (
      <div key={this.props.intl.formatMessage(sectionHeading)}>
        <h2>{this.props.intl.formatMessage(sectionHeading)}</h2>
        <p>{this.props.intl.formatMessage(sectionDescription)}</p>
        {fields.map(field => (
          <EditableField
            {...field}
            label={this.props.intl.formatMessage(field.label)}
            key={field.name}
            isEditing={this.props.openFormId === field.name}
          />
        ), this)}
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
    sectionHeading: PropTypes.object,
    sectionDescription: PropTypes.object,
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
      sectionHeading: messages['account.settings.section.account.information'],
      sectionDescription: messages['account.settings.section.account.information.description'],
      fields: [
        {
          name: 'username',
          isEditable: false,
          label: messages['account.settings.field.username'],
          type: 'text',
        },
        {
          name: 'name',
          isEditable: true,
          label: messages['account.settings.field.full.name'],
          type: 'text',
        },
        {
          name: 'email',
          isEditable: true,
          label: messages['account.settings.field.email'],
          type: 'email',
        },
        {
          name: 'year_of_birth',
          isEditable: true,
          label: messages['account.settings.field.dob'],
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
