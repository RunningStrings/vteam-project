import { Link } from "react-router-dom";
//import { useAuth0 } from "@auth0/auth0-react";
import LogoutButton from "./LogoutButton";

const Navbar = () => {
    //const { isAuthenticated } = useAuth0();

    return (
        <div style={{
            width: "200px",
            height: "100vh",
            background: "#f0f0f0",
            position: "fixed",
            padding: "20px"
        }}
        >
            <nav id="navbar">
                <ul  className="navbar-items flexbox-col">
    
                    <li className="navbar-item flexbox-left">
                        <Link to="/" className="navbar-item-inner flexbox-left">
                            <div className="navbar-item-inner-icon-wrapper flexbox">
                                <ion-icon name="home-outline"></ion-icon>
                            </div>
                            <span className="link-text">Hem</span>
                        </Link>
                    </li>
    
                    <li className="navbar-item flexbox-left">
                        <Link to="/user" className="navbar-item-inner flexbox-left">
                            <div className="navbar-item-inner-icon-wrapper flexbox">
                                <ion-icon name="person-outline"></ion-icon>
                            </div>
                            <span className="link-text">En användare</span>
                        </Link>
                    </li>
                    <li className="navbar-item flexbox-left">
                        <Link to="/payment" className="navbar-item-inner flexbox-left">
                            <div className="navbar-item-inner-icon-wrapper flexbox">
                                <ion-icon name="card-outline"></ion-icon>
                            </div>
                            <span className="link-text">Betalning</span>
                        </Link>
                    </li>
                    <li className="navbar-item flexbox-left">
                        <Link to="/trips" className="navbar-item-inner flexbox-left">
                            <div className="navbar-item-inner-icon-wrapper flexbox">
                                <ion-icon name="book-outline"></ion-icon>
                            </div>
                            <span className="link-text">Resor</span>
                        </Link>
                    </li>   
                    <li className="navbar-item flexbox-left">
                        <Link to="/maps" className="navbar-item-inner flexbox-left">
                            <div className="navbar-item-inner-icon-wrapper flexbox">
                                <ion-icon name="map-outline"></ion-icon>
                            </div>
                            <span className="link-text">Kartor</span>
                        </Link>
                    </li>
    
                    <li className="navbar-item flexbox-left">
                        <Link to="/support" className="navbar-item-inner flexbox-left">
                            <div className="navbar-item-inner-icon-wrapper flexbox">
                                <ion-icon name="chatbubbles-outline"></ion-icon>
                            </div>
                            <span className="link-text">Support</span>
                        </Link>
                    </li>
    
    
                </ul>
                <ul className="navbar-items flexbox-col">
                    <li className="navbar-item flexbox-left">
                        <LogoutButton />
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Navbar;