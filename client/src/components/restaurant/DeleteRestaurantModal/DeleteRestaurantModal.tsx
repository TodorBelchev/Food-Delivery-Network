import { useHistory } from 'react-router';

import { useAppDispatch } from '../../../hooks/reduxHooks';
import useHttp from '../../../hooks/useHttp';
import { modalActions } from '../../../store/modal';
import restaurantOptions from '../../../utils/restaurantOptions';

import Spinner from '../../UI/Spinner/Spinner';


import classes from './DeleteRestaurantModal.module.css';

type DeleteRestaurantModalProps = JSX.IntrinsicElements['section'] & {
    _id: string;
    name: string;
}

const DeleteRestaurantModal: React.FC<DeleteRestaurantModalProps> = (props) => {
    const dispatch = useAppDispatch();
    const { sendRequest, isLoading } = useHttp();
    const history = useHistory();

    const cancelClickHandler = () => {
        dispatch(modalActions.close());
    }

    const processResponse = () => {
        dispatch(modalActions.close());
        history.replace('/');
    }

    const deleteClickHandler = () => {
        sendRequest(restaurantOptions.deleteRestaurant(props._id), processResponse);
    }

    return (
        <section className={classes['delete-restaurant']}>
            {!isLoading && <>
                <h3 className={classes['delete-restaurant-title']}>Confirm you want to delete {props.name}?</h3>
                <button onClick={deleteClickHandler} className={`${classes['delete-restaurant-btn']} ${classes['delete-restaurant-btn--danger']}`}>Delete</button>
                <button onClick={cancelClickHandler} className={classes['delete-restaurant-btn']}>Cancel</button>
            </>}
            {isLoading && <Spinner />}
        </section>
    )
}

export default DeleteRestaurantModal;