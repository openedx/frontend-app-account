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
