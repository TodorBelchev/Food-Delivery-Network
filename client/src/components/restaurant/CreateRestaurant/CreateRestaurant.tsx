import classes from './CreateRestaurant.module.css';

const CreateRestaurant: React.FC = () => {
    return (
        <section className={classes['create-restaurant']}>
            <h2 className={classes['create-restaurant-title']}>Lets create together the best restaurant</h2>
            <form className={classes['create-restaurant-form']}>
                <label htmlFor="name">Enter the name of the restaurant:</label>
                <input type="text" placeholder="Name of the restaurant" name="name" />
                <label htmlFor="theme">Enter main theme of the restaurant</label>
                <input type="text" placeholder="Main theme of the restaurant" name="theme" />
                <label htmlFor="categories">Please fill the categories separated by ',':</label>
                <input type="text" placeholder="Categories separated by ','" name="categories" />
                <label htmlFor="work-time">Please fill working time with days and hours:</label>
                <input type="text" placeholder="Monday-Friday 10:00-20:00" name="work-time" />
                <label htmlFor="image">Upload your image</label>
                <input id="my-file" type="file" name="image" />
                <p>Please select cities of the restaurant</p>
                <article className={classes['cities-container']}>
                    <label htmlFor="checkbox" className={classes['checkbox-container']}>Sofia</label>
                    <label htmlFor="checkbox" className={classes['checkbox-container']}>Varna</label>
                    <label htmlFor="checkbox" className={classes['checkbox-container']}>Plovdiv</label>
                    <label htmlFor="checkbox" className={classes['checkbox-container']}>Burgas</label>
                    <label htmlFor="checkbox" className={classes['checkbox-container']}>Stara Zagora</label>
                    <label htmlFor="checkbox" className={classes['checkbox-container']}>Veliko Tarnovo</label>
                    <label htmlFor="checkbox" className={classes['checkbox-container']}>Pleven</label>
                    <label htmlFor="checkbox" className={classes['checkbox-container']}>Blagoevgrad</label>
                    <label htmlFor="checkbox" className={classes['checkbox-container']}>Ruse</label>
                    <label htmlFor="checkbox" className={classes['checkbox-container']}>Shumen</label>
                </article>
                <button className="main-btn create-btn">Create</button>
            </form>
        </section>
    )
};

export default CreateRestaurant;