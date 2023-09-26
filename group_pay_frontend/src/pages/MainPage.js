import React from 'react';
import './MainPage.css'
import MainNavBar from './Components/MainNavBar';
import ListView from './Components/ListView';
import { Chart } from "react-google-charts";
import {useState,useEffect} from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';


const MainPage = () =>{
    const [MyPayments, setMyPayments] = useState([])
    const [GroupPayments, setGroupPayments] = useState([])
    const [GraphData, setGraphData] = useState([])
    const navigate = useNavigate()

    useEffect(()=>{
        getPaymentData()
        getGroupPaymentData()
        getGraphData()
    },[])

    const getPaymentData = async()=>{
        await fetch("http://localhost:8000/get_last_30_days_payments/",{
            method:"GET",
            headers:{"Content-Type":"application/json"},
            credentials: 'include',
        }).then(response =>{
            if(response.ok){
                return response.json()
            }else{
                navigate("/login")
            }
        }).then(data=>setMyPayments(data)).catch(err => console.log(err))
    }
    const getGroupPaymentData = async()=>{
        await fetch("http://localhost:8000/get_my_recent_payments_to_make/",{
            method:"GET",
            headers:{"Content-Type":"application/json"},
            credentials: 'include',
        }).then(response =>{
            if(response.ok){
                return response.json()
            }else{
                navigate("/login")
            }
        }).then(data=>setGroupPayments(data)).catch(err => console.log(err))
    }

    const getGraphData = async()=>{
        await fetch("http://localhost:8000/get_graph_data/",{
            method:"GET",
            headers:{"Content-Type":"application/json"},
            credentials: 'include',
        }).then(response =>{
            if(response.ok){
                return response.json()
            }else{
                navigate("/login")
            }
        }).then(data=>setGraphData(data)).catch(err => console.log(err))
    }

    const lpColumns = [
        {field:'Transaction_Name', headerName:'Transaction_Name', width:400},
        {field:'Group_Name', headerName:'Group', width:200},
        {field:'Status', headerName:'Status', width:150},
    ]
    const pToMColumns = [
        {field:'Transaction_Name', headerName:'Transaction_Name', width:400},
        {field:'Group_Name', headerName:'Group', width:200},
        {field:'Amount_Owned', headerName:'Amount Owned', width:150},
    ]

    const options ={
        title: "Last Months Spending",
        subtitle: "in $",  
        legend: {position: 'none'}   
    }


    var l = {}
    try{
        for(var i=29; i>=0;i--){
            l[String(getNextDate(i))] = 0
        }
        GraphData.map(row => {    
            l[row["Date_Payed"]] = row["DaySum"]})

        var d = [["Day" , "Spent"],]
        Object.keys(l).map((key,index)=>{
            d.push([key,l[key]])
        })
    }catch(e){
        console.log(e)
    }

    function getNextDate(increment){
        var date = new Date()
        date.setDate(date.getDate()-increment)
        return date.getFullYear()+'-'+('0'+ (date.getMonth()+1)).slice(-2)+'-'+ ((date.getDate()<10 ? '0':"") + date.getDate());
    }

    return(
        <div className='MainPageBackground'>
            <div className = 'MainPageContainer'>
                <MainNavBar/>
                <div className = 'MainInfoContainer'>
                    <div className = 'GraphContainer'>
                        <p className="HomeTitle">Last Months Payments</p>
                        <div className = 'Graph'> 
                            <Chart
                                options = {options}
                                data={d? d : [["Day" , "Spent"],]}
                                chartType='Bar'
                                width="100%"
                                height="100%"
                            />
                        </div>
                    </div>
                    <div className = 'ListBoxMainContainer'> 
                        <div className='ListBoxSubContainer'>
                            <label>Latest Payments</label>
                            <DataGrid
                                columns={lpColumns}
                                rows ={MyPayments}
                                getRowId={(row)=>row.Transaction_Id}
                                disableRowSelectionOnClick
                                {...MyPayments}
                            />
                        </div>
                        <div className='ListBoxSubContainer'>
                            <label>Payments to Make</label>
                            <DataGrid
                                    columns={pToMColumns}
                                    rows ={GroupPayments}
                                    getRowId={(row)=>row.Transaction_Id}
                                    disableRowSelectionOnClick
                                    {...MyPayments}
                                />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MainPage;