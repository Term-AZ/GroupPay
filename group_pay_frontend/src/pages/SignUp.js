import React from 'react'
import "./SignUp.css"
import {Link, Navigate, useNavigate} from 'react-router-dom'
import {useState, useEffect} from "react";

const SignUp = () =>{

    const navigate = useNavigate()

    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(()=>{
        fetch("http://localhost:8000/verify/",{
            method:"GET",
            headers:{"Content-Type":"application/json"},
            credentials: 'include'
        }).then(response =>{
            if(response.ok){
                setIsLoggedIn(true)
                return response.json()
            }
        }).catch(err => console.log(err))
    },[])

    if(isLoggedIn){
        navigate("/mainpage")
    }


    const [userInput, setUserInput] = useState({
        username: "",
        password: "",
        confirmPass: "",
        email: "",
    })
    const handleSignUp = async() =>{
        try{
            const endpoint = "http://localhost:8000/signup/"
            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userInput)
            });
            if(response.ok){
                var body = await response.json()
                navigate({
                    pathname: "/mainpage/"
                })
            }else{
                console.log(response)
            }
            // var body = await response.json()
            // userId = body
            // console.log("user id is: " + userId.response)
        }catch(error){
            console.log(error)
        }
    }
    const onTChange = event =>{
        setUserInput({...userInput, [event.target.name]: event.target.value})
    }
    return(
        <div className='Background'>
            <p className='TitleTextSignUp'>Sign Up</p>
            <div className='SignUpContainer'>  
                <div className='EntryContainer'>
                    <p className='EntryText'>Username</p>
                    <input type="text" onChange = {onTChange} name="username" className='UserInputSignUp'></input>
                    <p className='EntryText'>Email</p>
                    <input type="text" onChange = {onTChange} name = "email" className='UserInputSignUp'></input>
                    <p className='EntryText'>Password</p>
                    <input type="password" onChange = {onTChange} name = "password" className='UserInputSignUp'></input>
                    <p className='EntryText'>Confirm Password</p>
                    <input type="password" onChange = {onTChange} name="confirmPass" className='UserInputSignUp'></input>
                    <button className='SignUpButton' onClick={handleSignUp}>Sign Up</button>
                </div>
            </div>
            <a className='OppositeText'> <Link to="/login">Already have an account? Login in here! </Link></a>
        </div>
    );
}

export default SignUp


    //     function onSignUp(){
    //     const [todos,setTodos] = useState([])
    //     const url = "http://localhost:8000/test"
    //     useEffect(()=>{
    //         fetch(url).then(response=>{
    //             if(response.status==200){
    //                 return response.json()
    //             }
    //         }).then(data =>setTodos(data).catch(err=>console.log(err)))
    //     },[])

        // const [initialState, setState] = useState([])
        // const url="http://localhost:8000/test"

        // useEffect(()=>{
        //     fetch(url).then(response => {
        //     if(response.status==200){
        //         return response.json()
        //     }
        //     }).then(data=>setState(data)).catch(err => console.log(err))
        // },[])
        // return (
        //     <div> retdasda
        //     <Channel data={initialState}/>
        //     </div>
        // );
        // const handleSignUp = async()=>{
        //     try{
        //         const response = await fetch('http://localhost:8000/signup/',{
        //             method : 'POST'
        //         })
        //         if(!response.ok){
        //             throw new Error (`Error! status: ${response.status}`)
        //         }
    
        //     }catch(error){
        //         console.log(error)
        //     }

            // const handleSignUpT = async() =>{
    //     try{
    //         const response = await fetch('http://localhost:8000/test',{
    //             method: 'GET',
    //         })
    //         if (!response.ok){
    //             throw new Error (`Error! status: ${response.status}`)
    //         }
    //         const result = await response.json();

    //         console.log('result is: ', JSON.stringify(result, null, 4));
    //     } catch (err) {
    //         console.log(err.message);
    //     }
    // }
