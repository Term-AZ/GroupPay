import React from 'react'
import './PaymentInfo.css'
import { Chart } from "react-google-charts";
import {useState,useEffect} from 'react';
import MyPayments from '../MyPayments';


const PaymentInfo = (props) =>{

    const [PaymentData, setPaymentData] = useState([])
    const [IsEdit, setIsEdit] = useState(false)
    const [BackUpValue, setBackUpValues] = useState([])
    const [NewTransactionName, setNewTransactionName] = useState({
        tName:"",
    })
    const [didPay,setDidPay] = useState(false)

    var t = [["Name","Owned"],]
    try{
        for(let i=0; i<PaymentData.length;i++){
            t.push([PaymentData[i]["User_Name"],PaymentData[i]["Amount_Owned"]])
        }
    }catch{}

    useEffect(()=>{
        getData()
        setIsEdit(false)
        checkStatus()
    },[props])

    const getData = async() =>{
        await fetch('http://localhost:8000/get_payment/',{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            credentials: 'include',
            body: JSON.stringify({"transaction_id": props.paymentInfo.Transaction_Id ? props.paymentInfo.Transaction_Id : ""})
        }).then(response =>{
            if(response.ok){
                return response.json()
            }
        }).then(data=> {setPaymentData(data); setBackUpValues(data); setNewTransactionName({["tName"]:props.paymentInfo.Transaction_Name})}).catch(err=>console.log(err))
    }

    const checkStatus = async() =>{ 
        if(!props.editable){
            await fetch('http://localhost:8000/get_transaction_user_status/',{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                credentials: 'include',
                body: JSON.stringify({"transaction_id": props.paymentInfo.Transaction_Id ? props.paymentInfo.Transaction_Id : ""})
            }).then(response =>{
                if(response.ok){
                    return response.json()
                    
                }
            }).then(data=>setDidPay(data[0]["Status"])).catch((err)=>console.log(err))
        }
    }

    const onSave = async() =>{
        setIsEdit(false)
        await fetch('http://localhost:8000/update_transaction/',{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            credentials: 'include',
            body: JSON.stringify({"transaction_id":props.paymentInfo.Transaction_Id, "transaction_name": NewTransactionName["tName"],"transaction": PaymentData})
        }).then(response =>{
            if(response.ok){
                return response.json()
            }
        }).then(data=> {setPaymentData(data)}).catch(err=>console.log(err))
        getData()
    }
    const upDatePaymentStatus = async()=>{
        await fetch('http://localhost:8000/update_transaction_status/',{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            credentials: 'include',
            body: JSON.stringify({"transaction_id":props.paymentInfo.Transaction_Id})
        }).then(response =>{
            if(response.ok){
                return response.json()
            }
        }).then(data=> {setPaymentData(data)}).catch(err=>console.log(err))
        getData()
    }

    const onCancel = () => {
        setIsEdit(false)
        setPaymentData(BackUpValue)
    }

    const onTransactionNameChange = (event) =>{
        setNewTransactionName([...NewTransactionName, [event.target.name]=event.target.value])
    }

    const onValueChange = (event) =>{
        setPaymentData(PaymentData.map(p =>{
            if(p["Email"] === event.target.id){
                return {...p, Amount_Owned: parseInt(event.target.value)}
            }else{
                return p
            }
        }))
    }

    const options = {
        title: "Percent Owned",
    }
    
    return(
        <div className='MPInfoContainer'>
            {IsEdit ? <input name="tName" onChange={onTransactionNameChange} value={props.paymentInfo.Transaction_Name || ""}></input>: <p className='PaymentTitle'>{props.paymentInfo.Transaction_Name || ""}</p>}
            <div className='PieGraph'>
                <Chart
                    chartType="PieChart"
                    data={t}
                    options={options}
                    width={"100%"}
                    height={"100%"}
                />
            </div>
            <div className='WhoToPayContainer'>
                <div className='WhoToPayNameContainer'>
                    <p className ='WhoToPay'>{props.paymentInfo.PayTo|| ""}</p>
                </div>
                <div className='IsPaidContainer'>
                {/* <button className='PaidButton' onClick={upDatePaymentStatus}>{CanEdit? <div></div> : <div>ttttt</div>}</button>} */}
                {console.log("did pay? "+didPay)}
                    {props.paymentInfo.Status=="Complete" ? <label>Complete</label> : props.editable ? <div></div> : !didPay? <div> Paid </div>: <button className="PaidButton" onClick={upDatePaymentStatus}>Pay</button>}
                    {/* <button className='PaidButton'>{props.paymentInfo.Status=="Complete" ? "Complete" : "Incomplete" || ""}</button> */}
                </div>
            </div> 
            <div className="PayeeContainer">
                <p className='Payees'>Payees</p>
            </div>
            <div className='TransactionTableContainer'>
                <table className='PayeeTable'>
                        <tr>
                            <th className='PayeeTableHeader'>
                                Name
                            </th>
                            <th className='PayeeTableHeader'>
                                Amount Owned
                            </th>
                            <th className='PayeeTableHeader'>
                                Paid?
                            </th>
                        </tr>   
                        {PaymentData ? PaymentData.map(data => {
                            // setUpdateValues({...UpdateValues, [data["Email"]]: data["Amount_Owned"]})
                            return(
                                <tr>
                                    <td className='MPTableItem'>{data["User_Name"]}</td>
                                    <td className='MPTableItem'>{IsEdit ? <input name={data["Email"]} onChange={onValueChange} defaultValue={data["Amount_Owned"]} id={data["Email"]}></input> : data["Amount_Owned"]}</td>
                                    {/* <td className='MPTableItem'>{IsEdit ? <input name={"Amount_Owned"} onChange={onValueChange} defaultValue={PaymentData[index]["Amount_Owned"]} id={index++}></input> : data["Amount_Owned"]}</td> */}
                                    <td className='MPTableItem'>{data["Status"]? "Paid" : "Not Paid"}</td>
                                    {/* <td className='MPTableItem'>{CanEdit? <div/> : <label></label> }</td> */}
                                </tr> 
                            )}) : <div></div>} 
                </table>
            </div>
            {props.editable? IsEdit ?<button onClick={onSave}>Save</button> :<button className="PaymentInfoEditButton" onClick={()=>setIsEdit(true)}>Edit</button> :<div/>}
            {IsEdit ?<button onClick={onCancel}>Cancel</button> :<div/>}
        </div>
    )
}

export default PaymentInfo