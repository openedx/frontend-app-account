import React, { useContext } from 'react';
import { history } from '@edx/frontend-platform';
import { Input, Button } from '@edx/paragon';
import { Link } from 'react-router-dom';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import { submitIdVerification } from '../data/service';
import { useNextPanelSlug } from '../routing-utilities';
import BasePanel from './BasePanel';
import { IdVerificationContext } from '../IdVerificationContext';
import ImagePreview from '../ImagePreview';

import messages from '../IdVerification.messages';

function SummaryPanel(props) {
  const panelSlug = 'summary';
  const nextPanelSlug = useNextPanelSlug(panelSlug);
  const {
    facePhotoFile,
    idPhotoFile,
    nameOnAccount,
    idPhotoName,
  } = useContext(IdVerificationContext);
  const nameToBeUsed = idPhotoName || nameOnAccount || '';

  function SubmitButton() {
    async function handleClick() {
      const verificationData = {
        facePhotoFile,
        idPhotoFile,
        idPhotoName: nameToBeUsed,
        courseRunKey: sessionStorage.getItem('courseRunKey'),
      };
      const result = await submitIdVerification(verificationData);
      if (result.success) {
        history.push(nextPanelSlug);
      }
    }
    return (
      <Button className="btn btn-primary" title="Confirmation" onClick={handleClick}>
        {props.intl.formatMessage(messages['id.verification.review.confirm'])}
      </Button>
    );
  }

  return (
    <BasePanel
      name={panelSlug}
      title={props.intl.formatMessage(messages['id.verification.review.title'])}
    >
      <p>
        {props.intl.formatMessage(messages['id.verification.review.description'])}
      </p>
      <div className="row mb-4">
        <div className="col-6">
          <label htmlFor="photo-of-face">
            {props.intl.formatMessage(messages['id.verification.review.portrait.label'])}
          </label>
          <ImagePreview
            id="photo-of-face"
            src={facePhotoFile}
            alt={props.intl.formatMessage(messages['id.verification.review.portrait.alt'])}
          />
          <Link
            className="btn btn-inverse-primary shadow"
            to={{
              pathname: 'take-portrait-photo',
              state: { fromSummary: true },
            }}
          >
            {props.intl.formatMessage(messages['id.verification.review.portrait.retake'])}
          </Link>
        </div>
        <div className="col-6">
          <label htmlFor="photo-of-id/edit">
            {props.intl.formatMessage(messages['id.verification.review.id.label'])}
          </label>
          <ImagePreview
            id="photo-of-id"
            src={idPhotoFile}
            alt={props.intl.formatMessage(messages['id.verification.review.id.alt'])}
          />
          <Link
            className="btn btn-inverse-primary shadow"
            to={{
              pathname: 'take-id-photo',
              state: { fromSummary: true },
            }}
          >
            {props.intl.formatMessage(messages['id.verification.review.id.retake'])}
          </Link>
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="name-to-be-used">
          {props.intl.formatMessage(messages['id.verification.account.name.label'])}
        </label>
        <div className="d-flex">
          <Input
            id="name-to-be-used"
            type="text"
            readOnly
            value={nameToBeUsed}
            onChange={() => {}}
          />

          <Link
            className="btn btn-link ml-3 px-0"
            to={{
                pathname: 'get-name-id',
                state: { fromSummary: true },
              }}
          >
            {props.intl.formatMessage(messages['id.verification.account.name.edit'])}
          </Link>
        </div>
      </div>
      <SubmitButton />
    </BasePanel>
  );
}

SummaryPanel.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(SummaryPanel);
