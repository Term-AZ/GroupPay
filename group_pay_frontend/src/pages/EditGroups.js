import React from 'react'
import './AddPayments.css'
import {Link, Navigate, useNavigate} from 'react-router-dom'
import {useState,useEffect} from 'react';
import { Channel } from './Components/Channel';
import { GridComponent, ColumnDirective } from '@syncfusion/ej2-react-grids';
const EditPayment = () =>{
    const [GroupOptions, setState] = useState([]) //for group drop down
    const [UserInGroup, setUsersInGroup] = useState([])//holds users in group
    const [GroupName, setGroupName] = useState({ //holds state of group name input box
        group_name:"",
        g_id:"",
    })
    const [UserInput, setUserInput] = useState({ //hold state of email input box 
        email: "",
        group_id:"",
    })
    const [SelectedRowEmail, setRowEmail] = useState() //hold state of what row is selected

    useEffect(() =>{
        fetch("http://localhost:8000/get_groups_owned/",{
            method:"GET",
            headers:{"Content-Type":"application/json"},
            credentials: 'include'
        }).then(response =>{
            if(response.ok){
                return response.json()
            }
        }).then(data=>setState(data)).catch(err => console.log(err))
    },[])

    const getGroupsAgain = async() =>{
        fetch("http://localhost:8000/get_groups_owned/",{
            method:"GET",
            headers:{"Content-Type":"application/json"},
            credentials: 'include'
        }).then(response =>{
            if(response.ok){
                return response.json()
            }
        }).then(data=>setState(data)).catch(err => console.log(err))
    }

    const handleGroupChange = async() =>{
        if(document.getElementById("groups").selectedIndex==0){
            return
        }
        let id = document.getElementById("groups").selectedIndex -1
        setUserInput({...UserInput, ["group_id"]: GroupOptions[id]["Group_Id"]})
        setGroupName({...GroupName, ["g_id"]:GroupOptions[id]["Group_Id"]})
        console.log(GroupOptions[id]["Group_Id"])
        fetch("http://localhost:8000/get_users_in_group/",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            credentials: 'include',
            body: JSON.stringify({"group_id": String(GroupOptions[id]["Group_Id"])})
        }).then(response =>{
            if(response.ok){
                return response.json()
            }
        }).then(data=>setUsersInGroup(data)).catch(err => console.log(err))}

    const addUser = async()=>{
        if(document.getElementById("groups").selectedIndex==0 || UserInput.email =="" ){
            return
        }
        fetch("http://localhost:8000/add_user_to_group/",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            credentials: 'include',
            body: JSON.stringify(UserInput)
        }).then(response =>{
            if(response.ok){
                handleGroupChange()
                return response.json()
            }
        }).catch(err => console.log(err))}
    
    const updateGroupName = async() =>{
        try{
            if(0 == GroupOptions[document.getElementById("groups").selectedIndex -1]["Group_Id"]){
                return
            }
        }
        catch{
            return
        }
        console.log(GroupName.g_id)
        console.log(UserInput.group_id)
        
        fetch("http://localhost:8000/edit_group_name/",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            credentials: 'include',
            body: JSON.stringify(GroupName)
        }).then(response =>{
            if(response.ok){
                return response.json()
            }
        }).catch(err => console.log(err))
        getGroupsAgain()
    
    }

    const deleteUserFromGroup = async() =>{
        fetch("http://localhost:8000/remove_user_from_group/",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            credentials: 'include',
            body: JSON.stringify({"email":SelectedRowEmail, "group_id": UserInput.group_id})
        }).then(response =>{
            if(response.ok){
                handleGroupChange()
                return response.json()
            }
        }).catch(err => console.log(err))
    }
    const onTChange = event =>{
        setUserInput({...UserInput, [event.target.name]:event.target.value})
    }
    const onNChange = event =>{
        setGroupName({...GroupName, [event.target.name]:event.target.value})
    }
    const onTableClick = event =>{
        if(SelectedRowEmail == undefined ){
            setRowEmail(event.currentTarget.attributes.getNamedItem('name').value)
            event.currentTarget.style.backgroundColor = "coral"
            return
        }
        try{
            document.getElementById(SelectedRowEmail).style.backgroundColor = "transparent"
            setRowEmail(event.currentTarget.attributes.getNamedItem('name').value)
            event.currentTarget.style.backgroundColor = "coral"
        }catch (err){
            console.log("error: " + err)
        }
    }
    return(
        <div className='AddTransactionBackground'>
            <div className='FormContainer'>
                <div className='UseExistingGroupContainer'>
                    <form className='MainForm'>
                        <label className='TransactionTitle'>
                            Group Name:
                        </label>
                        <input className='TransactionNameInput' name="group_name" onChange={onNChange}>
                        </input>
                        <select className='DropDownMenu' name="groups" id="groups" onChange={()=>handleGroupChange()} >
                            <option value='test'>Select Group</option>
                            {GroupOptions.map(groups => 
                                <option>{groups["Group_Name"]}</option>)}
                        </select>
                    </form>
                </div>
                <div className="UpdateName">
                    <button className='update' onClick={updateGroupName}>
                        Update Name
                    </button>
                </div>
                <div className='SecondaryContainer'>
                    <div className='UserInputContainer'>
                        <p className='AddText'>Add (By Email)</p>
                        <input className='TransactionNameInput' name='email' onChange={onTChange}></input>
                        <button className='UserInputBtn' onClick={addUser}>Add To Group</button>
                        <button className='UserInputBtn' onClick={deleteUserFromGroup}>Delete From Group</button>
                    </div>
                </div>
                <div className='AddPaymentTable' >

                    <table className='APTable'>
                        <tbody >
                            <tr>
                                <th className='APTableHeader'>
                                    Name
                                </th>
                                <th className='APTableHeader'>
                                    Email
                                </th>
                            </tr> 
                            {UserInGroup.map(groups => 
                                <tr className='tRow' name={groups["Email"]} id={groups["Email"]} onClick={onTableClick}>
                                    <td className='APTableItemName'>
                                        {groups["User_Name"]}
                                    </td>
                                    <td className='APTableItemName'>
                                        {groups["Email"]}
                                    </td>
                                </tr>
                                )}
                        </tbody>
                    </table>
                </div>  
                <div className='AcceptButtonContainer'>
                    <button className='AcceptButton'> 
                    <Link to="/my_payments" className="ReturnLink" style={{textDecoration: 'black'}}>Return</Link>
                    </button>
                    <Link to="/create_group" style={{ textDecoration: 'white'}} ><p className='CreateGroupLink'>Create Group Instead</p></Link>
                </div> 
            </div>   
        </div>
    )
}

export default EditPayment