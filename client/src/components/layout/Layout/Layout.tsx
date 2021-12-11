import { useAppSelector } from "../../../hooks/reduxHooks";

import Notification from "../../UI/Notification/Notification";
import ScrollToTopBtn from "../../UI/ScrollToTopBtn/ScrollToTopBtn";
import Footer from "../Footer/Footer";
import Navigation from "../Navigation/Navigation";

const Layout: React.FC = (props) => {
	const notificationState = useAppSelector(state => state.notification);

    return (
        <>
			{notificationState.text && <Notification />}
            <ScrollToTopBtn />
            <Navigation />
            <main>{props.children}</main>
            <Footer />
        </>
    );
}

export default Layout;