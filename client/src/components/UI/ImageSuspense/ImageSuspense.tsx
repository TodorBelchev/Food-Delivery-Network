import React, { useEffect, useState } from "react";
import Spinner from "../Spinner/Spinner";


import classes from './ImageSuspense.module.css';

type ImageSuspenseProps = {
    url: string;
}

const ImageSuspense: React.FC<ImageSuspenseProps> = ({ children, url }) => {
    const [isMounted, setIsMounted] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    const cacheImage = async (imageSrc: string) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = imageSrc;
            img.onload = () => resolve(null);
            img.onerror = () => reject({ message: 'Failed to load image!' });
        });
    }

    useEffect(() => {
        const loadImage = async () => {
            await cacheImage(url);
            setIsLoading(false);
        }
        if (isMounted) {
            loadImage();
        }
        return () => {
            setIsMounted(false);
        }
    }, [url, isMounted]);

    return (
        <>
            {isLoading &&
                <div className={classes['loader-container']}>
                    <Spinner size='medium' />
                </div>}
            {!isLoading && children}
        </>
    )
};

export default ImageSuspense;