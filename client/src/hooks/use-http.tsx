import { useState, useCallback } from 'react';

type reqConfig = {
    url: string;
    method?: string;
    headers?: {};
    body?: any;
}

const useHttp = () => {
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
            setError(errorMessage || 'Something went wrong!');
            setIsLoading(false);
        }
    }, []);

    return {
        isLoading,
        error,
        setError,
        sendRequest,
    };
};

export default useHttp;