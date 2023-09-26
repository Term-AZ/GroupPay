import React from 'react'
import ListView from './Components/ListView'
import './MainPage.css'

const HomePage = () => {
    return(
        <div className = 'GraphContainer'>
            <p>Last Months Payments</p>
            <div className = 'Graph'/> 
            <div className = 'ListBoxMainContainer'>
                <ListView title="Recent Payments"/>
                <ListView title="Payments to Make"/>
            </div>
        </div>
    )
}

export default HomePage