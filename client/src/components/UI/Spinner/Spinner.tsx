import classes from './Spinner.module.css';

const Spinner: React.FC = () => {
    return (
        <div className={classes['lds-dual-ring']}></div>
    )
}

export default Spinner;