import { useHistory } from 'react-router-dom';

import { constructNewQuery, extractQueryObject } from '../../../utils/queryHelper';

import classes from './SortRestaurants.module.css';

const SortRestaurants: React.FC = () => {
    const history = useHistory();
    const query = extractQueryObject(history.location.search);

    const onSortChange = (e: React.FormEvent<HTMLSelectElement>) => {
        query.sort = e.currentTarget.value;
        query.page = '1';
        history.push(`${history.location.pathname}?${constructNewQuery(query)}`)
    }

    return (
        <div className={classes.sort}>
            <select className={classes['sort-select']} name="sort" id="sort" value={query.sort || 'rating-desc'} onChange={onSortChange}>
                <option value="rating-desc">Rating desc</option>
                <option value="rating-asc">Rating asc</option>
                <option value="ratingsCount-desc">Comments count desc</option>
                <option value="ratingsCount-asc">Comments count asc</option>
            </select>
        </div>
    )
};

export default SortRestaurants;