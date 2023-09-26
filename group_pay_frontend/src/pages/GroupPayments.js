import React from 'react'
import ListView from './Components/ListView';
import MainNavBar from './Components/MainNavBar';
import "./MyPayments.css"
import "./GroupPayments.css"
import PaymentInfo from './Components/PaymentInfo';
import {useState,useEffect} from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';



const GroupPayments = () =>{
    const [GroupPayment, setGroupPayments] = useState([])
    const [RowData, setRowData] = useState([])

    const navigate = useNavigate()

    const backup = {
        "Transaction_Name" : "",
        "PayTo" : "",
        "Status" : 0,
    }
    const columns = [
        {field:'Transaction_Name', headerName:'Transaction_Name', width:200},
        {field:'User_Name', headerName:'Original Author', width:150},
        {field:'Group_Name', headerName:'Group', width:150},
        {field:'Amount_Owned', headerName:'Amount Owned', width:200},
        {field:'Status', headerName:'Status', width:100},
    ]


    useEffect(()=>{
        getPayments()
    },[])

    const getPayments= async()=>{
        fetch("http://localhost:8000/get_group_payments/",{
            method:"GET",
            headers:{"Content-Type":"application/json"},
            credentials: 'include'
        }).then(response =>{
            if(response.ok){
                return response.json()
            }else{
                navigate("/login")
            }
        }).then(data=>setGroupPayments(data)).catch(err => console.log(err))
    }

    const leaveTransaction = async() =>{
        await fetch("http://localhost:8000/leave_transactions/",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            credentials: 'include',
            body: JSON.stringify({"transaction_id":RowData[0].Transaction_Id})
        }).then(response =>{
            if(response.ok){
                return response.json()
            }
        }).catch(err => console.log(err))
        getPayments()
        
    }

    return(
        <div className='MainPageBackground'>
            <div className = 'MainPageContainer'>
                <MainNavBar/>
                <div className = 'MainMyPaymentsGrid'>
                    <p className='TitleItem'>GROUP PAYMENTS I AM IN</p>
                    <div className='ButtonContainer'>
                        <button className="MPButton" onClick={leaveTransaction}>Leave Transaction</button>
                    </div>
                    <div className='TableContainer'>
                        <DataGrid
                            columns={columns}
                            rows = {GroupPayment}
                            getRowId={(row)=>row.Transaction_Id}
                            onRowSelectionModelChange={(ids)=>{
                                // console.log("Selected Id: "+ ids)
                                const selectedRowData = GroupPayment.filter((row)=>
                                    row["Transaction_Id"]==ids
                                )
                                setRowData(selectedRowData)
                            }}
                            RowData={RowData}
                            {...GroupPayment}
                        />
                    </div>
                    <PaymentInfo paymentInfo ={RowData[0] ? RowData[0] : backup} editable = {false}/>
                </div>
            </div>
        </div>
    );
}

export default GroupPayments