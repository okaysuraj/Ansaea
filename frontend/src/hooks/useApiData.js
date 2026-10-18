import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/useAuth';
import { readJson } from '../utils/api';

/** Load a resource, ignore stale responses, and expose an explicit refresh after edits. */
export function useApiData(endpoint, initialData = null) {
  const { authenticatedFetch } = useAuth();
  const [state, setState] = useState({ data: initialData, loading: true, error: '' });
  const requestId = useRef(null);
  const expectsList = Array.isArray(initialData);

  const load = useCallback(
    async (signal) => {
      const data = await readJson(await authenticatedFetch(endpoint, { signal }));
      if (expectsList && !Array.isArray(data))
        throw new Error('The server returned an invalid list.');
      return data;
    },
    [authenticatedFetch, endpoint, expectsList],
  );

  useEffect(() => {
    const controller = new AbortController();
    const id = Symbol(endpoint);
    requestId.current = id;
    load(controller.signal).then(
      (data) => {
        if (id === requestId.current) setState({ data, loading: false, error: '' });
      },
      (error) => {
        if (id === requestId.current) {
          setState((previous) => ({ ...previous, loading: false, error: error.message }));
        }
      },
    );
    return () => {
      requestId.current = null;
      controller.abort();
    };
  }, [load, endpoint]);

  const reload = useCallback(async () => {
    const id = Symbol(endpoint);
    requestId.current = id;
    setState((previous) => ({ ...previous, loading: true, error: '' }));
    try {
      const data = await load();
      if (id === requestId.current) setState({ data, loading: false, error: '' });
    } catch (error) {
      if (id === requestId.current) {
        setState((previous) => ({ ...previous, loading: false, error: error.message }));
      }
    }
  }, [load, endpoint]);

  const setData = useCallback((update) => {
    setState((previous) => ({
      ...previous,
      data: typeof update === 'function' ? update(previous.data) : update,
    }));
  }, []);

  return { ...state, reload, setData };
}
