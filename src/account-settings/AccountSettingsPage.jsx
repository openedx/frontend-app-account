import React, {
  useContext, useEffect, useRef,
} from 'react';
import {
  SiteContext,
  sendTrackingLogEvent,
  useIntl,
  FormattedMessage,
  getSiteConfig,
  getAppConfig,
} from '@openedx/frontend-base';

import findIndex from 'lodash.findindex';
import { Hyperlink, Alert } from '@openedx/paragon';
import { CheckCircle, Error, WarningFilled } from '@openedx/paragon/icons';

import messages from '@src/account-settings/AccountSettingsPage.messages';
import { AccountSettingsFormProvider, useAccountSettingsForm } from '@src/account-settings/data/FormContext';
import { useAccountSettingsData } from '@src/account-settings/data/hooks';
import { useFieldHandlers } from '@src/account-settings/fields/hooks';
import PageLoading from '@src/account-settings/PageLoading';
import JumpNav from '@src/account-settings/JumpNav';
import DeleteAccount from '@src/account-settings/delete-account';
import NameChange from '@src/account-settings/name-change';
import ThirdPartyAuth from '@src/account-settings/third-party-auth';
import OneTimeDismissibleAlert from '@src/account-settings/OneTimeDismissibleAlert';
import DOBModal from '@src/account-settings/DOBForm';
import { COPPA_COMPLIANCE_YEAR } from '@src/account-settings/data/constants';
import NotificationSettings from '@src/notification-preferences/NotificationSettings';
import AccountSettingsSectionSlot from '@src/slots/AccountSettingsSectionSlot';
import { appId } from '@src/constants';
import { parseEnvArray, parseEnvBoolean } from '@src/utils';

const NAV_LINK_IDS = [
  '#basic-information',
  '#profile-information',
  '#social-media',
  '#notifications',
  '#site-preferences',
  '#linked-accounts',
  '#delete-account',
];

