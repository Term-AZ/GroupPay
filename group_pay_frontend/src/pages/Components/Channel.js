import React from 'react';
export const Channel = ({data}) =>{
    return(
        <div>
            <h1>{data[0][0]}</h1>
            <h1>{data[1][1]}</h1>

            {/* <h1>{data.UserId}</h1>
            <h1>{data.User_Name}</h1>
            <h1>{data.Email}</h1>
            <h1>{data.User_Password}</h1>
            <h1>{data.Date_Joined}</h1> */}
        </div>
    )
}