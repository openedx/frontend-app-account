import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { AppContext } from '@edx/frontend-platform/react';

import { getProfileDataManager } from '../account-settings/data/service';
import PageLoading from '../account-settings/PageLoading';
import { useAsyncCall } from '../hooks';
import { IDLE_STATUS, LOADING_STATUS, SUCCESS_STATUS } from '../constants';

import { getExistingIdVerification, getEnrollments } from './data/service';
import AccessBlocked from './AccessBlocked';
import { hasGetUserMediaSupport } from './getUserMediaShim';
import IdVerificationContext, { MEDIA_ACCESS, ERROR_REASONS, VERIFIED_MODES } from './IdVerificationContext';
import { VerifiedNameContext } from './VerifiedNameContext';

export default function IdVerificationContextProvider({ children }) {
  const { authenticatedUser } = useContext(AppContext);
  const { verifiedNameHistoryCallStatus, verifiedName } = useContext(VerifiedNameContext);

  const idVerificationData = useAsyncCall(getExistingIdVerification);
  const enrollmentsData = useAsyncCall(getEnrollments);

  const [facePhotoFile, setFacePhotoFile] = useState(null);
  const [idPhotoFile, setIdPhotoFile] = useState(null);
  const [idPhotoName, setIdPhotoName] = useState(null);
  const [mediaStream, setMediaStream] = useState(null);
  const [mediaAccess, setMediaAccess] = useState(
    hasGetUserMediaSupport ? MEDIA_ACCESS.PENDING : MEDIA_ACCESS.UNSUPPORTED,
  );

  const [profileDataManager, setProfileDataManager] = useState(null);
  useEffect(() => {
    // Determine if the user's profile data is managed by a third-party identity provider.
    // If so, they cannot update their account name manually.
    if (authenticatedUser.roles.length > 0) {
      (async () => {
        const thirdPartyManager = await getProfileDataManager(
          authenticatedUser.username,
          authenticatedUser.roles,
        );
        if (thirdPartyManager) {
          setProfileDataManager(thirdPartyManager);
        }
      })();
    }
  }, [authenticatedUser]);

  // Default to upload for the ID image
  const [useCameraForId, setUseCameraForId] = useState(false);

  // If the user reaches the end of the flow and goes back to retake their photos,
  // this flag ensures that they are directed straight back to the summary panel
  const [reachedSummary, setReachedSummary] = useState(false);

  let canVerify = true;
  let error = '';
  let existingIdVerification;

  if (idVerificationData?.data) {
    existingIdVerification = idVerificationData.data;
  }

  if (enrollmentsData.status === SUCCESS_STATUS && enrollmentsData?.data) {
    const verifiedEnrollments = enrollmentsData.data.filter((enrollment) => (
      VERIFIED_MODES.includes(enrollment.mode)
    ));
    if (verifiedEnrollments.length === 0) {
      canVerify = false;
      error = ERROR_REASONS.COURSE_ENROLLMENT;
    }
  }

  const contextValue = {
    existingIdVerification,
    facePhotoFile,
    idPhotoFile,
    idPhotoName,
    mediaStream,
    mediaAccess,
    userId: authenticatedUser.userId,
    // If the learner has an applicable verified name, then this should override authenticatedUser.name
    // when determining the context value nameOnAccount.
    nameOnAccount: verifiedName || authenticatedUser.name,
    profileDataManager,
    useCameraForId,
    reachedSummary,
    setFacePhotoFile,
    setIdPhotoFile,
    setIdPhotoName,
    setUseCameraForId,
    setReachedSummary,
    tryGetUserMedia: async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setMediaAccess(MEDIA_ACCESS.GRANTED);
        setMediaStream(stream);
        // stop the stream, as we are not using it yet
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      } catch (err) {
        setMediaAccess(MEDIA_ACCESS.DENIED);
      }
    },
    stopUserMedia: () => {
      if (mediaStream) {
        const tracks = mediaStream.getTracks();
        tracks.forEach(track => track.stop());
        setMediaStream(null);
      }
    },
  };

  const loadingStatuses = [IDLE_STATUS, LOADING_STATUS];
  // If we are waiting for verification status or verified name history endpoint, show spinner.
  if (loadingStatuses.includes(idVerificationData.status) || loadingStatuses.includes(verifiedNameHistoryCallStatus)) {
    return <PageLoading srMessage="Loading verification status" />;
  }

  if (!canVerify) {
    return <AccessBlocked error={error} />;
  }

  return (
    <IdVerificationContext.Provider value={contextValue}>
      {children}
    </IdVerificationContext.Provider>
  );
}

IdVerificationContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
