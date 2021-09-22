import Benefits from '../components/home/Benefits/Benefits';
import Cities from '../components/home/Cities/Cities';
import Hero from '../components/home/Hero/Hero';
import Kitchens from '../components/home/Kitchens/Kitchens';

const Home: React.FC = () => {
    return (
        <>
            <Hero />
            <Cities />
            <Benefits />
            <Kitchens />
        </>
    );
}

export default Home;