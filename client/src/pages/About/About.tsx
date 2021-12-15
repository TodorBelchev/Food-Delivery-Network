import classes from './About.module.css';

const About: React.FC = () => {
    return (
        <div className={`container ${classes.about}`}>
            <h2 className={classes['about-title']}>About us:</h2>
            <p className={classes['about-text']}>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Iste minima nemo ut soluta sequi inventore
                neque odio voluptatem rem tempora aperiam incidunt voluptate aut dolor ipsa suscipit, officia excepturi
                ducimus accusamus debitis quo. Ad incidunt vitae, repudiandae a asperiores saepe. At sint aliquid
                voluptatem quod quibusdam, sunt ea, officia illum consectetur pariatur ipsam consequatur nemo?
                Nam, facilis soluta! Facere voluptatum et vitae rerum libero? Aliquam expedita qui doloribus
                voluptatem, tempora labore at distinctio error optio sint tenetur, quod, soluta maxime accusamus
                delectus dolore blanditiis. Fuga vel repudiandae laboriosam quas dignissimos, reiciendis cupiditate
                ratione ducimus! Et nesciunt repellendus est dolorem omnis?</p>

            <article className={classes.contacts}>
                <h2 className={classes['about-title']}>Contacts:</h2>
                <div className={classes['contacts-text']}>
                    <p>Some address</p>
                    <p>Working hours: 09:00 - 18:00 from monday to friday</p>
                    <p>Phone: 0 700 00 000</p>
                </div>
                <div className={classes['contacts-map']}>
                    <iframe
                        title='address'
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4931.414327609362!2d23.313959270335275!3d42.69871277574691!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40aa8569a7b8f119%3A0x2ad586e5ca8a3d27!2sul.%20%22Tsar%20Samuil%22%2C%20Sofia!5e0!3m2!1sen!2sbg!4v1614170181791!5m2!1sen!2sbg"
                        width="600"
                        height="450"
                        loading="lazy"
                        style={{ border: 0 }}
                        allowFullScreen={false}
                    ></iframe>
                </div>
            </article>
        </div>
    )
};

export default About;