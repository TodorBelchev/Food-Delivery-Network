import React, { useCallback, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';


import classes from './HorizontalNav.module.css';


type HorizontalNavProps = JSX.IntrinsicElements['nav'] & {
    links: { url: string; text: string }[];
}

const HorizontalNav: React.FC<HorizontalNavProps> = ({ links }) => {
    const [scroll, setScroll] = useState(0);

    const handleScroll = useCallback((e: Event) => {
        const window = e.currentTarget as Window;
        setScroll(window.scrollY);
    }, []);

    useEffect(() => {
        setScroll(window.scrollY);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [handleScroll])
    return (
        <nav className={`${classes.nav} ${scroll > 0 ? classes['nav--scrolled'] : ''}`}>
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