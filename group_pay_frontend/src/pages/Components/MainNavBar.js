import React from 'react';
import './MainNavBar.css'
import {Link, Navigate, useNavigate} from 'react-router-dom'

const MainNavBar = () => {
    const navigate=useNavigate()

    const verifyCookie = async() => {
        try{
            const endpoint = "http://localhost:8000/verify/";
            const response = await fetch(endpoint, {
                method:"GET",
                headers: {"Content-Type":"application/json"},
                credentials: 'include'
            })
            if(response.ok){
                var body = await response.json()
                console.log("user id is: " + body)
            }
        }catch{
        }
    }
    const createCookie = async() => {
        try{
            const endpoint = "http://localhost:8000/create_session2/"
            const response = await fetch(endpoint, {
                method:"POST",
                headers: {"Content-Type":"application/json"},
                credentials: 'include'
            })
            if(response.ok){
            }
        }catch{

        }
    }
    const logout = async() =>{
        try{
            const endpoint = "http://localhost:8000/delete_session"
            const response = await fetch(endpoint,{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                credentials: 'include'
            })
            if(response.ok){
                var body = await response.json()
                console.log(body)
            }
        }catch{
            
        }
        navigate('/login')
    }

    const test = async() =>{
        await fetch("http://localhost:8000/my_payments/",{
            method:"GET",
            headers:{"Content-Type":"application/json"},
            credentials: 'include',
        }).then(response =>{
            if(response.ok){
                return response.json()
            }
        }).catch(err => console.log(err))
    }
    return(
        <div className='MainNavBackground'>
            <div className='MainNavContainer'>
                <ul className='MainNavList'>
                    <li className='MainNavListItem'><a><Link to="/mainpage" style={{ textDecoration: 'none' }}>HOME</Link></a></li>
                    <li className='MainNavListItem'><Link to="/my_payments" style={{ textDecoration: 'none' }}>MY PAYMENTS</Link></li>
                    <li className='MainNavListItem'><Link to="/group_payments" style={{ textDecoration: 'none' }}>MY GROUP PAYMENTS</Link></li>
                    <li className='MainNavListItem'><Link to="/manage_groups" style={{ textDecoration: 'none' }}>MANAGE GROUPS</Link></li>
                    {/* <li className='MainNavListItem'><button onClick={verifyCookie}>cookie test</button></li>
                    <li className='MainNavListItem'><button onClick={createCookie}>create cookie</button></li>
                    <li className='MainNavListItem'><button onClick={test}>test backend JSON response</button></li> */}
                </ul>
                <button className='MainLogout' onClick={logout}><p className="LogoutButtonText">Logout</p></button>
            </div>
        </div>
    );
}

export default MainNavBar;