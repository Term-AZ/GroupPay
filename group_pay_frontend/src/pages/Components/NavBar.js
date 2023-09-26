import React from 'react';
import "./NavBar.css";
import {Link} from 'react-router-dom';


const NavBar = () => {
    return(
        <div className = 'Navbar'>
            <div className='NavContainer'>
                <div className='NavLinks'>
                    <ul className='NavList'>
                        <li className='NavListItem'><Link to="/login">Login</Link></li>
                        <li className='NavListItem'><Link to="/about">About</Link></li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
export default NavBar