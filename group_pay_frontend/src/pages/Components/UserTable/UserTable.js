import React from 'react'
import DataTable from '../DataTable/DataTable'
import {useState,useEffect} from 'react';

const UserTable = (props) => {

    // useEffect(() =>{
    //     fetch(props.uRL,{
    //         method:"GET",
    //         headers:{"Content-Type":"application/json"},
    //         credentials: 'include'
    //     }).then(response =>{
    //         if(response.ok){
    //             return response.json()
    //         }
    //     }).then(data=>setState(data)).catch(err => console.log(err))
    // },[])

    const rows = [
        {id:1,col1:"Hello",col2:"World"},
        {id:2,col1:"test",col2:"really"},
        {id:3,col1:"yes",col2:"no"},
    ]
    const columns = [
        {field:'col1', headerName:"Column 1", width:150},
        {field:'col2', headerName:"Column 2", width:150},
    ]
  return (
    <DataTable 
        rows = {rows}
        columns = {columns}
    />
  )
}

export default UserTable