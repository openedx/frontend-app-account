import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Route, Switch, Redirect, useRouteMatch } from 'react-router-dom';
import { injectIntl } from '@edx/frontend-platform/i18n';
import { Modal, Button } from '@edx/paragon';
import { idVerificationSelector } from './data/selectors';
import './getUserMediaShim';

import { IdVerificationContextProvider } from './IdVerificationContext';
import ReviewRequirementsPanel from './panels/ReviewRequirementsPanel';
import RequestCameraAccessPanel from './panels/RequestCameraAccessPanel';
import PortraitPhotoContextPanel from './panels/PortraitPhotoContextPanel';
import TakePortraitPhotoPanel from './panels/TakePortraitPhotoPanel';
import IdContextPanel from './panels/IdContextPanel';
import GetNameIdPanel from './panels/GetNameIdPanel';
import TakeIdPhotoPanel from './panels/TakeIdPhotoPanel';
import SummaryPanel from './panels/SummaryPanel';
import SubmittedPanel from './panels/SubmittedPanel';

// eslint-disable-next-line react/prefer-stateless-function
function IdVerificationPage() {
  const { path } = useRouteMatch();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="page__id-verification container-fluid py-5">
      <div className="row">
        <div className="col-lg-6 col-md-8">
          <IdVerificationContextProvider>
            <Switch>
              <Route exact path={path}>
                <Redirect to={`${path}/review-requirements`} />
              </Route>
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
        </div>
        <div className="col-lg-6 col-md-4 pt-md-0 pt-4 text-right">
          <Button className="btn-link px-0" onClick={() => setIsModalOpen(true)}>
          Privacy Information
          </Button>
        </div>
      </div>


      <Modal
        open={isModalOpen}
        title="Privacy Information"
        body={(
          <div>
            <h6>Why does edX need my photo?</h6>
            <p>We use your verification photos to confirm your identity and ensure the validity of your certificate.</p>
            <h6>What does edX do with this photo?</h6>
            <p>We securely encrypt your photo and send it our authorization service for review. Your photo and information are not saved or visible anywhere on edX after the verification process is complete.</p>
          </div>
        )}
        onClose={() => setIsModalOpen(false)}
      />

    </div>
  );
}
export default connect(idVerificationSelector, {
})(injectIntl(IdVerificationPage));

