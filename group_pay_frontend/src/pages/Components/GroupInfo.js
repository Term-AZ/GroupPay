import React from 'react'
import './PaymentInfo.css'
import { Chart } from "react-google-charts";
import {useState,useEffect} from 'react';


const GroupInfo = (props) =>{

    // const [PaymentData, setPaymentData] = useState([])

    // var t = [["Name","Owned"],]
    // for(let i=0; i<PaymentData.length;i++){
    //     t.push([PaymentData[i]["User_Name"],PaymentData[i]["Amount_Owned"]])
    // }


    // useEffect(()=>{
    //     getData()

    // },[props])

    // const getData = async() =>{
    //     await fetch('http://localhost:8000/get_payment/',{
    //         method:"POST",
    //         headers:{"Content-Type":"application/json"},
    //         credentials: 'include',
    //         body: JSON.stringify({"transaction_id": props.selectedRow? props.selectedRow : ""})
    //     }).then(response =>{
    //         if(response.ok){
    //             return response.json()
    //         }
    //     }).then(data=> {setPaymentData(data)}).catch(err=>console.log(err))
    // }

    // const options = {
    //     title: "Percent Owned",
    // }
    
    // //   const dt = props.paymentData.map((data)=> [
    // //     data["User_Name"], data["Amount_Owned"]
    // //   ])

    // return(
    //     <div className='MPInfoContainer'>
    //         <p className='PaymentTitle'>{props.paymentInfo["Transaction_Name"] || ""}</p>
    //         <div className='PieGraph'>
    //             {/* {console.log({PaymentData})} */}
    //             <Chart
    //                 chartType="PieChart"
    //                 data={t}
    //                 options={options}
    //                 width={"100%"}
    //                 height={"400px"}
    //             />
    //         </div>
    //         <div className='WhoToPayContainer'>
    //             <div className='WhoToPayNameContainer'>
    //                 {/* {console.log("chart data: " +props.chartData)} */}
    //                 {/* {console.log("manual data: " +data)} */}
    //                 <p className ='WhoToPay'>{props.paymentInfo["PayTo"]|| ""}</p>
    //             </div>
    //             <div className='IsPaidContainer'>
    //                 <button className='PaidButton'>{props.paymentInfo["Status"]? "Complete" : "Incomplete" || ""}</button>
    //             </div>
    //         </div> 
    //         <div className="PayeeContainer">
    //             <p className='Payees'>Payees</p>
    //         </div>
    //         <div className='TransactionTableContainer'>
    //             <table className='PayeeTable'>
    //                     <tr>
    //                         <th className='PayeeTableHeader'>
    //                             Name
    //                         </th>
    //                         <th className='PayeeTableHeader'>
    //                             Amount Owned
    //                         </th>
    //                         <th className='PayeeTableHeader'>
    //                             Paid?
    //                         </th>
    //                     </tr>   
    //                     {PaymentData.map(data => 
    //                         <tr>
    //                             <td className='MPTableItem'>{data["User_Name"]}</td>
    //                             <td className='MPTableItem'>{data["Amount_Owned"]}</td>
    //                             <td className='MPTableItem'>{data["Status"]? "Paid" : "Not Paid"}</td>
    //                         </tr>
    //                     )} 
                        
    //                     {/* {PaymentData.map(data => 
    //                         <tr>
    //                             <td className='MPTableItem'>{data["User_Name"]}</td>
    //                             <td className='MPTableItem'>{data["Amount_Owned"]}</td>
    //                             <td className='MPTableItem'>{data["Status"]? "Paid" : "Not Paid"}</td>
    //                         </tr>
    //                     )} */}
    //             </table>
    //         </div>
    //     </div>
    // )
}

export default GroupInfo