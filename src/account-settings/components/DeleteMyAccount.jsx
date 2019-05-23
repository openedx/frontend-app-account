import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from '@edx/frontend-i18n';
import { Button, Hyperlink, Input, Modal, ValidationFormGroup } from '@edx/paragon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

import Alert from './Alert';
import { deleteAccount, deleteAccountConfirmation, deleteAccountReset } from '../actions';
import messages from '../AccountSettingsPage.messages';

const passwordFieldId = 'passwordFieldId';

class DeleteMyAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleFinalClose = this.handleFinalClose.bind(this);
  }

  handleSubmit() {
    this.props.deleteAccount(this.state.password);
  }

  handleCancel() {
    this.setState({ password: '' });
    this.props.deleteAccountReset();
  }

  handlePasswordChange(e) {
    this.setState({ password: e.target.value });
  }

  handleFinalClose() {
    global.location = this.props.logoutUrl;
  }

  renderPrintingInstructions() {
    return (<FormattedMessage
      id="account.settings.delete.account.text.3"
      defaultMessage="You may also lose access to verified certificates and other program credentials like MicroMasters certificates. If you want to make a copy of these for your records before proceeding with deletion, {actionLink}."
      description="A message in the user account deletion area"
      values={{
        actionLink: (
          <Hyperlink
            destination="https://edx.readthedocs.io/projects/edx-guide-for-students/en/latest/SFD_certificates.html#printing-a-certificate"
          >
            {this.props.intl.formatMessage(messages['account.settings.delete.account.text.3.link'])}
          </Hyperlink>
          ),
      }}
    />);
  }

  renderBeforeProceedingBanner(instructionMessageId, supportUrl) {
    return (
      <Alert
        className="alert-warning mt-n2"
        icon={<FontAwesomeIcon className="mr-2" icon={faExclamationTriangle} />}
      >
        <FormattedMessage
          id="account.settings.delete.account.before.proceeding"
          defaultMessage="Before proceeding, please {actionLink}."
          description="Error that appears if you are trying to delete your edX account, but something about your account needs attention first.  The actionLink will be instructions, such as 'unlink your Facebook account'."
          values={{
            actionLink: (
              <Hyperlink
                destination={supportUrl}
              >
                {this.props.intl.formatMessage(messages[instructionMessageId])}
              </Hyperlink>
            ),
          }}
        />
      </Alert>);
  }

  render() {
    const { hasLinkedTPA, isVerifiedAccount, intl } = this.props;
    const canDelete = isVerifiedAccount && !hasLinkedTPA;

    return (
      <div>
        <h2 className="section-heading">
          {intl.formatMessage(messages['account.settings.delete.account.header'])}
        </h2>
        <p>
          {intl.formatMessage(messages['account.settings.delete.account.subheader'])}
        </p>
        <p>
          {intl.formatMessage(messages['account.settings.delete.account.text.1'])}
        </p>
        <p>
          {intl.formatMessage(messages['account.settings.delete.account.text.2'])}
        </p>
        <p>
          {this.renderPrintingInstructions()}
        </p>
        <p className="text-danger h6">
          {intl.formatMessage(messages['account.settings.delete.account.text.warning'])}
        </p>
        <p>
          <Hyperlink destination="https://support.edx.org/hc/en-us/sections/115004139268-Manage-Your-Account-Settings">
            {intl.formatMessage(messages['account.settings.delete.account.text.change.instead'])}
          </Hyperlink>
        </p>
        <p>
          <Button
            className="btn-outline-danger"
            onClick={canDelete ? this.props.deleteAccountConfirmation : null}
            disabled={!canDelete}
          >
            {intl.formatMessage(messages['account.settings.delete.account.button'])}
          </Button>
        </p>

        {isVerifiedAccount ? null
          :
          this.renderBeforeProceedingBanner('account.settings.delete.account.please.activate', 'https://support.edx.org/hc/en-us/articles/115000940568-How-do-I-activate-my-account-')
        }

        {hasLinkedTPA ?
          this.renderBeforeProceedingBanner('account.settings.delete.account.please.unlink', 'https://support.edx.org/hc/en-us/articles/207206067')
          : null
        }

        <Modal
          open={['confirming', 'pending', 'failed'].includes(this.props.accountDeletionState)}
          title={intl.formatMessage(messages['account.settings.delete.account.modal.header'])}
          body={(
            <div>

              {this.props.deletionError ?
                <Alert
                  className="alert-danger mt-n2"
                  icon={<FontAwesomeIcon className="mr-2" icon={faExclamationCircle} />}
                >
                  <p className="h6">
                    {intl.formatMessage(messages['account.settings.delete.error.unable.to.delete'])}
                  </p>
                  <p className="text-danger">
                    {intl.formatMessage(messages['account.settings.delete.error.unable.to.delete.details'])}
                  </p>
                </Alert>
                : null
              }

              <Alert
                className="alert-warning mt-n2"
                icon={<FontAwesomeIcon className="mr-2" icon={faExclamationTriangle} />}
              >
                <p className="h6">
                  {intl.formatMessage(messages['account.settings.delete.account.modal.text.1'])}
                </p>
                <p>
                  {intl.formatMessage(messages['account.settings.delete.account.modal.text.2'])}
                </p>
                <p>
                  {this.renderPrintingInstructions()}
                </p>
              </Alert>
              <p className="h6">
                {intl.formatMessage(messages['account.settings.delete.account.modal.enter.password'])}
              </p>
              <ValidationFormGroup
                for={passwordFieldId}
                invalid={this.props.deletionError != null}
                invalidMessage={intl.formatMessage(messages['account.settings.delete.error.unable.to.delete'])}
              >
                <label
                  className="d-block"
                  htmlFor={passwordFieldId}
                >{intl.formatMessage(messages['account.settings.delete.account.modal.password'])}
                </label>
                <Input
                  name="password"
                  id={passwordFieldId}
                  type="password"
                  value={this.state.password}
                  onChange={this.handlePasswordChange}
                />
              </ValidationFormGroup>
            </div>
          )}
          buttons={[
            <Button className="btn-danger" onClick={this.handleSubmit} disabled={this.state.password.length === 0}>
              {intl.formatMessage(messages['account.settings.delete.account.modal.confirm.delete'])}
            </Button>]}
          closeText={intl.formatMessage(messages['account.settings.editable.field.action.cancel'])}
          renderHeaderCloseButton={false}
          onClose={this.handleCancel}
        />

        <Modal
          open={this.props.accountDeletionState === 'deleted'}
          title={intl.formatMessage(messages['account.settings.delete.account.modal.after.header'])}
          body={(
            <div>
              <p className="h6">
                {intl.formatMessage(messages['account.settings.delete.account.modal.after.text'])}
              </p>
            </div>
          )}
          closeText={intl.formatMessage(messages['account.settings.delete.account.modal.after.button'])}
          renderHeaderCloseButton={false}
          onClose={this.handleFinalClose}
        />
      </div>
    );
  }
}

DeleteMyAccount.propTypes = {
  deleteAccount: PropTypes.func.isRequired,
  deleteAccountConfirmation: PropTypes.func.isRequired,
  deleteAccountReset: PropTypes.func.isRequired,
  accountDeletionState: PropTypes.oneOf(['confirming', 'pending', 'deleted', 'failed']),
  deletionError: PropTypes.oneOf(['empty-password', 'server']),
  hasLinkedTPA: PropTypes.bool,
  isVerifiedAccount: PropTypes.bool,
  logoutUrl: PropTypes.string.isRequired,
  intl: intlShape.isRequired,
};

DeleteMyAccount.defaultProps = {
  hasLinkedTPA: false,
  isVerifiedAccount: true,
  accountDeletionState: null,
  deletionError: null,
};

export default connect(
  state => ({
    deletionError: state.accountSettings.deletionError,
    accountDeletionState: state.accountSettings.accountDeletionState,
  }),
  {
    deleteAccount,
    deleteAccountConfirmation,
    deleteAccountReset,
  },
)(injectIntl(DeleteMyAccount));
