import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactDOM from 'react-dom';
import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks';
import { notificationActions } from '../../../store/notification';


import classes from './Notification.module.css';

const Notification: React.FC = () => {
    const dispatch = useAppDispatch();
    const notificationState = useAppSelector(state => state.notification);

    const closeNotificationHandler = () => {
        dispatch(notificationActions.close());
    };

    const textClasses = `${classes['notification-text']} ${notificationState.type === 'error' ? classes['notification-text--red'] : ''}`;
    const greenIconClasses = `${classes.icon}`;
    const redIconClasses = `${classes.icon} ${classes['icon--red']}`;
    const closeIconClasses = `${classes.icon} ${classes['icon--red']} ${classes['icon--close']}`;

    return (
        <>
            {ReactDOM.createPortal(
                <div className={classes.notification}>
                    {notificationState.type === 'success' ?
                        <FontAwesomeIcon className={greenIconClasses} icon={['fas', 'check-circle']} /> :
                        <FontAwesomeIcon className={redIconClasses} icon={['fas', 'exclamation-circle']} />}
                    <p className={textClasses}>{notificationState.text}</p>
                    <FontAwesomeIcon onClick={closeNotificationHandler} className={closeIconClasses} icon={['fas', 'times-circle']} />
                </div>,
                document.getElementById('notification')!
            )}
        </>
    );
};

export default Notification;