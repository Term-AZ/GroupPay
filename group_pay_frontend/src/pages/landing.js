import React from 'react'
import "./landing.css";
import NavBar from "./Components/NavBar"
import {Link} from 'react-router-dom'

const LandingPage = () =>{

    return(
        <div className='BackGround'>
            <NavBar/>
            <div className = "MainContainer">
                <img className='MainImage'></img>
                <div className='PageContainer'>
                    <p className='MainText'>Group Pay</p>
                    <p className='SubText'>An easy way to manage group payments with your friends and family </p>
                    <button className='ButtonTest'>
                        <Link to="/signup" className="visited">
                            <p className="ButtonText" >Start Now</p>
                            
                        </Link>
                    </button>
                </div>
            </div>
        </div>
    );
}


export default LandingPage
