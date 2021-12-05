import IRestaurant from "../../../interfaces/IRestaurant";
import RestaurantCard from "../RestaurantCard/RestaurantCard";


import classes from './RestaurantList.module.css';


type RestaurantListProps = JSX.IntrinsicElements['ul'] & {
    restaurants: IRestaurant[];
}

const RestaurantList: React.FC<RestaurantListProps> = ({ restaurants }) => {
    return (
        <ul className={`${classes.list}`}>
            {restaurants.map(x => (
                <li key={x._id}>
                    <RestaurantCard restaurant={x} />
                </li>
            ))}
        </ul>
    )
};

export default RestaurantList;