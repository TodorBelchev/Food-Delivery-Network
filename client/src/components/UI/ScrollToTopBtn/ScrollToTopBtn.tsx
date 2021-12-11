import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";


import classes from './ScrollToTopBtn.module.css';

const ScrollToTopBtn: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    const handleScroll = () => {
        setIsScrolled(window.scrollY < 50);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        }
    }, []);

    const btnClickHandler = () => window.scroll({ top: 0, left: 0, behavior: 'smooth' });

    return (
        <>
            {isScrolled ?
                null :
                <div onClick={btnClickHandler} className={classes['scroll-btn']}>
                    <FontAwesomeIcon className={classes['scroll-btn-icon']} icon={['fas', 'chevron-up']} />
                </div>
            }
        </>
    )
};

export default ScrollToTopBtn;