import React, { useCallback, useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';


import classes from './HorizontalNav.module.css';

type HorizontalNavProps = JSX.IntrinsicElements['nav'] & {
    links: { url: string; text: string }[];
}

const HorizontalNav: React.FC<HorizontalNavProps> = ({ links }) => {
    const [scroll, setScroll] = useState(0);
    const [elementScroll, setElementScroll] = useState(1);
    const [leftScroll, setLeftScroll] = useState(false);
    const [rightScroll, setRightScroll] = useState(false);
    const navRef = useRef<HTMLElement>(null);
    const ulRef = useRef<HTMLUListElement>(null);

    const handleScroll = useCallback((e: Event) => {
        const window = e.currentTarget as Window;
        setElementScroll(navRef.current?.getBoundingClientRect().top || 1);
        setScroll(window.scrollY);
    }, []);

    const onUlScroll = () => {
        setLeftScroll((ulRef.current as HTMLElement).scrollLeft > 0 ? true : false);
    };

    const init = () => {
        const ul = ulRef.current as HTMLElement;
        if (ul.scrollWidth - ul.clientWidth > 0) {
            setRightScroll(true);
            setLeftScroll(false);
            ul.scrollLeft = 0;
        } else {
            setRightScroll(false);
        }
    };

    useEffect(() => {
        init();
        setScroll(window.scrollY);
        window.addEventListener('resize', init);
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener('resize', init);
        };
    }, [handleScroll]);


    const slideRight = () => {
        const ul = ulRef.current as HTMLElement;
        const nav = navRef.current as HTMLElement;
        ul.scrollLeft = ul.scrollLeft + 100;

        if (ul.scrollWidth - nav.clientWidth - ul.scrollLeft <= 120) {
            setRightScroll(false);
            ul.scrollLeft = ul.scrollLeft + 9999;
        }
    };

    const slideLeft = () => {
        const ul = ulRef.current as HTMLElement;
        ul.scrollLeft = ul.scrollLeft - 100;

        if (ul.scrollLeft < 120) {
            ul.scrollLeft = 0;
        }
        
        if (ul.scrollWidth - ul.clientWidth > 0) {
            setRightScroll(true);
        }
    };


    return (
        <nav ref={navRef} className={`${classes.nav} ${scroll > elementScroll ? classes['nav--scrolled'] : ''}`}>
            <ul ref={ulRef} onScroll={onUlScroll} className={`container ${classes.list}`}>
                {leftScroll &&
                    <div className={classes['btn-wrapper']}>
                        <button onClick={slideLeft} className={classes['left-arrow']}>&lt;</button>
                    </div>
                }
                {links.map((link) => {
                    return (
                        <li className={classes['list-item']} key={uuidv4()}>
                            <NavLink to={link.url}>{link.text}</NavLink>
                        </li>
                    )
                })}
                {rightScroll &&
                    <div className={`${classes['btn-wrapper']} ${classes['btn-wrapper--right']}`}>
                        <button onClick={slideRight} className={classes['right-arrow']}>&gt;</button>
                    </div>
                }
            </ul>
        </nav>
    )
};

export default HorizontalNav;