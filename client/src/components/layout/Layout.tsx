import Navigation from "./Navigation";

const Layout: React.FC = (props) => {
    return (
        <>
            <Navigation />
            <main>{props.children}</main>
        </>
    );
}

export default Layout;