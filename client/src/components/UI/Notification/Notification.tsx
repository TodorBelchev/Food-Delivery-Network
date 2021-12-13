import { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks';
import { notificationActions } from '../../../store/notification';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Transition } from 'react-transition-group';


import classes from './Notification.module.css';

const Notification: React.FC = () => {
    const [show, setShow] = useState(false);
    const dispatch = useAppDispatch();
    const notificationState = useAppSelector(state => state.notification);
    const nodeRef = useRef(null);

    useEffect(() => {
        if (notificationState.text.length > 0) {
            setShow(true);
        }
    }, [notificationState.text]);

    const closeNotificationHandler = () => {
        setShow(false);
        setTimeout(() => {
            dispatch(notificationActions.close());
        }, 300);
    };

    const text = notificationState.text;
    const textClasses = `${classes['notification-text']} ${notificationState.type === 'error' ? classes['notification-text--red'] : ''}`;
    const greenIconClasses = `${classes.icon}`;
    const redIconClasses = `${classes.icon} ${classes['icon--red']}`;
    const closeIconClasses = `${classes.icon} ${classes['icon--red']} ${classes['icon--close']}`;

    return (
        <>
            {ReactDOM.createPortal(
                <>
                    {notificationState.text && null}
                    {notificationState.text && <Transition timeout={300} in={show} mountOnEnter nodeRef={nodeRef}>
                        {state => {
                            let animateClasses = '';

                            if (state === 'entering' || state === 'entered') {
                                animateClasses = `${classes.entering}`;
                            }

                            if (state === 'exiting' || state === 'exited') {
                                animateClasses = `${classes.exiting}`;
                            }

                            return (
                                <div className={`${classes.notification} ${animateClasses}`}>
                                    {notificationState.type === 'success' ?
                                        <FontAwesomeIcon className={greenIconClasses} icon={['fas', 'check-circle']} /> :
                                        <FontAwesomeIcon className={redIconClasses} icon={['fas', 'exclamation-circle']} />}
                                    <p className={textClasses}>{text}</p>
                                    <FontAwesomeIcon onClick={closeNotificationHandler} className={closeIconClasses} icon={['fas', 'times-circle']} />
                                </div>
                            )
                        }}
                    </Transition>}
                </>,
                document.getElementById('notification')!
            )}
        </>
    );
};

export default Notification;