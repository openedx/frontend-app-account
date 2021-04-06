import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { AppContext } from '@edx/frontend-platform/react';

import { getProfileDataManager } from '../account-settings/data/service';
import PageLoading from '../account-settings/PageLoading';

import { getExistingIdVerification, getEnrollments } from './data/service';
import AccessBlocked from './AccessBlocked';
import { hasGetUserMediaSupport } from './getUserMediaShim';
import IdVerificationContext, { MEDIA_ACCESS, ERROR_REASONS, VERIFIED_MODES } from './IdVerificationContext';

export default function IdVerificationContextProvider({ children }) {
  const { authenticatedUser } = useContext(AppContext);

  const [existingIdVerification, setExistingIdVerification] = useState(null);
  useEffect(() => {
    // Call verification status endpoint to check whether we can verify.
    (async () => {
      const existingIdV = await getExistingIdVerification();
      setExistingIdVerification(existingIdV);
    })();
  }, []);

  const [facePhotoFile, setFacePhotoFile] = useState(null);
  const [idPhotoFile, setIdPhotoFile] = useState(null);
  const [idPhotoName, setIdPhotoName] = useState(null);
  const [mediaStream, setMediaStream] = useState(null);
  const [mediaAccess, setMediaAccess] = useState(
    hasGetUserMediaSupport ? MEDIA_ACCESS.PENDING : MEDIA_ACCESS.UNSUPPORTED,
  );

  const [canVerify, setCanVerify] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    // Check for an existing verification attempt
    if (existingIdVerification && !existingIdVerification.canVerify) {
      const { status } = existingIdVerification;
      setCanVerify(false);
      if (status === 'pending' || status === 'approved') {
        setError(ERROR_REASONS.EXISTING_REQUEST);
      } else {
        setError(ERROR_REASONS.CANNOT_VERIFY);
      }
    }
  }, [existingIdVerification]);
  useEffect(() => {
    // Check whether the learner is enrolled in a verified course mode.
    (async () => {
      /* eslint-disable arrow-body-style */
      const enrollments = await getEnrollments();
      const verifiedEnrollments = enrollments.filter((enrollment) => {
        return VERIFIED_MODES.includes(enrollment.mode);
      });
      if (verifiedEnrollments.length === 0) {
        setCanVerify(false);
        setError(ERROR_REASONS.COURSE_ENROLLMENT);
      }
    })();
  }, []);

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

  const [optimizelyExperimentName, setOptimizelyExperimentName] = useState('');
  const [shouldUseCamera, setShouldUseCamera] = useState(false);

  // If the user reaches the end of the flow and goes back to retake their photos,
  // this flag ensures that they are directed straight back to the summary panel
  const [reachedSummary, setReachedSummary] = useState(false);

  const contextValue = {
    existingIdVerification,
    facePhotoFile,
    idPhotoFile,
    idPhotoName,
    mediaStream,
    mediaAccess,
    userId: authenticatedUser.userId,
    nameOnAccount: authenticatedUser.name,
    profileDataManager,
    optimizelyExperimentName,
    shouldUseCamera,
    reachedSummary,
    setExistingIdVerification,
    setFacePhotoFile,
    setIdPhotoFile,
    setIdPhotoName,
    setOptimizelyExperimentName,
    setShouldUseCamera,
    setReachedSummary,
    tryGetUserMedia: async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setMediaAccess(MEDIA_ACCESS.GRANTED);
        setMediaStream(stream);
        setShouldUseCamera(true);
        // stop the stream, as we are not using it yet
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      } catch (err) {
        setMediaAccess(MEDIA_ACCESS.DENIED);
        setShouldUseCamera(false);
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

  // If we are waiting for verification status endpoint, show spinner.
  if (!existingIdVerification) {
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
