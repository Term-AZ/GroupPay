import React from 'react'
import "./About.css"
import NavBar from './Components/NavBar'
import { Link } from 'react-router-dom'

const About = () => {
  return (
    <div className="AboutBackground">
        <NavBar/>
        <div className="MainAboutContainer">
            <div className='AboutSiteContainer'>
                <p className="AboutText">
                    Group Pay is a payments management tool that 
                    allows you to keep track of group payments easily and efficently. 
                    It removes the middle step of manually checking on payment payees to see if they have contributed to original purchase or not.  
                </p>
            </div>
            <div className="AboutGridContainer">
                <div className="AboutGridItem">
                    <img src={require("./images/gpa1.png")}></img>
                    <p>Simple to understand and use UI</p>
                </div>
                <div className="AboutGridItem">
                    <img src={require("./images/gpa2.png")}></img>
                    <p>Easily readable detailed information about transactions</p>
                </div>
                <div className="AboutGridItem">
                    <img src={require("./images/gpa3.png")}></img>
                    <p>View payment history and summeries of your spending</p>
                </div>
            </div>
            <div className="EnterContainer">
                <Link to="/signup">
                    <p className="SignUpButtonAbout">
                        Sign Up Now!
                    </p>
                    </Link>
            </div>
        </div>
    </div>

  )
}


export default About