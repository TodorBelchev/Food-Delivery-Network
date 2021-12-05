import React, { useCallback, useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';


import classes from './HorizontalNav.module.css';


type HorizontalNavProps = JSX.IntrinsicElements['nav'] & {
    links: { url: string; text: string }[];
}

const HorizontalNav: React.FC<HorizontalNavProps> = ({ links }) => {
    const [scroll, setScroll] = useState(0);
    const [elementScroll, setElementScroll]= useState(1);
    const navRef = useRef<HTMLElement>(null);

    const handleScroll = useCallback((e: Event) => {
        const window = e.currentTarget as Window;
        setElementScroll(navRef.current?.getBoundingClientRect().top || 1);
        setScroll(window.scrollY);
    }, []);

    useEffect(() => {
        setScroll(window.scrollY);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [handleScroll])
    return (
        <nav ref={navRef} className={`${classes.nav} ${scroll > elementScroll ? classes['nav--scrolled'] : ''}`}>
            <ul className={`container ${classes.list}`}>
                {links.map(x => (
                    <li key={x.url}>
                        <NavLink activeClassName={classes.active} className={classes['list-item']} to={x.url} exact>{x.text}</NavLink>
                    </li>

                ))}
            </ul>
        </nav>
    )
};

export default HorizontalNav;