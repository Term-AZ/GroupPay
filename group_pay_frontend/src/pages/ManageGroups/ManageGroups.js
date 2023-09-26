import React from 'react'
import "./ManageGroups.css"
import MainNavBar from '../Components/MainNavBar'
import { DataGrid, useGridApiContext } from '@mui/x-data-grid';
import {useState,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

const ManageGroups = () => {
    const [isOwner, setIsOwner] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [isCreating, setIsCreating] = useState(false)
    const [selectedRow, setSelectedRow] = useState([{Group_Name: "", Group_Id:""}])
    const [selectedUser, setSelectedUser] = useState()
    const [MyGroupsData, setMyGroupsData] = useState([])
    const [groupsInData, setGroupsInData] = useState([])
    const [groupData, setGroupData] = useState([])
    const [addUserInput, setAddUserInput] = useState({
        email:""
    })
    const [createGroupInput, setCreateGroupInput] = useState({
        group_name:""
    })
    const navigate= useNavigate()


    useEffect(()=>{
        getMyGroups()
        getGroupsImIn()
    },[])

    useEffect(()=>{
        getUserInGroup()
        
    }, [selectedRow])

    const getUserInGroup = async() =>{
        try{
            if(selectedRow[0].Group_Id!=""){
                await fetch("http://localhost:8000/get_users_in_group/",{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                credentials: 'include',
                body: JSON.stringify({"group_id":selectedRow[0].Group_Id})
            }).then(response =>{
                if(response.ok){
                    return response.json()
                }else{
                    navigate("/login")
                }
            }).then(data=>setGroupData(data)).catch(err => console.log(err))
            }
        }catch{
            
        }
    }

    const getMyGroups = async() =>{
        fetch("http://localhost:8000/get_groups_owned/",{
            method:"GET",
            headers:{"Content-Type":"application/json"},
            credentials: 'include'
        }).then(response =>{
            if(response.ok){
                return response.json()
            }else{
                navigate("/login")
            }
        }).then(data=>setMyGroupsData(data)).catch(err => console.log(err))
    }
    const getGroupsImIn = async() =>{
        fetch("http://localhost:8000/get_groups_in/",{
            method:"GET",
            headers:{"Content-Type":"application/json"},
            credentials: 'include'
        }).then(response =>{
            if(response.ok){
                return response.json()
            }else{
                navigate("/login")
            }
        }).then(data=>setGroupsInData(data)).catch(err => console.log(err))
    }

    const myGroupColumns = [
        {field:'Group_Name', headerName:'Group Name', width:300},
        {field:'UserCount', headerName:'Number of Participents', width:300},
        {field:'Date_Created', headerName:'Date Created', width:200},
    ]
    const partOfGroupsColumns = [
        {field:'Group_Name', headerName:'Group Name', width:200},
        {field:'User_Name', headerName:'Group Owner', width:200},
        {field:'UserCount', headerName:'Number of Participents', width:250},
        {field:'Date_Joined', headerName:'Date Joined', width:100},
    ]
    const groupDataColumns = [
        {field:'User_Name', headerName:'User Name', width:400},
        {field:'Email', headerName:'Email', width:400},
        {field:'Date_Joined', headerName:'Date_Joined', width:200},
    ]

    const deleteGroup = async()=>{
        if(selectedRow[0].Group_Id!=""){
            fetch("http://localhost:8000/delete_group/",{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                credentials: 'include',
                body: JSON.stringify({"group_id":selectedRow[0].Group_Id})
            }).then(response =>{
                if(response.ok){
                    return response.json()
                }
            }).catch(err => console.log(err))
            setSelectedRow([{Group_Name: "", Group_Id:""}])
            setGroupData([{Email:""}])
            getMyGroups()
        }
    }
    const leaveGroup = async() =>{
        if(selectedRow[0].Group_Id!=""){
            fetch("http://localhost:8000/leave_group/",{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                credentials: 'include',
                body: JSON.stringify({"group_id": selectedRow[0].Group_Id})
            }).then(response =>{
                if(response.ok){
                    return response.json()
                }
            }).catch(err => console.log(err))
            setSelectedRow([{Group_Name: "", Group_Id:""}])
            setGroupData([{Email:""}])
            getGroupsImIn()
        }
    }
    const createGroup = async()=>{
        if(createGroupInput.group_name!=""){
            await fetch("http://localhost:8000/create_group/",{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                credentials: 'include',
                body: JSON.stringify(createGroupInput)
            }).then(response =>{
                if(response.ok){
                    return response.json()
                }
            }).catch(err => console.log(err))
            resetState()
            getMyGroups()
        }else{
            document.getElementById("ErrorLbl").innerHTML = "Group Must Have Name"
        }
    }
    const updateGroup = async()=>{
        if(createGroupInput.group_name!=""){
            await fetch("http://localhost:8000/edit_group_name/",{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                credentials: 'include',
                body: JSON.stringify({"group_name":createGroupInput.group_name, "g_id":selectedRow[0].Group_Id})
            }).then(response =>{
                if(response.ok){
                    return response.json()
                }
            }).catch(err => console.log(err))
            getMyGroups()
        }else{
            document.getElementById("ErrorLbl").innerHTML = "Group Must Have Name"
        }
    }

    const addUserToGroup = async() =>{
        if(addUserInput.email!=""){
            await fetch("http://localhost:8000/add_user_to_group/",{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                credentials: 'include',
                body: JSON.stringify({"group_id":selectedRow[0].Group_Id, "email":addUserInput.email})
            }).then(response =>{
                if(response.ok){
                    return response.json()
                }else{
                    document.getElementById("ErrorLbl").innerHTML = "User Not Found"
                }
            }).catch(err => console.log(err))
            getUserInGroup()
            document.getElementById("uIn").value=""
        }else{
            document.getElementById("ErrorLbl").innerHTML = "Enter a Valid Email"
        }
    }
    const removeUserFromGroup = async() =>{
        if(selectedUser!=null){
            await fetch("http://localhost:8000/remove_user_from_group/",{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                credentials: 'include',
                body: JSON.stringify({"group_id":selectedRow[0].Group_Id, "email":selectedUser})
            }).then(response =>{
                if(response.ok){
                    return response.json()
                }
            }).catch(err => console.log(err))
            getUserInGroup()
        }
    }

    const onRefresh = () =>{
        setIsEdit(false); 
        setCreateGroupInput({["group_name"]:""}); 
        document.getElementById("uIn").value=""
        getMyGroups()
        
    }

    const updateAddUser =(event) =>{
        setAddUserInput({...addUserInput, ["email"]:event.target.value})
    }

    const updateNewGroupName = (event) =>{
        setCreateGroupInput({...createGroupInput, ["group_name"]:event.target.value})
    }

    const resetState = () =>{
        document.getElementById("uIn").value=""
        setIsEdit(false)
        setIsCreating(false)
        setSelectedUser()
        setAddUserInput({["email"]:""})
        setCreateGroupInput({["group_name"]:""})
    }

  return (
    <div classname='MainPageBackground'>
        <div className = "MainPageContainer">
            <MainNavBar/>
            <div className = 'ManageGroupGrid'>
                <div className = "MyGroupsGridItem">
                    <div className="InternalContainer">
                        <label className="GroupTitleLabel">My Groups</label>
                        <DataGrid
                            columns={myGroupColumns}
                            rows={MyGroupsData}
                            getRowId={(row)=>row.Group_Id}
                            onRowSelectionModelChange={(id)=>{
                                const selectedRowData = MyGroupsData.filter((row)=>
                                row["Group_Id"]==id
                                )
                                setSelectedRow(selectedRowData)
                                setIsOwner(true)
                                resetState()
                            }}
                            MyGroupsData={MyGroupsData}
                            {...MyGroupsData}
                        />
                    </div>
                </div>
                <div className ="partOfGroupsColumns">
                    <div className="InternalContainer">
                        <label className="GroupTitleLabel">Groups I'm In</label>
                        <DataGrid
                            columns={partOfGroupsColumns}
                            rows={groupsInData}
                            getRowId={(row)=>row.Group_Id}
                            onRowSelectionModelChange={(id)=>{
                                const selectedRowData = groupsInData.filter((row)=>
                                row["Group_Id"]==id
                                )
                                console.log("selected row data: " + selectedRowData)
                                setSelectedRow(selectedRowData)
                                setIsOwner(false)
                                resetState()
                            }}
                            groupsInData={groupsInData}
                            {...groupsInData}
                            
                        />
                    </div>
                </div>
                <div className = "GroupInfoGridItem">
                    <div className="Container">
                        <div className="GroupDataContainer">
                            <div className="CreateGroupContainer">
                                {isCreating? 
                                    <div className="CreatingGroup">
                                        <input onChange={updateNewGroupName} className="GroupNameInput"></input>
                                        <button className="CreatingButton" onClick={createGroup}>
                                            Save
                                        </button>
                                        <button className="CreatingButton" onClick = {()=>{setIsCreating(false); setCreateGroupInput({["group_name"]:""})}}>
                                            Cancel
                                        </button>
                                    </div>
                                    : isEdit? 
                                    <div className="CreatingGroup">
                                        <input onChange={updateNewGroupName} className="GroupNameInput" defaultValue={selectedRow[0].Group_Name}></input>
                                        <button className="CreatingButton" onClick={updateGroup}>
                                            Change Name
                                        </button>
                                        <button className="CreatingButton" onClick = {onRefresh}>
                                            Exit Edit
                                        </button>
                                    </div> 
                                :<label className="GroupDataLabel" id="nameLbl">{selectedRow[0] ? selectedRow[0].Group_Name=="" ?  "Group Data": selectedRow[0].Group_Name : "Group Data"}</label>
                                }
                                
                            </div>
                            <DataGrid
                                columns={groupDataColumns}
                                rows={groupData?groupData:""}
                                getRowId={(row)=>row.Email}
                                onRowSelectionModelChange={(id)=>{
                                    setSelectedUser(id[0])
                                }}
                            />
                        </div>
                        <div className="ButtonContainer2">
                            <div className="MainButtonContainer">
                                <button className="MainActionButton" disabled={!isOwner} onClick={()=>setIsEdit(true)}>
                                    Edit
                                </button>
                                {isOwner? <button className="MainActionButton" onClick={deleteGroup}>Delete Group</button>:<button className="MainActionButton" onClick={leaveGroup}>Leave Group</button>}
                                <button className="MainActionButton" onClick={()=>setIsCreating(true)}>
                                    Create Group
                                </button>
                            </div>
                            <div className="AddContainer">
                                <label className="AddUserLabel" >Add User By Email</label>
                            </div>
                            <div className="InputContainer">
                                <input disabled={!isOwner || !isEdit} onChange={updateAddUser} className="AddName" defaultValue={""} id="uIn"></input>  
                            </div>
                            <div className="SubInputContainer">
                                <button className="SubActionButton" disabled={!isOwner  || !isEdit} onClick={addUserToGroup}>
                                    Add User
                                </button>
                                <button className="SubActionButton" disabled={!isOwner  || !isEdit} onClick={removeUserFromGroup}>
                                    Remove User
                                </button>
                            </div>
                            <div className="ErrorLabelContainer">
                                <label className="GroupErrorLabel" id="ErrorLbl"></label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ManageGroups