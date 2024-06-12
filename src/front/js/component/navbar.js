import React, { useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AutoCompleteComponent from "../component/autoCompleteComponent";
import { motion, AnimatePresence } from 'framer-motion';
import { Context } from "../store/appContext";
import logo from '../../img/PinIT-logo low-res.png';
import "../../styles/navbar.css";

export const Navbar = () => {
    const { store, actions } = useContext(Context);
    const [userCardOpen, setUserCardOpen] = useState(false);
    const [changeLocation, setChangeLocation] = useState(false)
    const [address, setAddress] = useState({
		location: null,
		lat: null,
		lng: null,
	});
    const [problem, setProblem] = useState(null);
    const location = useLocation();
    const currentPath = location.pathname;
    const navigate = useNavigate();

    const popupVariants = {
        hidden: { opacity: 0, y: -50 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -50 },
      };

    const toggleUserCard = () => {
        setUserCardOpen(!userCardOpen);
        console.log(`From navbar.js: userCardOpen is ${userCardOpen}`)
    };

    const getUserName = () => {
        if(store.email){
            const email = store.email;
            for (let i = 0; i < email.length; i++) {
                if (email[i] === "@") {
                    return email.slice(0, i)
                }
            }
        } else{
            return "No User"
        }
    }

    return (
        <nav className="navbar-div">
            {currentPath !== '/login' ? <img src={logo} className="navbar-logo" alt="logo" /> : <div></div>}

                {store.token ? (
                    <div className="navigation-div">

                        {currentPath === '/homePage' ? (
                            <div>
                                <Link to="/favorites">
                                    <button className="navbar-btn">Go to favorites</button>
                                </Link>
                            </div>
                        ) : (
                            <div>
                                <Link to="/homePage">
                                    <button className="navbar-btn">Go to events</button>
                                </Link>
                            </div>
                        )}


                        <div onClick={() => toggleUserCard()} className="navbar-btn">
                            <div className="profile-img">
                                <i className="bi bi-person-fill"></i>
                            </div>
                            <span>
                                {getUserName()}
                                <i className="bi bi-chevron-down"></i>
                            </span>
                        </div>
                            <AnimatePresence>
                                {userCardOpen && 
                                    <div className="navbar-card" >
                                        <motion.div
                                            className="card"
                                            variants={popupVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                        >
                                            <div className="user-box">
                                                <button onClick={() => setUserCardOpen(false)} className="close btn">X</button>
                                                <h3>User: {getUserName()}</h3>
                                                <h4>Email</h4>
                                                <p>{store.email || "--"}</p>
                                                <h4>UserID</h4>
                                                <p>{store.user_id || "--"}</p>
                                                <h4>Location</h4>
                                                {!changeLocation ? (
                                                    <div style={{display: "flex"}}>
                                                    <p>{store.location || "--"}</p>
                                                    <button onClick={() => setChangeLocation(true)}><i className="bi bi-pencil"></i></button>
                                                    </div>
                                                ) : (
                                                    <div>
                                                    <AutoCompleteComponent address={address} setAddress={setAddress} />
                                                    <button onClick={
                                                        async (e) => {
                                                            e.preventDefault();
                                                            console.log(`From navbar.js: this is the location sent:`)
                                                            console.log(`${address.lat}`)
                                                            console.log(`${address.lng}`)
                                                            console.log(`${address.location}`)
                                                            const result = await actions.changeLocation(address);
                                                            if (result.ok) {
                                                                console.log(`From navbar.js: ${result.msg}`);
                                                                setProblem(null);
                                                            } else {
                                                                console.log(`From navbar.js: Error: ${result.msg}`);
                                                                setProblem(`Error: ${result.msg}`);
                                                            }
                                                            setChangeLocation(false)
                                                        }}><i className="bi bi-floppy"></i></button>
                                                    </div>
                                                )}
                                                <button className="logout navbar-btn" onClick={() => { actions.logout(); setUserCardOpen(false); navigate('/login'); }}>
                                                    <i className="bi bi-box-arrow-left"></i>Logout
                                                </button>
                                            </div>
                                            {problem && <p className="problem">{problem}</p>}
                                        </motion.div>
                                    </div>
                                }
                            </AnimatePresence>
                    </div>
                ) : (
                    <div className="navbar-btn">
                            <div className="profile-img">
                                <i className="bi bi-person-fill"></i>
                            </div>
                            <span>
                                <Link to="/login">Log in</Link>
                            </span>
                    </div>
                )}  
            
        </nav>
    );
};