import React from 'react'
import { Channel } from './Components/Channel'
import {useState,useEffect} from 'react';

const Testpage = () =>{

    const [initialState, setState] = useState([])
    const url="http://localhost:8000/test/"

    useEffect(()=>{
        fetch(url).then(response => {
        if(response.status==200){
            return response.json()
        }
        }).then(data=>setState(data)).catch(err => console.log(err))
    },[])
    return (
        <div className="App"> retdasda
            {console.log(initialState)}
            <Channel data={initialState}/>
        </div>
    );
}

export default Testpage