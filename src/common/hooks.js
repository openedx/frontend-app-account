import { useState } from 'react';

const useAction = (action) => {
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const performAction = async (body = null) => {
    try {
      setLoading(true);
      setLoaded(false);
      setData(null);
      setError(null);
      const result = await action(body);
      setData(result);
      setLoaded(true);
    } catch (e) {
      if (e.response.data) {
        setError(e.response.data);
      } else {
        throw e;
      }
      setLoaded(false);
    } finally {
      setLoading(false);
    }
  };

  const resetAction = () => {
    setLoading(false);
    setLoaded(false);
    setData(null);
    setError(null);
  };

  return [{
    loaded, loading, data, error,
  }, performAction, resetAction];
};

export default useAction;
