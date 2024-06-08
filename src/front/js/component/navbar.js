import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import logo from '../../img/PinIT-logo low-res.png';
import "../../styles/navbar.css";

export const Navbar = () => {
    const { store, actions } = useContext(Context);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <nav className="navbar">
            <img src={logo} className="navbar-logo" alt="logo" />
            <ul className="navbar-list">
                {/* Add your navbar items here */}
            </ul>

            <div className="profile-dropdown">
                <div onClick={toggleDropdown} className="profile-dropdown-btn">
                    <div className="profile-img">
                        <i className="fa-solid fa-user"></i>
                    </div>
                    <span>
                        Michel R.
                        <i className="fa-solid fa-angle-down"></i>
                    </span>
                </div>

                {dropdownOpen && (
                    <ul className="profile-dropdown-list">
                        <li className="profile-dropdown-list-item">
                            <a href="favorites.html">
                                <i className="ion-icon"><ion-icon name="heart-outline"></ion-icon></i>
                                Favorites
                            </a>
                        </li>
                        <li className="profile-dropdown-list-item">
                            <a href="#">
                                <i className="ion-icon"><ion-icon name="settings-outline"></ion-icon></i>
                                Settings
                            </a>
                        </li>
                        <hr />
                        <li className="profile-dropdown-list-item">
                            <a href="#">
                                <i className="ion-icon"><ion-icon name="log-out-outline"></ion-icon></i>
                                Sign out
                            </a>
                        </li>
                    </ul>
                )}
            </div>
        </nav>
    );
};