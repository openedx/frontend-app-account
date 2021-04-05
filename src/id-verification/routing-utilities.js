import { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import IdVerificationContext, { MEDIA_ACCESS } from './IdVerificationContext';

const panelSteps = [
  'review-requirements',
  'choose-mode',
  'request-camera-access',
  'portrait-photo-context',
  'take-portrait-photo',
  'id-context',
  'take-id-photo',
  'get-name-id',
  'summary',
  'submitted',
];

// eslint-disable-next-line import/prefer-default-export
export const useNextPanelSlug = (originSlug) => {
  // Go back to the summary view if that's where they came from
  const location = useLocation();
  const isFromSummary = location.state && location.state.fromSummary;
  const isFromPortrait = location.state && location.state.fromPortraitCapture;
  const isFromId = location.state && location.state.fromIdCapture;
  const { shouldUseCamera, mediaAccess, optimizelyExperimentName } = useContext(IdVerificationContext);

  if (isFromSummary) {
    return 'summary';
  }

  // the following are used as part of an A/B experiment
  if (isFromPortrait) {
    if (mediaAccess === MEDIA_ACCESS.GRANTED) {
      return 'portrait-photo-context';
    }
    return 'take-portrait-photo';
  }
  if (isFromId) {
    if (mediaAccess === MEDIA_ACCESS.GRANTED) {
      return 'id-context';
    }
    return 'take-id-photo';
  }
  if (originSlug === 'review-requirements' && !optimizelyExperimentName) {
    return 'request-camera-access';
  }
  if (originSlug === 'choose-mode' && !shouldUseCamera) {
    return 'take-portrait-photo';
  }
  if (originSlug === 'take-portrait-photo' && !shouldUseCamera) {
    return 'take-id-photo';
  }
  if (originSlug === 'request-camera-access' && mediaAccess !== MEDIA_ACCESS.GRANTED) {
    return 'take-portrait-photo';
  }

  const nextIndex = panelSteps.indexOf(originSlug) + 1;
  return nextIndex < panelSteps.length ? panelSteps[nextIndex] : null;
};

// check if the user is too far into the flow and if so, return the slug of the
// furthest panel they are allow to be.
export const useVerificationRedirectSlug = (slug) => {
  const { facePhotoFile, idPhotoFile, optimizelyExperimentName } = useContext(IdVerificationContext);
  const indexOfCurrentPanel = panelSteps.indexOf(slug);
  if (!optimizelyExperimentName && slug === 'choose-mode') {
    return 'review-requirements';
  }
  if (!facePhotoFile) {
    if (indexOfCurrentPanel > panelSteps.indexOf('take-portrait-photo')) {
      return 'portrait-photo-context';
    }
  } else if (!idPhotoFile) {
    if (indexOfCurrentPanel > panelSteps.indexOf('take-id-photo')) {
      return 'id-context';
    }
  }

  // The user has satisfied requirements to view the panel they're on.
  return null;
};
