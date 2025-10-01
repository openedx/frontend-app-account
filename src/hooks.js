import { useEffect, useState } from 'react';

import { logError, useAppConfig } from '@openedx/frontend-base';
import { breakpoints, useWindowSize } from '@openedx/paragon';

import {
  FAILURE_STATUS,
  IDLE_STATUS, LOADING_STATUS, SUCCESS_STATUS,
} from './constants';

export function useAsyncCall(asyncFunc) {
  // React doesn't batch setStates call in async useEffect hooks,
  // so we use a combined object here to ensure that users
  // re-render once.
  const [data, setData] = useState({ status: IDLE_STATUS });

  useEffect(
    () => {
      (async () => {
        setData(currData => ({ ...currData, status: LOADING_STATUS }));
        const response = await asyncFunc();

        if (Object.keys(response).length === 0) {
          setData(currData => ({ ...currData, status: FAILURE_STATUS, data: response }));
        } else {
          setData(currData => ({ ...currData, status: SUCCESS_STATUS, data: response }));
        }
      })();
    },
    [asyncFunc],
  );

  return data;
}

// Redirect the user to their original location based on session storage
export function useRedirect() {
  const [redirect, setRedirect] = useState({
    location: 'dashboard',
    text: 'id.verification.return.dashboard',
  });

  useEffect(() => {
    if (sessionStorage.getItem('courseId')) {
      setRedirect({
        location: `courses/${sessionStorage.getItem('courseId')}`,
        text: 'id.verification.return.course',
      });
    } else if (sessionStorage.getItem('next')) {
      setRedirect({
        location: sessionStorage.getItem('next'),
        text: 'id.verification.return.generic',
      });
    }
  }, []);

  return redirect;
}

export function useFeedbackWrapper() {
  const LEARNER_FEEDBACK_URL = useAppConfig().LEARNER_FEEDBACK_URL;
  useEffect(() => {
    try {
    // eslint-disable-next-line no-undef
      window.usabilla_live = lightningjs?.require('usabilla_live', LEARNER_FEEDBACK_URL);
    } catch (error) {
      logError('Error loading usabilla_live', error);
    }
  }, [LEARNER_FEEDBACK_URL]);
}

export function useIsOnMobile() {
  const windowSize = useWindowSize();
  return windowSize.width <= breakpoints.small.minWidth;
}