const AccountSettingsPageContent = () => {
  const intl = useIntl();
  const { authenticatedUser } = useContext(SiteContext);
  const {
    isPending,
    isError,
    committedValues,
    formValues,
    mostRecentVerifiedName,
    profileDataManager,
    tpaProviders,
    thirdPartyAuthError,
    isActive,
  } = useAccountSettingsData();
  const { nameChangeModal } = useAccountSettingsForm();
  const fieldHandlers = useFieldHandlers();

  const navLinkRefs = useRef(Object.fromEntries(NAV_LINK_IDS.map(id => [id, React.createRef()])));
  const loaded = !isPending && !isError;
  const wasLoaded = useRef(false);

  useEffect(() => {
    sendTrackingLogEvent('edx.user.settings.viewed', {
      page: 'account',
      visibility: null,
      user_id: authenticatedUser.userId,
    });
  }, [authenticatedUser.userId]);

  useEffect(() => {
    if (!loaded || wasLoaded.current) {
      return;
    }
    wasLoaded.current = true;

    // Check for the locationHash in the URL and then scroll to it if it is in the NavLinks list
    const locationHash = global.location.hash;
    if (typeof locationHash !== 'string') {
      return;
    }
    const ref = navLinkRefs.current[locationHash];
    if (ref && ref.current) {
      window.scrollTo(0, ref.current.offsetTop);
    }
  }, [loaded]);

  const canDeleteAccount = () => (
    !parseEnvArray(getAppConfig(appId).COUNTRIES_WITH_DELETE_ACCOUNT_DISABLED).includes(committedValues.country)
  );

  // Enterprise customer profiles are managed by their organizations. We determine whether
  // a profile is managed or not by the presence of the profileDataManager prop.
  const isManagedProfile = () => Boolean(profileDataManager);

  const renderThirdPartyAuthErrorMessage = () => {
    if (!thirdPartyAuthError) {
      return null;
    }

    // The LMS records a message when a third-party auth attempt fails (for instance, when the
    // provider account the user tried to link is already linked to another account) and exposes it
    // through the third_party_auth_error endpoint. The message is already localized and consumed on
    // read, so it is only displayed once.
    return (
      <div>
        <Alert variant="danger" icon={Error}>
          {thirdPartyAuthError}
        </Alert>
      </div>
    );
  };

  const renderManagedProfileMessage = () => {
    if (!isManagedProfile()) {
      return null;
    }

    return (
      <div>
        <Alert variant="info">
          <FormattedMessage
            id="account.settings.message.managed.settings"
            defaultMessage="Your profile settings are managed by {managerTitle}. Contact your administrator or {support} for help."
            description="alert message informing the user their account data is managed by a third party"
            values={{
              managerTitle: <b>{profileDataManager}</b>,
              support: (
                <Hyperlink destination={getAppConfig(appId).SUPPORT_URL} target="_blank">
                  <FormattedMessage
                    id="account.settings.message.managed.settings.support"
                    defaultMessage="support"
                    description="website support"
                  />
                </Hyperlink>
              ),
            }}
          />
        </Alert>
      </div>
    );
  };

  const renderVerifiedNameSuccessMessage = (verifiedNameValue, created) => {
    const dateValue = new Date(created).valueOf();
    const id = `dismissedVerifiedNameSuccessMessage-${verifiedNameValue}-${dateValue}`;

    return (
      <OneTimeDismissibleAlert
        id={id}
        variant="success"
        icon={CheckCircle}
        header={intl.formatMessage(messages['account.settings.field.name.verified.success.message.header'])}
        body={intl.formatMessage(messages['account.settings.field.name.verified.success.message'])}
      />
    );
  };

  const renderVerifiedNameFailureMessage = (verifiedNameValue, created) => {
    const dateValue = new Date(created).valueOf();
    const id = `dismissedVerifiedNameFailureMessage-${verifiedNameValue}-${dateValue}`;

    return (
      <OneTimeDismissibleAlert
        id={id}
        variant="danger"
        icon={Error}
        header={intl.formatMessage(messages['account.settings.field.name.verified.failure.message.header'])}
        body={
          (
            <div className="d-flex flex-row">
              {intl.formatMessage(messages['account.settings.field.name.verified.failure.message'])}
            </div>
          )
        }
      />
    );
  };

  const renderVerifiedNameSubmittedMessage = (willCertNameChange) => (
    <Alert
      variant="warning"
      icon={WarningFilled}
    >
      <Alert.Heading>
        {intl.formatMessage(messages['account.settings.field.name.verified.submitted.message.header'])}
      </Alert.Heading>
      <p>
        {intl.formatMessage(messages['account.settings.field.name.verified.submitted.message'])}{' '}
        {
          willCertNameChange
          && intl.formatMessage(messages['account.settings.field.name.verified.submitted.message.certificate'])
        }
      </p>
    </Alert>
  );

  const renderVerifiedNameMessage = (verifiedNameRecord) => {
    const {
      created,
      status,
      profile_name: profileName,
      verified_name: verifiedNameValue,
      proctored_exam_attempt_id: proctoredExamId,
    } = verifiedNameRecord;
    let willCertNameChange = false;

    if (
      (
        // User submitted a profile name change, and uses their profile name on certificates
        committedValues.name !== profileName
        && !committedValues.useVerifiedNameForCerts
      )
      || (
        // User submitted a verified name change, and uses their verified name on certificates
        committedValues.name === profileName
        && committedValues.useVerifiedNameForCerts
      )
    ) {
      willCertNameChange = true;
    }

    if (proctoredExamId) {
      return null;
    }

    switch (status) {
      case 'approved':
        return renderVerifiedNameSuccessMessage(verifiedNameValue, created);
      case 'denied':
        return renderVerifiedNameFailureMessage(verifiedNameValue, created);
      case 'submitted':
        return renderVerifiedNameSubmittedMessage(willCertNameChange);
      default:
        return null;
    }
  };

  const renderNameChangeModal = () => {
    if (nameChangeModal && nameChangeModal.formId) {
      return <NameChange targetFormId={nameChangeModal.formId} />;
    }
    return null;
  };

  const renderContent = () => {
    const hasLinkedTPA = findIndex(tpaProviders, provider => provider.connected) >= 0;

    // if user is under 13 and does not have cookie set
    const {
      ENABLE_COPPA_COMPLIANCE, ENABLE_DOB_UPDATE, ENABLE_ACCOUNT_DELETION,
    } = getAppConfig(appId);
    const shouldUpdateDOB = (
      parseEnvBoolean(ENABLE_COPPA_COMPLIANCE)
      && parseEnvBoolean(ENABLE_DOB_UPDATE)
      && String(formValues.year_of_birth ?? '') >= COPPA_COMPLIANCE_YEAR.toString()
      && !localStorage.getItem('submittedDOB')
    );
    return (
      <>
        { shouldUpdateDOB
          && (
          <DOBModal
            {...fieldHandlers}
          />
          )}
        <div className="account-section pt-3 mb-5" id="basic-information" ref={navLinkRefs.current['#basic-information']}>
          {
            mostRecentVerifiedName
            && renderVerifiedNameMessage(mostRecentVerifiedName)
          }
          {localStorage.getItem('submittedDOB')
            && (
            <OneTimeDismissibleAlert
              id="updated-dob"
              variant="success"
              icon={CheckCircle}
              header={intl.formatMessage(messages['account.settings.field.dob.form.success'])}
              body=""
            />
            )}

          <h2 className="section-heading h4 mb-3">
            {intl.formatMessage(messages['account.settings.section.account.information'])}
          </h2>
          <p>{intl.formatMessage(messages['account.settings.section.account.information.description'])}</p>
          {renderManagedProfileMessage()}

          {renderNameChangeModal()}

          <AccountSettingsSectionSlot section="basicInformation" />
        </div>

        <div className="account-section pt-3 mb-5" id="profile-information" ref={navLinkRefs.current['#profile-information']}>
          <h2 className="section-heading h4 mb-3">
            {intl.formatMessage(messages['account.settings.section.profile.information'])}
          </h2>

          <AccountSettingsSectionSlot section="profileInformation" />
        </div>
        <div className="account-section pt-3 mb-6" id="social-media">
          <h2 className="section-heading h4 mb-3">
            {intl.formatMessage(messages['account.settings.section.social.media'])}
          </h2>
          <p>
            {intl.formatMessage(
              messages['account.settings.section.social.media.description'],
              { siteName: getSiteConfig().siteName },
            )}
          </p>

          <AccountSettingsSectionSlot section="socialMedia" />
        </div>
        <div className="border border-light-700" />
        <div className="mt-6" id="notifications" ref={navLinkRefs.current['#notifications']}>
          <NotificationSettings />
        </div>
        <div className="account-section mb-5" id="site-preferences" ref={navLinkRefs.current['#site-preferences']}>
          <h2 className="section-heading h4 mb-3">
            {intl.formatMessage(messages['account.settings.section.site.preferences'])}
          </h2>

          <AccountSettingsSectionSlot section="sitePreferences" />
        </div>

        <div className="account-section pt-3 mb-5" id="linked-accounts" ref={navLinkRefs.current['#linked-accounts']}>
          <h2 className="section-heading h4 mb-3">{intl.formatMessage(messages['account.settings.section.linked.accounts'])}</h2>
          <p>
            {intl.formatMessage(
              messages['account.settings.section.linked.accounts.description'],
              { siteName: getSiteConfig().siteName },
            )}
          </p>
          <ThirdPartyAuth />
        </div>

        {parseEnvBoolean(ENABLE_ACCOUNT_DELETION) && (
          <div className="account-section pt-3 mb-5" id="delete-account" ref={navLinkRefs.current['#delete-account']}>
            <DeleteAccount
              isVerifiedAccount={isActive}
              hasLinkedTPA={hasLinkedTPA}
              canDeleteAccount={canDeleteAccount()}
            />
          </div>
        )}
      </>
    );
  };

  const renderError = () => (
    <Alert variant="danger">
      <Alert.Heading>
        {intl.formatMessage(messages['account.settings.loading.error.heading'])}
      </Alert.Heading>
      <p>
        {intl.formatMessage(messages['account.settings.loading.error.body'])}
      </p>
    </Alert>
  );

  const renderLoading = () => (
    <PageLoading srMessage={intl.formatMessage(messages['account.settings.loading.message'])} />
  );

  return (
    <div className="page__account-settings">
      {renderThirdPartyAuthErrorMessage()}
      <h1 className="mb-4">
        {intl.formatMessage(messages['account.settings.page.heading'])}
      </h1>
      <div>
        <div className="row">
          <div className="col-md-3">
            <JumpNav />
          </div>
          <div className="col-md-9">
            {isPending && !isError ? renderLoading() : null}
            {loaded ? renderContent() : null}
            {isError ? renderError() : null}
          </div>
        </div>
      </div>
    </div>
  );
};

const AccountSettingsPage = () => (
  <AccountSettingsFormProvider>
    <AccountSettingsPageContent />
  </AccountSettingsFormProvider>
);

export default AccountSettingsPage;
