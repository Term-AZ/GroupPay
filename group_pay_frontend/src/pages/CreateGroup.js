import React from "react";
import './AddPayments.css'
import './CreateGroup.css'
import {useState} from "react"
import {Link, Navigate, useNavigate} from 'react-router-dom'

const CreateGroup = () =>{

    const [GroupName, setGroupName] = useState({
        group_name:""
    })

    const createGroup = async() =>{
        if(GroupName.group_name == ""){
            return
        }
        fetch("http://localhost:8000/create_group/",{
            method:"POST",
            headers: {"Content-Type":"application/json"},
            credentials: 'include',
            body: JSON.stringify({"group_name": GroupName.group_name})
        }) .then(response=>{
            if(response.ok){
                return response.json()
            }
        }).catch(err=> console.log(err))      

    }
    const onGChange = event =>{
        setGroupName({[event.target.name]: event.target.value})
    }

    return(
        <div className='AddGroupBackground'>
            <div className='AddGroupFormContainer'>
                <div className='CreateGroupContainer'>
                    <form className='MainForm'>
                        <label className='GroupTitle'>
                            Group Name:
                        </label>
                        <input className='GroupNameInput' name='group_name' onChange={onGChange}>
                        </input>
                    </form>
                </div>
                    <div className='AcceptButtonContainer'>
                        <button className='AcceptButton2' onClick={createGroup}> create
                            {/* <Link to='/edit_groups' className="ReturnToAdd" style={{ textDecoration: 'none'}}>Create
                            </Link> */}
                        </button>
                        <Link to="/my_payments" style={{ textDecoration: 'white'}}><p className='CreateGroupLink'>Return to mainpage</p></Link>
                    </div>
                </div>
            </div>  
    );
}
export default CreateGroup

