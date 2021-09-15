import Benefits from '../components/home/Benefits';
import Cities from '../components/home/Cities';
import Hero from '../components/home/Hero';
import Kitchens from '../components/home/Kitchens';

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