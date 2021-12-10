import React, { useCallback, useEffect, useRef, useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';


import classes from './HorizontalNav.module.css';

type HorizontalNavProps = JSX.IntrinsicElements['nav'] & {
    links: { url: string; text: string }[];
}

const HorizontalNav: React.FC<HorizontalNavProps> = ({ links }) => {
    const history = useHistory();
    const [isSticky, setIsSticky] = useState(false);
    const [leftScroll, setLeftScroll] = useState(false);
    const [rightScroll, setRightScroll] = useState(false);
    const navRef = useRef<HTMLElement>(null);
    const ulRef = useRef<HTMLUListElement>(null);

    const handleYScroll = useCallback(() => {
        const navBar = navRef.current as HTMLElement;
        const ul = ulRef.current as HTMLUListElement;
        if (navBar && ul) {
            const styles = getComputedStyle(navBar);
            const distance = Number(styles.top.substring(0, styles.top.length - 2));
            setIsSticky(distance === ul.getBoundingClientRect().top && window.scrollY > 0);
        }
    }, []);

    const onUlScroll = () => {
        setLeftScroll((ulRef.current as HTMLElement).scrollLeft > 0 ? true : false);
    };

    const init = useCallback(() => {
        const ul = ulRef.current as HTMLElement;
        if (ul.scrollWidth - ul.clientWidth > 0) {
            setRightScroll(true);
            setLeftScroll(false);
            ul.scrollLeft = 0;
        } else {
            setRightScroll(false);
        }
    }, []);

    useEffect(() => {
        init();
        history.listen(() => {
            window.scrollTo({ top: 0 });
        });
        window.addEventListener('resize', init);
        window.addEventListener("scroll", handleYScroll);
        return () => {
            window.removeEventListener("scroll", handleYScroll);
            window.removeEventListener('resize', init);
        };
    }, [handleYScroll, init, history]);


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
        <nav ref={navRef} className={`${classes.nav} ${isSticky ? classes['nav--scrolled'] : ''}`}>
            <ul ref={ulRef} onScroll={onUlScroll} className={`container ${classes.list}`}>
                {leftScroll &&
                    <div className={classes['btn-wrapper']}>
                        <button onClick={slideLeft} className={classes['left-arrow']}>&lt;</button>
                    </div>
                }
                {links.map((link) => (
                    <li onClick={() => window.scroll({ top: 0 })} key={uuidv4()}>
                        <NavLink
                            activeClassName={classes.active}
                            className={classes['list-item']}
                            to={link.url}
                            exact
                        >
                            {link.text}
                        </NavLink>
                    </li>
                ))}
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