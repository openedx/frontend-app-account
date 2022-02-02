import React, { useState, useContext, useEffect } from 'react';
import { getConfig, history } from '@edx/frontend-platform';
import {
  Alert, Hyperlink, Input, Button, Spinner,
} from '@edx/paragon';
import { Link } from 'react-router-dom';
import { injectIntl, intlShape, FormattedMessage } from '@edx/frontend-platform/i18n';

import { submitIdVerification } from '../data/service';
import { useNextPanelSlug } from '../routing-utilities';
import BasePanel from './BasePanel';
import IdVerificationContext from '../IdVerificationContext';
import ImagePreview from '../ImagePreview';

import messages from '../IdVerification.messages';
import CameraHelpWithUpload from '../CameraHelpWithUpload';
import SupportedMediaTypes from '../SupportedMediaTypes';

function SummaryPanel(props) {
  const panelSlug = 'summary';
  const nextPanelSlug = useNextPanelSlug(panelSlug);
  const {
    facePhotoFile,
    idPhotoFile,
    profileDataManager,
    nameOnAccount,
    idPhotoName,
    stopUserMedia,
    setReachedSummary,
  } = useContext(IdVerificationContext);
  const nameToBeUsed = idPhotoName || nameOnAccount || '';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);

  useEffect(() => setReachedSummary(true), []);

  function renderManagedProfileMessage() {
    if (!profileDataManager) {
      return null;
    }

    return (
      <p id="profile-manager-warning">
        <FormattedMessage
          id="id.verification.account.name.summary.alert"
          defaultMessage="Your account settings are managed by {managerTitle}. If the name on your photo ID does not match the name on your account, please contact your {profileDataManager} administrator or {support} for help."
          description="Alert message informing the user their account data is managed by a third party."
          values={{
            managerTitle: <strong>{profileDataManager}</strong>,
            profileDataManager,
            support: (
              <Hyperlink destination={getConfig().SUPPORT_URL} target="_blank">
                {props.intl.formatMessage(messages['id.verification.support'])}
              </Hyperlink>
            ),
          }}
        />
      </p>
    );
  }

  function SubmitButton() {
    async function handleClick() {
      setIsSubmitting(true);
      const verificationData = {
        facePhotoFile,
        idPhotoFile,
        courseRunKey: sessionStorage.getItem('courseRunKey'),
      };
      if (idPhotoName) {
        verificationData.idPhotoName = idPhotoName;
      } else {
        /**
         * If learner has not entered an idPhotoName on the GetNameIdPanel,
         * use the current nameOnAccount when submitting IDV.
         */
        verificationData.idPhotoName = nameOnAccount;
      }
      const result = await submitIdVerification(verificationData);
      if (result.success) {
        stopUserMedia();
        history.push(nextPanelSlug);
      } else {
        stopUserMedia();
        setIsSubmitting(false);
        setSubmissionError(result);
      }
    }
    return (
      <Button
        title="Confirmation"
        disabled={isSubmitting}
        onClick={handleClick}
        data-testid="submit-button"
      >
        {props.intl.formatMessage(messages['id.verification.review.confirm'])}
      </Button>
    );
  }

  function getError() {
    if (submissionError.status === 400) {
      if (submissionError.message.includes('face_image')) {
        return props.intl.formatMessage(messages['id.verification.submission.alert.error.face']);
      }
      if (submissionError.message.includes('Photo ID image')) {
        return props.intl.formatMessage(messages['id.verification.submission.alert.error.id']);
      }
      if (submissionError.message.includes('Name')) {
        return props.intl.formatMessage(messages['id.verification.submission.alert.error.name']);
      }
      if (submissionError.message.includes('unsupported format')) {
        return (
          <>
            {props.intl.formatMessage(messages['id.verification.submission.alert.error.unsupported'])}
            <SupportedMediaTypes />
          </>
        );
      }
    }
    return (
      <FormattedMessage
        id="idv.submission.alert.error"
        defaultMessage={`
          We encountered a technical error while trying to submit ID verification.
          This might be a temporary issue, so please try again in a few minutes.
          If the problem persists, please go to {support_link} for help.
        `}
        values={{
          support_link: (
            <Alert.Link href="https://support.edx.org/hc/en-us">
              {props.intl.formatMessage(
                messages['id.verification.review.error'],
                { siteName: getConfig().SITE_NAME },
              )}
            </Alert.Link>
          ),
        }}
      />
    );
  }

  return (
    <BasePanel
      name={panelSlug}
      title={props.intl.formatMessage(messages['id.verification.review.title'])}
    >
      {submissionError && (
        <Alert
          variant="danger"
          data-testid="submission-error"
          dismissible
          onClose={() => setSubmissionError(null)}
        >
          {getError()}
        </Alert>
      )}
      <p>
        {props.intl.formatMessage(messages['id.verification.review.description'])}
      </p>
      <div className="row mb-4">
        <div className="col-6">
          <label htmlFor="photo-of-face" className="font-weight-bold">
            {props.intl.formatMessage(messages['id.verification.review.portrait.label'])}
          </label>
          <ImagePreview
            id="photo-of-face"
            src={facePhotoFile}
            alt={props.intl.formatMessage(messages['id.verification.review.portrait.alt'])}
          />
          <Link
            className="btn btn-outline-primary"
            to={{
              pathname: 'take-portrait-photo',
              state: { fromSummary: true },
            }}
            data-testid="portrait-retake"
          >
            {props.intl.formatMessage(messages['id.verification.review.portrait.retake'])}
          </Link>
        </div>
        <div className="col-6">
          <label htmlFor="photo-of-id/edit" className="font-weight-bold">
            {props.intl.formatMessage(messages['id.verification.review.id.label'])}
          </label>
          <ImagePreview
            id="photo-of-id"
            src={idPhotoFile}
            alt={props.intl.formatMessage(messages['id.verification.review.id.alt'])}
          />
          <Link
            className="btn btn-outline-primary"
            to={{
              pathname: 'take-id-photo',
              state: { fromSummary: true },
            }}
            data-testid="id-retake"
          >
            {props.intl.formatMessage(messages['id.verification.review.id.retake'])}
          </Link>
        </div>
      </div>
      <CameraHelpWithUpload />
      <div className="form-group">
        <label htmlFor="name-to-be-used" className="font-weight-bold">
          {props.intl.formatMessage(messages['id.verification.name.label'])}
        </label>
        {renderManagedProfileMessage()}
        <div className="d-flex">
          <Input
            id="name-to-be-used"
            type="text"
            disabled
            value={nameToBeUsed}
            onChange={() => {}}
            aria-describedby={profileDataManager ? 'profile-manager-warning' : null}
          />
          {!profileDataManager && (
            <Link
              className="btn btn-link ml-3 px-0"
              to={{
                pathname: 'get-name-id',
                state: { fromSummary: true },
              }}
            >
              <FormattedMessage
                id="id.verification.account.name.edit"
                defaultMessage="Edit {sr}"
                description="Button to edit name, with clarifying information for screen readers."
                values={{
                  sr: <span className="sr-only">Name</span>,
                }}
              />
            </Link>
          )}
        </div>
      </div>
      <SubmitButton />{' '}
      {isSubmitting && <Spinner animation="border" variant="primary" />}
    </BasePanel>
  );
}

SummaryPanel.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(SummaryPanel);
