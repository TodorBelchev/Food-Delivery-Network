import { useEffect } from "react";

const usePreventScrolling = (isPreventing: boolean) => {
    const setScroll = () => {
        document.documentElement.style.setProperty('--scroll-y', `${window.scrollY}px`);
    }

    useEffect(() => {
        window.addEventListener('scroll', setScroll);
        if (isPreventing) {
            const scrollY = document.documentElement.style.getPropertyValue('--scroll-y');
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}`;
        }

        return () => {
            const scrollY = document.body.style.top;
            document.body.style.position = '';
            document.body.style.top = '';
            window.scrollTo(0, parseInt(scrollY || '0') * -1);
            window.removeEventListener('scroll', setScroll);
        }
    }, [isPreventing]);
};

export default usePreventScrolling;