import React from 'react';
import "./ListView.css";
import {useState,useEffect} from 'react';

const ListView = (props) =>{
    // const [MyPayments, setPayments] = useState([])

    // useEffect(()=>{
    //     getData()
    // },[])

    // const getData = async()=>{
    //     await fetch(props.URL,{
    //         method:"GET",
    //         headers:{"Content-Type":"application/json"},
    //         credentials: 'include',
    //     }).then(response =>{
    //         if(response.ok){
    //             return response.json()
    //         }
    //     }).then(data=>setPayments(data)).catch(err => console.log(err))
    // }

    return(
        <div>
            <div className = 'Container'>
                {props.title}
            <div className='ListContainer'>
                <table>
                    <tbody>
                    <tr>
                        <th className='TableHeader'>
                            Payment Title
                        </th>
                        <th className='TableHeader'>
                            Total Price
                        </th>
                        <th className='TableHeader'>
                            How Many Paid
                        </th>
                    </tr>
                    {props.data.map(p=>{
                        return(
                            <tr >
                                <td className='GPTableItem'>{p[props.ColumnNames["c1"]]}</td>
                                <td className='GPTableItem'>{p[props.ColumnNames["c2"]]}</td>
                                <td className='GPTableItem'>{props.ColumnNames["c3"]==="Status"? p[props.ColumnNames["c3"]] ? "Complete": "Incomplete": p[props.ColumnNames["c3"]]}</td>
                                {/* <td className='GPTableItem'>{p[props.ColumnNames["c3"]]}</td> */}
                            </tr>
                        )
                    })}

                    {/* {MyPayments.map(p=>{
                        return(
                            <tr >
                                <td className='GPTableItem'>{p[props.ColumnNames["c1"]]}</td>
                                <td className='GPTableItem'>{p[props.ColumnNames["c2"]]}</td>
                                <td className='GPTableItem'>{p[props.ColumnNames["c3"]]}</td>
                            </tr>
                        )
                    })} */}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    )
}

export default ListView;