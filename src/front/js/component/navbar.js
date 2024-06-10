import React, { useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import logo from '../../img/PinIT-logo low-res.png';
import "../../styles/navbar.css";

export const Navbar = () => {
    const { store, actions } = useContext(Context);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const location = useLocation();
    const currentPath = location.pathname;
    const navigate = useNavigate();

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <nav className="navbar-div">
            <img src={logo} className="navbar-logo" alt="logo" />
            <ul className="navbar-list">
                <li><p>Test text element</p></li>
                <li><a href="#" >Test a element</a></li>
            </ul>

            <div className="navbar-dropdown">
                <div onClick={toggleDropdown} className="profile-dropdown-btn">
                    <div className="profile-img">
                        <i className="bi bi-person-fill"></i>
                    </div>
                    <span>
                        Michel R.
                        <i className="bi bi-chevron-down"></i>
                    </span>
                </div>

                {dropdownOpen && (
                    <ul className="navbar-dropdown-list">
                        <li className="profile-dropdown-list-item">
                            Some item here.
                        </li>
                        <li className="profile-dropdown-list-item">
                            <a href="#">
                            <i className="bi bi-gear"></i>
                                Settings
                            </a>
                        </li>
                        <hr />
                        <li className="profile-dropdown-list-item">
                            <a href="#">
                                <i className="bi bi-box-arrow-left"></i>
                                Sign out
                            </a>
                        </li>
                    </ul>           
                )}
            </div>

            { store.token && <button className="btn" onClick={() => {actions.logout(); navigate('/login')}}><i className="bi bi-box-arrow-left"></i>Logout</button> }
            {currentPath === '/homePage' ? (
                <div className="btn">
                    <Link to="/favorites">
                        <button>Go to Favorites</button>
                    </Link>
                </div>
            ) : (
                <div className="btn">
                    <Link to="/homePage">
                        <button>Go to Home</button>
                    </Link>
                </div>
            )}
            
        </nav>
    );
};