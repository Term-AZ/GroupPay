import React from 'react'
import ListView from './Components/ListView';
import MainNavBar from './Components/MainNavBar';
import PaymentInfo from './Components/PaymentInfo';
import "./MyPayments.css"
import {Link, Navigate, useNavigate} from 'react-router-dom'
import {useState,useEffect} from 'react';
import { DataGrid } from '@mui/x-data-grid';


const MyPayments = () =>{
    const [MyPayments, setPayments] = useState([])
    const [SelectedRow, setSelectedRow] = useState()
    const [RowData, setRowData] = useState([])
    const backup = {
        "Transaction_Name" : "",
        "PayTo" : "",
        "Status" : 0,
    }
    const columns = [
        {field:'Transaction_Name', headerName:'Transaction_Name', width:350},
        {field:'Group_Name', headerName:'Group', width:275},
        {field:'Status', headerName:'Status', width:120},
    ]
    const navigate = useNavigate()

    useEffect(()=>{
        getPayments()
    },[])

    const getPayments = async() =>{
        fetch("http://localhost:8000/my_payments/",{
            method:"GET",
            headers:{"Content-Type":"application/json"},
            credentials: 'include'
        }).then(response =>{
            if(response.ok){
                return response.json()
            }else{
                navigate("/login")
            }
        }).then(data=>setPayments(data)).catch(err => console.log(err))
    }

    // const onTableClick = async(event) =>{
    //     if(SelectedRow == undefined ){
    //         setSelectedRow(event.currentTarget.attributes.getNamedItem('id').value)
    //         event.currentTarget.style.backgroundColor = "rgb(83, 133, 177)"
    //         return
    //     }
    //     document.getElementById(SelectedRow).style.backgroundColor = "transparent"
    //     setSelectedRow(event.currentTarget.attributes.getNamedItem('id').value)
    //     event.currentTarget.style.backgroundColor = "rgb(83, 133, 177)"
    // }

    const deleteTransaction = async()=>{
        await fetch("http://localhost:8000/delete_payment",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            credentials: 'include',
            body: JSON.stringify({"transaction_id":RowData[0].Transaction_Id})
        }).then(response=>{
            if(response.ok){
                return response.json()
            }
        }).catch(err=>console.log(err))
        setSelectedRow()
        getPayments()
    }
    return(
        <div className='MainPageBackground'>
            <div className = 'MainPageContainer'>
                <MainNavBar/>
                <div className = 'MainMyPaymentsGrid'>
                    <p className='TitleItem'>MY PAYMENTS</p>
                    <div className='ButtonContainer'>
                        <button className="MPButton"><Link to="/add_transaction" style={{color: 'black'}}>Add Payment</Link></button>
                        {/* <button className="MPButton"><Link to="/edit_groups" style={{ color: 'black' }}>Edit Transaction</Link></button> */}
                        <button className="MPButton" onClick={deleteTransaction} >Delete Payment</button>
                    </div>
                    <div className='TableContainer'>
                        <DataGrid
                            columns={columns}
                            rows={MyPayments? MyPayments : {Transaction_Id:0,Transaction_Name:"",}}
                            getRowId={(row)=>row.Transaction_Id}
                            onRowSelectionModelChange={(ids)=>{
                                const selectedRowData = MyPayments.filter((row)=>
                                    row["Transaction_Id"]==ids
                                )
                                setRowData(selectedRowData)
                            }}
                            RowData={RowData}
                            {...MyPayments}
                        />
                    </div>
                    <PaymentInfo paymentInfo ={RowData[0] ? RowData[0] : backup} editable={true}/>
                </div>
            </div>
        </div>
    );
}

export default MyPayments


// <div className= 'SubMyPaymentsContainer'>
//                         <p className='MPTitle'>MY PAYMENTS</p>
//                         <div className ='ButtonContainer'>
//                             <button className="MPButton">Add Payment</button>
//                             <button className="MPButton">Edit Payment</button>
//                             <button className="MPButton">Delete Payment</button>
//                         </div>
//                         <div className='TableContainer'>

//                         </div>
//                     </div>
//                     <div className= 'SubMyPaymentsContainer'>
                        
//                         <div className='MPInfoContainer'>

//                         </div>
//                     </div>