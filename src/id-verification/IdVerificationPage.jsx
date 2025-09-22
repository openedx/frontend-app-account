import { getSiteConfig, useIntl} from '@openedx/frontend-base';
import { ActionRow, Button, ModalDialog } from '@openedx/paragon';
import camelCase from 'lodash.camelcase';
import qs from 'qs';
import { useEffect, useState } from 'react';
import {
  Route, Routes, useLocation, useNavigate,
} from 'react-router-dom';
import './getUserMediaShim';

import IdVerificationContextProvider from './IdVerificationContextProvider';
import { VerifiedNameContextProvider } from './VerifiedNameContext';
import GetNameIdPanel from './panels/GetNameIdPanel';
import IdContextPanel from './panels/IdContextPanel';
import PortraitPhotoContextPanel from './panels/PortraitPhotoContextPanel';
import RequestCameraAccessPanel from './panels/RequestCameraAccessPanel';
import ReviewRequirementsPanel from './panels/ReviewRequirementsPanel';
import SubmittedPanel from './panels/SubmittedPanel';
import SummaryPanel from './panels/SummaryPanel';
import TakeIdPhotoPanel from './panels/TakeIdPhotoPanel';
import TakePortraitPhotoPanel from './panels/TakePortraitPhotoPanel';

import messages from './IdVerification.messages';

// eslint-disable-next-line react/prefer-stateless-function
const IdVerificationPage = () => {
  const intl = useIntl();
  const { search } = useLocation();
  const navigate = useNavigate();

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

  useEffect(() => {
    navigate('/id-verification/review-requirements');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="page__id-verification container-fluid py-5">
      <div className="row">
        <div className="col-lg-6 col-md-8">
          <VerifiedNameContextProvider>
            <IdVerificationContextProvider>
              <Routes>
                <Route path="/review-requirements" element={<ReviewRequirementsPanel />} />
                <Route path="/request-camera-access" element={<RequestCameraAccessPanel />} />
                <Route path="/portrait-photo-context" element={<PortraitPhotoContextPanel />} />
                <Route path="/take-portrait-photo" element={<TakePortraitPhotoPanel />} />
                <Route path="/id-context" element={<IdContextPanel />} />
                <Route path="/get-name-id" element={<GetNameIdPanel />} />
                <Route path="/take-id-photo" element={<TakeIdPhotoPanel />} />
                <Route path="/summary" element={<SummaryPanel />} />
                <Route path="/submitted" element={<SubmittedPanel />} />
              </Routes>
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
            {intl.formatMessage(messages['id.verification.privacy.title'])}
          </ModalDialog.Title>
        </ModalDialog.Header>
        <ModalDialog.Body>
          <div className="p-3">
            <h6>
              {intl.formatMessage(
                messages['id.verification.privacy.need.photo.question'],
                { siteName: getSiteConfig().siteName },
              )}
            </h6>
            <p>{intl.formatMessage(messages['id.verification.privacy.need.photo.answer'])}</p>
            <h6>
              {intl.formatMessage(
                messages['id.verification.privacy.do.with.photo.question'],
                { siteName: getSiteConfig().siteName },
              )}
            </h6>
            <p>
              {intl.formatMessage(
                messages['id.verification.privacy.do.with.photo.answer'],
                { siteName: getSiteConfig().siteName },
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
  );
};

export default IdVerificationPage;
