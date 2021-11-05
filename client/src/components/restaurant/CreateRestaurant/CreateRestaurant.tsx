import React, { useState } from 'react';
import MultiChoiceSelect, { InputStringType } from '../../UI/MultiChoiceSelect/MultiChoiceSelect';
import classes from './CreateRestaurant.module.css';



const CreateRestaurant: React.FC = () => {
    const cities = [
        { name: 'Sofia', _id: 0 },
        { name: 'Varna', _id: 1 },
        { name: 'Burgas', _id: 2 },
        { name: 'Plovdiv', _id: 3 },
        { name: 'Shumen', _id: 4 },
        { name: 'Stara Zagora', _id: 5 },
        { name: 'Blagoevgrad', _id: 6 },
    ]
    const [selectedCities, setSelectedCities] = useState<InputStringType[]>([]);

    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(selectedCities);

    };

    return (
        <section className={`${classes['create-restaurant']} container`}>
            <h2>Lets create together the best restaurant</h2>
            <form className={classes['create-restaurant-form']} onSubmit={submitHandler}>
                <div className={classes.col}>
                    <input className={classes['create-restaurant-form-input']} type="text" placeholder=" " name="name" />
                    <span className={classes.placeholder}>Name of the restaurant</span>
                </div>
                <div className={classes.col}>
                    <input className={classes['create-restaurant-form-input']} type="text" placeholder=" " name="theme" />
                    <span className={classes.placeholder}>Main theme of the restaurant</span>
                </div>
                <div className={classes.col}>
                    <input className={classes['create-restaurant-form-input']} type="text" placeholder=" " name="categories" />
                    <span className={classes.placeholder}>Categories separated by ","</span>
                </div>
                <div className={classes.col}>
                    <input className={classes['create-restaurant-form-input']} type="text" placeholder=" " name="work-time" />
                    <span className={classes.placeholder}>Monday-Friday 10:00-20:00</span>
                </div>
                <div className={classes.col}>
                    <label className={classes['file-label']} htmlFor="image">Upload restaurant cover image</label>
                    <input className={classes['file-btn']} id="image" type="file" name="image" />
                </div>
                <div className={classes.col}>
                    <MultiChoiceSelect
                        text={'Select cities'}
                        inputStrings={cities}
                        setStateHandler={setSelectedCities}
                        selected={selectedCities}
                    />
                </div>
                <button className="main-btn create-btn">Create</button>
            </form>
        </section>
    )
};

export default CreateRestaurant;