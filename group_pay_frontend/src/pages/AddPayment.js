import React from 'react'
import './AddPayments.css'
import {Link, Navigate, useNavigate} from 'react-router-dom'
import {useState,useEffect} from 'react';
import { tab } from '@syncfusion/ej2-react-grids';


const AddPayment = () =>{
    const [GroupOptions, setState] = useState([]) //for group drop down
    const [UserInGroup, setUsersInGroup] = useState([])//holds users in group
    const [TransactionName, setTransactionName] = useState({
        transactionName: "",
        transactionEmail:"",
    })
    const navigate = useNavigate()

    var index=0

    useEffect(() =>{
        fetch("http://localhost:8000/get_groups/",{
            method:"GET",
            headers:{"Content-Type":"application/json"},
            credentials: 'include'
        }).then(response =>{
            if(response.ok){
                return response.json()
            }else(
                navigate("/login")
            )
        }).then(data=>setState(data)).catch(err => console.log(err))
    },[])

    const handleGroupChange = async() =>{
        if(document.getElementById("groups").selectedIndex==0){
            return
        }
        let id = document.getElementById("groups").selectedIndex -1
        await fetch("http://localhost:8000/get_users_in_group/",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            credentials: 'include',
            body: JSON.stringify({"group_id": (GroupOptions[id]["Group_Id"])})
        }).then(response =>{
            if(response.ok){
                return response.json()
            }
        }).then(data=>{
            data.map((u)=>u["Total"]=0.00)
            setUsersInGroup(data)
            
        }).catch(err => console.log(err))

    }
    const onFormSubmit = async() =>{
        console.log("UserInGroup: "+JSON.stringify(UserInGroup))
        if(TransactionName.transactionName ==""){
            document.getElementById("successLabel").innerHTML = "Must include transaction name"
            return
        }
        console.log("Name is: "+TransactionName)
        let id = document.getElementById("groups").selectedIndex -1
        await fetch("http://localhost:8000/create_transaction/",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            credentials: 'include',
            body: JSON.stringify({"transaction" : UserInGroup, "transactionName": TransactionName.transactionName , "transactionEmail":TransactionName.transactionEmail , "group_id": GroupOptions[id]["Group_Id"]})
        }).then(response =>{
            if(response.ok){
                document.getElementById("successLabel").innerHTML = "Transaction Created"
                return response.json()
            }
        }).catch(err => console.log(err))
    }
    const onValueChange = event =>{
        try{
            console.log(event.target.value)
            var tempArray = [...UserInGroup]
            tempArray[event.currentTarget.attributes.getNamedItem('name').value]["Total"] = event.target.value
            setUsersInGroup(tempArray)
        }catch(error){
            console.log(error)
        }
    }
    const onTransactioNameChange= event =>{
        setTransactionName({...TransactionName, [event.target.name]: event.target.value})
    }
    const onTransactionEmailChange = event =>{
        setTransactionName({...TransactionName, [event.target.name]:event.target.value})
    }
    return(
        <div className='AddTransactionBackground'>
            <div className='FormContainer'>
                <div className='UseExistingGroupContainer'>
                    <div className='MainForm'>
                        <label className='TransactionTitle'>
                            Transaction Name:
                        </label>
                        <input className='TransactionNameInput' name="transactionName"  onChange={onTransactioNameChange}>
                        </input>
                        <select className='DropDownMenu' name="groups" id="groups" onChange={()=>handleGroupChange()}>
                            <option value='test'>Select Group</option>
                                {GroupOptions.map(groups => 
                                    <option>{groups["Group_Name"]}</option>)}
                        </select>
                    </div>
                </div>
                <div className='UseExistingGroupContainer'>
                    <label className='TransactionTitle'>Email: </label>
                    <input className='TransactionNameInput' name="transactionEmail"  onChange={onTransactionEmailChange}/>
                </div>
                <div className='AddPaymentTable'>
                    <form>
                    <table className='APTable'>
                        <tbody>
                            <tr>
                                <th className='APTableHeader'>
                                    Name
                                </th>
                                <th className='APTableHeader'>
                                    Email
                                </th>
                                <th className='APTableHeader'>
                                    How Much Owned
                                </th>

                            </tr>
                            {UserInGroup? UserInGroup.map((groups) => {
                                return(
                                <tr className='tRow' name={groups["Email"]} id={groups["Email"]} >
                                    <td className='APTableItemName'>
                                        {groups["User_Name"]}
                                    </td>
                                    <td className='APTableItemName'>
                                        {groups["Email"]}
                                    </td>
                                    <td className='APTableItemName'><input className = 'OwnedInput' name={index++} onChange={onValueChange} defaultValue={groups["Total"]}></input></td>
                                </tr>
                                )}): <div/>}
                        </tbody>
                    </table>
                    </form>
                </div>
                <div className='AcceptButtonContainer'>
                    <button className='AcceptButton' onClick={onFormSubmit}> 
                            Accept
                    </button>
                    <label className="SuccessLabel" id="successLabel"></label>
                    <Link to="/manage_groups" style={{ textDecoration: 'white'}} ><p className='CreateGroupLink'>Create Group Instead</p></Link>
                    <Link to="/my_payments" style={{ textDecoration: 'white'}}><p className='CreateGroupLink'>Return to mainpage</p></Link>
                </div>
            </div>  
        </div>
    );
}

export default AddPayment