import { useEffect, useState } from 'react';

import { getSiteConfig } from '@openedx/frontend-base';
import { breakpoints, useWindowSize } from '@openedx/paragon';

import {
  IDLE_STATUS, LOADING_STATUS, SUCCESS_STATUS, FAILURE_STATUS,
} from './constants';
import { getDashboardUrl } from './utils';

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

// The link back to where the learner came from, as saved in session storage: the course or the
// `next` path the LMS sent them from, both paths in the LMS, and otherwise the dashboard.
export function useRedirect() {
  const [redirect, setRedirect] = useState(() => ({
    url: getDashboardUrl(),
    text: 'id.verification.return.dashboard',
  }));

  useEffect(() => {
    const { lmsBaseUrl } = getSiteConfig();
    if (sessionStorage.getItem('courseId')) {
      setRedirect({
        url: `${lmsBaseUrl}/courses/${sessionStorage.getItem('courseId')}`,
        text: 'id.verification.return.course',
      });
    } else if (sessionStorage.getItem('next')) {
      setRedirect({
        url: `${lmsBaseUrl}/${sessionStorage.getItem('next')}`,
        text: 'id.verification.return.generic',
      });
    }
  }, []);

  return redirect;
}

export function useIsOnMobile() {
  const windowSize = useWindowSize();
  return windowSize.width <= breakpoints.small.maxWidth;
}
