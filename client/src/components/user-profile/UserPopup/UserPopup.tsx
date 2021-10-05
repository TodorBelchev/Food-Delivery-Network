import classes from './UserPopup.module.css';

const UserPopup: React.FC = () => {
    return (
        <div className={classes.popup}>
            <div className={classes.inner}>
                Popup content
            </div>
        </div>
    )
}

export default UserPopup;