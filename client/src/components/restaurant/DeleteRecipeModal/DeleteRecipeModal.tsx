import { useAppDispatch } from '../../../hooks/redux-hooks';
import useHttp from '../../../hooks/use-http';
import IRestaurant from '../../../interfaces/IRestaurant';
import { modalActions } from '../../../store/modal';
import { restaurantActions } from '../../../store/restaurant';


import classes from './DeleteRecipeModal.module.css';

type DeleteRecipeModalProps = JSX.IntrinsicElements['section'] & {
    _id: string;
    name: string;
    restaurantId: string;
}

const DeleteRecipeModal: React.FC<DeleteRecipeModalProps> = ({ _id, name, restaurantId }) => {
    const dispatch = useAppDispatch();
    const { sendRequest } = useHttp();

    const processResponse = (res: IRestaurant) => {
        dispatch(modalActions.close());
        dispatch(restaurantActions.setRestaurant(res));
    };

    const deleteClickHandler = () => {
        sendRequest({
            url: `http://localhost:3030/api/recipe/${_id}/${restaurantId}`,
            method: 'DELETE'
        }, processResponse);
    };

    const cancelClickHandler = () => {
        dispatch(modalActions.close());
    };

    return (
        <section className={classes['delete-recipe']}>
            <h3 className={classes['delete-recipe-title']}>Confirm you want to delete {name}?</h3>
            <button onClick={deleteClickHandler} className={`${classes['delete-recipe-btn']} ${classes['delete-recipe-btn--danger']}`}>Delete</button>
            <button onClick={cancelClickHandler} className={classes['delete-recipe-btn']}>Cancel</button>
        </section>
    );
};

export default DeleteRecipeModal;