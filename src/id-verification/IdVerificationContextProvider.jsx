import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { AppContext } from '@edx/frontend-platform/react';

import { hasGetUserMediaSupport } from './getUserMediaShim';
import { getExistingIdVerification, getEnrollments } from './data/service';
import PageLoading from '../account-settings/PageLoading';
import AccessBlocked from './AccessBlocked';
import IdVerificationContext, { MEDIA_ACCESS, ERROR_REASONS, VERIFIED_MODES } from './IdVerificationContext';

export default function IdVerificationContextProvider({ children }) {
  const [existingIdVerification, setExistingIdVerification] = useState(null);
  const [facePhotoFile, setFacePhotoFile] = useState(null);
  const [idPhotoFile, setIdPhotoFile] = useState(null);
  const [idPhotoName, setIdPhotoName] = useState(null);
  const [mediaStream, setMediaStream] = useState(null);
  const [mediaAccess, setMediaAccess] = useState(hasGetUserMediaSupport
    ? MEDIA_ACCESS.PENDING
    : MEDIA_ACCESS.UNSUPPORTED);
  const [canVerify, setCanVerify] = useState(true);
  const [error, setError] = useState('');
  const { authenticatedUser } = useContext(AppContext);
  const [optimizelyExperimentName, setOptimizelyExperimentName] = useState('');

  const contextValue = {
    existingIdVerification,
    facePhotoFile,
    idPhotoFile,
    idPhotoName,
    mediaStream,
    mediaAccess,
    userId: authenticatedUser.userId,
    nameOnAccount: authenticatedUser.name,
    optimizelyExperimentName,
    setExistingIdVerification,
    setFacePhotoFile,
    setIdPhotoFile,
    setIdPhotoName,
    setOptimizelyExperimentName,
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

  useEffect(() => {
    // Call verification status endpoint to check whether we can verify.
    (async () => {
      const existingIdV = await getExistingIdVerification();
      setExistingIdVerification(existingIdV);
    })();
  }, []);

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
