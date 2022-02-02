import { useContext } from 'react';
import IdVerificationContext from './IdVerificationContext';

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
  const { reachedSummary } = useContext(IdVerificationContext);

  const canRerouteToSummary = [
    SLUGS.TAKE_PORTRAIT_PHOTO,
    SLUGS.TAKE_ID_PHOTO,
    SLUGS.GET_NAME_ID,
  ];

  if (reachedSummary && canRerouteToSummary.includes(originSlug)) {
    return SLUGS.SUMMARY;
  }

  const nextIndex = panelSteps.indexOf(originSlug) + 1;
  return nextIndex < panelSteps.length ? panelSteps[nextIndex] : null;
};

// check if the user is too far into the flow and if so, return the slug of the
// furthest panel they are allow to be.
export const useVerificationRedirectSlug = (slug) => {
  const { facePhotoFile, idPhotoFile } = useContext(IdVerificationContext);
  const indexOfCurrentPanel = panelSteps.indexOf(slug);
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
