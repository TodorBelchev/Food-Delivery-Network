import { useState, useCallback } from 'react';

const useHttp = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const sendRequest = useCallback(async (requestConfig, applyData) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(requestConfig.url, {
                method: requestConfig.method || 'GET',
                headers: requestConfig.headers || {},
                body: JSON.stringify(requestConfig.body || null),
            });

            if (!response.ok) {
                throw new Error('Request failed!');
            }

            const data = await response.json();
            applyData(data);
        } catch (err) {
            let errorMessage = (err as Error).message;
            setError(errorMessage || 'Something went wrong!');
        }
        setIsLoading(false);
    }, []);

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