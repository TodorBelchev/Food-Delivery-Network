import Notification from "../../UI/Notification/Notification";
import ScrollToTopBtn from "../../UI/ScrollToTopBtn/ScrollToTopBtn";
import Footer from "../Footer/Footer";
import Navigation from "../Navigation/Navigation";

const Layout: React.FC = (props) => {

    return (
        <>
			<Notification />
            <ScrollToTopBtn />
            <Navigation />
            <main>{props.children}</main>
            <Footer />
        </>
    );
}

export default Layout;