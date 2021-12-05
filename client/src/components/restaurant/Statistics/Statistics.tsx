import CategoriesChart from './CategoriesChart/CategoriesChart';
import SalesChart from './SalesChart/SalesChart';


import classes from './Statistics.module.css';


const Statistics: React.FC = () => {
    return (
        <div className={`${classes.statistics} container`}>
            <SalesChart />
            <CategoriesChart />
        </div>
    );
};

export default Statistics;