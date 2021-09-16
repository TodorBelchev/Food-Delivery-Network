import Footer from "./Footer";
import Navigation from "./Navigation";

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