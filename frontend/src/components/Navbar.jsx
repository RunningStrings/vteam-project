import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div style={{
      width: "200px",
      height: "100vh",
      background: "#f0f0f0",
      position: "fixed",
      padding: "20px"
    }}>
        <nav id="navbar">
      <ul  class="navbar-items flexbox-col">
        <li class="navbar-item flexbox-left">
            <Link to="/" class="navbar-item-inner flexbox-left">
            <div class="navbar-item-inner-icon-wrapper flexbox">
                <ion-icon name="home-outline"></ion-icon>
            </div>
            <span class="link-text">Hem</span>
            </Link>
        </li>
        <li class="navbar-item flexbox-left">
            <Link to="/bikes" class="navbar-item-inner flexbox-left">
            <div class="navbar-item-inner-icon-wrapper flexbox">
                <ion-icon name="bicycle-outline"></ion-icon>
            </div>
            <span class="link-text">Cyklar</span>
            </Link>
        </li>
        <li class="navbar-item flexbox-left">
            <Link to="/users" class="navbar-item-inner flexbox-left">
            <div class="navbar-item-inner-icon-wrapper flexbox">
                <ion-icon name="people-outline"></ion-icon>
            </div>
            <span class="link-text">Användare</span>
            </Link>
        </li>
        <li class="navbar-item flexbox-left">
            <Link to="/user" class="navbar-item-inner flexbox-left">
            <div class="navbar-item-inner-icon-wrapper flexbox">
                <ion-icon name="person-outline"></ion-icon>
            </div>
            <span class="link-text">En användare</span>
            </Link>
        </li>
        <li class="navbar-item flexbox-left">
            <Link to="/maps" class="navbar-item-inner flexbox-left">
            <div class="navbar-item-inner-icon-wrapper flexbox">
                <ion-icon name="map-outline"></ion-icon>
            </div>
            <span class="link-text">Kartor</span>
            </Link>
        </li>
        <li class="navbar-item flexbox-left">
            <Link to="/support" class="navbar-item-inner flexbox-left">
            <div class="navbar-item-inner-icon-wrapper flexbox">
                <ion-icon name="chatbubbles-outline"></ion-icon>
            </div>
            <span class="link-text">Support</span>
            </Link>
        </li>
        <li class="navbar-item flexbox-left">
            <Link to="/settings" class="navbar-item-inner flexbox-left">
            <div class="navbar-item-inner-icon-wrapper flexbox">
                <ion-icon name="settings-outline"></ion-icon>
            </div>
            <span class="link-text">Inställningar</span>
            </Link>
        </li>
      </ul>
      </nav>
    </div>
  );
};

export default Navbar;