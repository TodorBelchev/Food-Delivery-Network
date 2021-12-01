import { useState, useCallback, useEffect } from 'react';
import { notificationActions } from '../store/notification';
import { useAppDispatch } from './reduxHooks';

type reqConfig = {
    url: string;
    method?: string;
    headers?: {};
    body?: any;
}

const useHttp = () => {
    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const sendRequest = useCallback(async (requestConfig: reqConfig, applyData) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(requestConfig.url, {
                method: requestConfig.method || 'GET',
                credentials: 'include',
                headers: requestConfig.headers || {},
                body: requestConfig.body || null
            });

            const data = await response.json();

            if (!response.ok) { throw new Error(data.message); }

            setIsLoading(false);
            applyData(data);
        } catch (err) {
            let errorMessage = (err as Error).message;
            if (errorMessage === 'Failed to fetch' || errorMessage === '') {
                errorMessage = 'Something went wrong. Please try again later.'
            }
            setError(errorMessage);
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (error) {
            dispatch(notificationActions.show({ type: 'error', text: error }));
        }
        return () => {
            dispatch(notificationActions.close());
        }
    }, [dispatch, error]);

    return {
        isLoading,
        error,
        setError,
        sendRequest,
    };
};

export default useHttp;