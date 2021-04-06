import { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import IdVerificationContext, { MEDIA_ACCESS } from './IdVerificationContext';

const SLUGS = {
  REVIEW_REQUIREMENTS: 'review-requirements',
  CHOOSE_MODE: 'choose-mode',
  REQUEST_CAMERA_ACCESS: 'request-camera-access',
  PORTRAIT_PHOTO_CONTEXT: 'portrait-photo-context',
  TAKE_PORTRAIT_PHOTO: 'take-portrait-photo',
  ID_CONTEXT: 'id-context',
  TAKE_ID_PHOTO: 'take-id-photo',
  GET_NAME_ID: 'get-name-id',
  SUMMARY: 'summary',
  SUBMITTED: 'submitted',
};

const panelSteps = [
  SLUGS.REVIEW_REQUIREMENTS,
  SLUGS.CHOOSE_MODE,
  SLUGS.REQUEST_CAMERA_ACCESS,
  SLUGS.PORTRAIT_PHOTO_CONTEXT,
  SLUGS.TAKE_PORTRAIT_PHOTO,
  SLUGS.ID_CONTEXT,
  SLUGS.TAKE_ID_PHOTO,
  SLUGS.GET_NAME_ID,
  SLUGS.SUMMARY,
  SLUGS.SUBMITTED,
];

// eslint-disable-next-line import/prefer-default-export
export const useNextPanelSlug = (originSlug) => {
  // Go back to the summary view if that's where they came from
  const location = useLocation();
  const isFromPortrait = location.state && location.state.fromPortraitCapture;
  const isFromId = location.state && location.state.fromIdCapture;
  const {
    mediaAccess,
    optimizelyExperimentName,
    reachedSummary,
    shouldUseCamera,
  } = useContext(IdVerificationContext);

  const canRerouteToSummary = [
    SLUGS.TAKE_PORTRAIT_PHOTO,
    SLUGS.TAKE_ID_PHOTO,
    SLUGS.GET_NAME_ID,
  ];

  if (reachedSummary && canRerouteToSummary.includes(originSlug)) {
    return SLUGS.SUMMARY;
  }

  // the following are used as part of an A/B experiment
  if (isFromPortrait) {
    if (mediaAccess === MEDIA_ACCESS.GRANTED) {
      return SLUGS.PORTRAIT_PHOTO_CONTEXT;
    }
    return SLUGS.TAKE_PORTRAIT_PHOTO;
  }
  if (isFromId) {
    if (mediaAccess === MEDIA_ACCESS.GRANTED) {
      return SLUGS.ID_CONTEXT;
    }
    return SLUGS.TAKE_ID_PHOTO;
  }
  if (originSlug === SLUGS.REVIEW_REQUIREMENTS && !optimizelyExperimentName) {
    return SLUGS.REQUEST_CAMERA_ACCESS;
  }
  if (originSlug === SLUGS.CHOOSE_MODE && !shouldUseCamera) {
    return SLUGS.TAKE_PORTRAIT_PHOTO;
  }
  if (originSlug === SLUGS.TAKE_PORTRAIT_PHOTO && !shouldUseCamera) {
    return SLUGS.TAKE_ID_PHOTO;
  }
  if (originSlug === SLUGS.REQUEST_CAMERA_ACCESS && mediaAccess !== MEDIA_ACCESS.GRANTED) {
    return SLUGS.TAKE_PORTRAIT_PHOTO;
  }

  const nextIndex = panelSteps.indexOf(originSlug) + 1;
  return nextIndex < panelSteps.length ? panelSteps[nextIndex] : null;
};

// check if the user is too far into the flow and if so, return the slug of the
// furthest panel they are allow to be.
export const useVerificationRedirectSlug = (slug) => {
  const { facePhotoFile, idPhotoFile, optimizelyExperimentName } = useContext(IdVerificationContext);
  const indexOfCurrentPanel = panelSteps.indexOf(slug);
  if (!optimizelyExperimentName && slug === SLUGS.CHOOSE_MODE) {
    return SLUGS.REVIEW_REQUIREMENTS;
  }
  if (!facePhotoFile) {
    if (indexOfCurrentPanel > panelSteps.indexOf(SLUGS.TAKE_PORTRAIT_PHOTO)) {
      return SLUGS.PORTRAIT_PHOTO_CONTEXT;
    }
  } else if (!idPhotoFile) {
    if (indexOfCurrentPanel > panelSteps.indexOf(SLUGS.TAKE_ID_PHOTO)) {
      return SLUGS.ID_CONTEXT;
    }
  }

  // The user has satisfied requirements to view the panel they're on.
  return null;
};
