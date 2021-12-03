import CategoriesChart from './CategoriesChart/CategoriesChart';


import classes from './Statistics.module.css';


const Statistics: React.FC = () => {
    return (
        <div className={classes.statistics}>
            <CategoriesChart />
        </div>
    );
};

export default Statistics;