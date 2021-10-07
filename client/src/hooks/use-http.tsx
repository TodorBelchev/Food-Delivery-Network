import { useState, useCallback, useEffect } from 'react';

type reqConfig = {
    url: string;
    method?: string;
    headers?: {};
    body?: any;
}

const useHttp = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        return () => setIsMounted(false);
    }, []);

    const sendRequest = useCallback(async (requestConfig: reqConfig, applyData) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(requestConfig.url, {
                method: requestConfig.method || 'GET',
                credentials: 'include',
                headers: requestConfig.headers || {},
                body: requestConfig.body ? JSON.stringify(requestConfig.body) : null
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            if (isMounted) {
                setIsLoading(false);
            }
            applyData(data);
        } catch (err) {
            let errorMessage = (err as Error).message;
            setError(errorMessage || 'Something went wrong!');
            setIsLoading(false);
        }

    }, [isMounted]);

    const closeError = () => {
        setError(null);
    }

    return {
        isLoading,
        error,
        closeError,
        sendRequest,
    };
};

export default useHttp;