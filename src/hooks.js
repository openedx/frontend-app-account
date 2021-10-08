import { useEffect, useState } from 'react';

// eslint-disable-next-line import/prefer-default-export
export function useAsyncCall(asyncFunc) {
  const [isLoading, setIsLoading] = useState();
  const [data, setData] = useState();

  useEffect(
    () => {
      (async () => {
        setIsLoading(true);
        const response = await asyncFunc();
        setIsLoading(false);
        if (response) {
          setData(response);
        }
      })();
    },
    [asyncFunc],
  );

  return [isLoading, data];
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
