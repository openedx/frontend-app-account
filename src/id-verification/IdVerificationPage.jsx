import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
  Route, Switch, Redirect, useRouteMatch, useLocation,
} from 'react-router-dom';
import camelCase from 'lodash.camelcase';
import qs from 'qs';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Button, ModalDialog, ActionRow } from '@edx/paragon';
import { getConfig } from '@edx/frontend-platform';
import { idVerificationSelector } from './data/selectors';
import './getUserMediaShim';

import IdVerificationContextProvider from './IdVerificationContextProvider';
import { VerifiedNameContextProvider } from './VerifiedNameContext';
import ReviewRequirementsPanel from './panels/ReviewRequirementsPanel';
import RequestCameraAccessPanel from './panels/RequestCameraAccessPanel';
import PortraitPhotoContextPanel from './panels/PortraitPhotoContextPanel';
import TakePortraitPhotoPanel from './panels/TakePortraitPhotoPanel';
import IdContextPanel from './panels/IdContextPanel';
import GetNameIdPanel from './panels/GetNameIdPanel';
import TakeIdPhotoPanel from './panels/TakeIdPhotoPanel';
import SummaryPanel from './panels/SummaryPanel';
import SubmittedPanel from './panels/SubmittedPanel';

import messages from './IdVerification.messages';

// eslint-disable-next-line react/prefer-stateless-function
const IdVerificationPage = (props) => {
  const { path } = useRouteMatch();
  const { search } = useLocation();

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Save query params in order to route back to the correct location later
  useEffect(() => {
    if (search) {
      const parsedQueryParams = qs.parse(search, {
        ignoreQueryPrefix: true,
        interpretNumericEntities: true,
      });
      Object.entries(parsedQueryParams).forEach(([key, value]) => {
        sessionStorage.setItem(camelCase(key), value);
      });
    }
  }, [search]);

  return (
    <>
      {/* If user reloads, redirect to the beginning of the process */}
      <Redirect to={`${path}/review-requirements`} />
      <div className="page__id-verification container-fluid py-5">
        <div className="row">
          <div className="col-lg-6 col-md-8">
            <VerifiedNameContextProvider>
              <IdVerificationContextProvider>
                <Switch>
                  <Route path={`${path}/review-requirements`} component={ReviewRequirementsPanel} />
                  <Route path={`${path}/request-camera-access`} component={RequestCameraAccessPanel} />
                  <Route path={`${path}/portrait-photo-context`} component={PortraitPhotoContextPanel} />
                  <Route path={`${path}/take-portrait-photo`} component={TakePortraitPhotoPanel} />
                  <Route path={`${path}/id-context`} component={IdContextPanel} />
                  <Route path={`${path}/get-name-id`} component={GetNameIdPanel} />
                  <Route path={`${path}/take-id-photo`} component={TakeIdPhotoPanel} />
                  <Route path={`${path}/summary`} component={SummaryPanel} />
                  <Route path={`${path}/submitted`} component={SubmittedPanel} />
                </Switch>
              </IdVerificationContextProvider>
            </VerifiedNameContextProvider>
          </div>
          <div className="col-lg-6 col-md-4 pt-md-0 pt-4 text-right">
            <Button variant="link" className="px-0" onClick={() => setIsModalOpen(true)}>
              Privacy Information
            </Button>
          </div>
        </div>
        <ModalDialog
          isOpen={isModalOpen}
          title="Id modal"
          onClose={() => setIsModalOpen(false)}
          size="lg"
          hasCloseButton={false}
        >
          <ModalDialog.Header>
            <ModalDialog.Title data-testid="Id-modal">
              {props.intl.formatMessage(messages['id.verification.privacy.title'])}
            </ModalDialog.Title>
          </ModalDialog.Header>
          <ModalDialog.Body>
            <div className="p-3">
              <h6>
                {props.intl.formatMessage(
                  messages['id.verification.privacy.need.photo.question'],
                  { siteName: getConfig().SITE_NAME },
                )}
              </h6>
              <p>{props.intl.formatMessage(messages['id.verification.privacy.need.photo.answer'])}</p>
              <h6>
                {props.intl.formatMessage(
                  messages['id.verification.privacy.do.with.photo.question'],
                  { siteName: getConfig().SITE_NAME },
                )}
              </h6>
              <p>
                {props.intl.formatMessage(
                  messages['id.verification.privacy.do.with.photo.answer'],
                  { siteName: getConfig().SITE_NAME },
                )}
              </p>
            </div>
          </ModalDialog.Body>
          <ModalDialog.Footer className="p-2">
            <ActionRow>
              <ModalDialog.CloseButton variant="link">
                Close
              </ModalDialog.CloseButton>
            </ActionRow>
          </ModalDialog.Footer>
        </ModalDialog>

      </div>
    </>
  );
};

IdVerificationPage.propTypes = {
  intl: intlShape.isRequired,
};

export default connect(idVerificationSelector, {})(injectIntl(IdVerificationPage));
