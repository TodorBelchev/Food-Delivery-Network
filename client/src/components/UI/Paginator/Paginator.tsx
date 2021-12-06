import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import IObject from '../../../interfaces/IObject';

import { constructNewQuery, extractQueryObject } from '../../../utils/queryHelper';


import classes from './Paginator.module.css';

type PaginatorProps = JSX.IntrinsicElements['div'] & {
    totalCount: number;
    shownCount: number;
    page: number;
    isLoading: boolean;
}

const Paginator: React.FC<PaginatorProps> = ({ totalCount, shownCount, page, isLoading }) => {
    const history = useHistory();
    const [query, setQuery] = useState<IObject>({});
    const lastPage = Math.ceil(totalCount / shownCount);

    useEffect(() => {
        if (history.location.search) {
            setQuery(extractQueryObject(history.location.search));
        }
    }, [history.location.search]);

    const navigate = () => {
        const newQuery = constructNewQuery(query);
        history.push(`${history.location.pathname}?${newQuery}`);
    }

    const nextPageHandler = () => {
        const currentPage = Number(query['page']) || 1;
        query['page'] = (currentPage + 1).toString();
        navigate();
    };

    const previousPageHandler = () => {
        const currentPage = Number(query['page']) || 1;
        query['page'] = (currentPage - 1).toString();
        navigate();
    };

    const firstPageHandler = () => {
        query['page'] = '1';
        navigate();
    };

    const lastPageHandler = () => {
        query['page'] = lastPage.toString();
        navigate();
    }

    return (
        <div className={classes.paginator}>
            <button className={classes['paginator-btn']} onClick={firstPageHandler} disabled={1 === page || isLoading}>&lt;&lt;</button>
            <button className={classes['paginator-btn']} onClick={previousPageHandler} disabled={1 === page || isLoading}>-</button>
            <span className={classes['paginator-page']}>{page}</span>
            <button className={classes['paginator-btn']} onClick={nextPageHandler} disabled={lastPage === page || isLoading}>+</button>
            <button className={classes['paginator-btn']} onClick={lastPageHandler} disabled={lastPage === page || isLoading}>&gt;&gt;</button>
        </div>
    );
};

export default Paginator;