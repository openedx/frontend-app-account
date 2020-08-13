import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { AppContext } from '@edx/frontend-platform/react';

import { hasGetUserMediaSupport } from './getUserMediaShim';
import { getExistingIdVerification } from './data/service';
import PageLoading from '../account-settings/PageLoading';
import ExistingRequest from './ExistingRequest';

const IdVerificationContext = React.createContext({});

const MEDIA_ACCESS = {
  PENDING: 'pending',
  UNSUPPORTED: 'unsupported',
  DENIED: 'denied',
  GRANTED: 'granted',
};

function IdVerificationContextProvider({ children }) {
  const [existingIdVerification, setExistingIdVerification] = useState(null);
  const [facePhotoFile, setFacePhotoFile] = useState(null);
  const [idPhotoFile, setIdPhotoFile] = useState(null);
  const [idPhotoName, setIdPhotoName] = useState(null);
  const [mediaStream, setMediaStream] = useState(null);
  const [mediaAccess, setMediaAccess] = useState(hasGetUserMediaSupport ?
    MEDIA_ACCESS.PENDING :
    MEDIA_ACCESS.UNSUPPORTED);
  const { authenticatedUser } = useContext(AppContext);

  const contextValue = {
    existingIdVerification,
    facePhotoFile,
    idPhotoFile,
    idPhotoName,
    mediaStream,
    mediaAccess,
    userId: authenticatedUser.userId,
    nameOnAccount: authenticatedUser.name,
    setExistingIdVerification,
    setFacePhotoFile,
    setIdPhotoFile,
    setIdPhotoName,
    tryGetUserMedia: async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setMediaAccess(MEDIA_ACCESS.GRANTED);
        setMediaStream(stream);
        // If we would like to stop the stream immediately. I guess we can leave it open
        // const tracks = stream.getTracks();
        // tracks.forEach(track => track.stop());
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
    }
  };

  // Call verification status endpoint to check whether we can verify.
  useEffect(() => {
    (async () => {
      const existingIdV = await getExistingIdVerification();
      setExistingIdVerification(existingIdV);
    })();
  }, []);

  // If we are waiting for verification status endpoint, show spinner.
  if (!existingIdVerification) {
    return <PageLoading srMessage="Loading verification status" />;
  }

  if (!existingIdVerification.canVerify) {
    const { status } = existingIdVerification;
    return (
      <ExistingRequest status={status} />
    );
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

export {
  IdVerificationContext,
  IdVerificationContextProvider,
  MEDIA_ACCESS,
};
