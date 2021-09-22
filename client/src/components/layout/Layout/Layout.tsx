import Footer from "../Footer/Footer";
import Navigation from "../Navigation/Navigation";

const Layout: React.FC = (props) => {
    return (
        <>
            <Navigation />
            <main>{props.children}</main>
            <Footer />
        </>
    );
}

export default Layout;