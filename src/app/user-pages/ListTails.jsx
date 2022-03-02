import React, { useState, useCallback, useMemo } from "react";
import { useEffect, useRef } from 'react';
import { Tails } from "./Tails"


import 'ag-grid-community/dist/styles/ag-grid.css';
import "../aggrid.css";

const axios = require('axios');

export const ListTails = (props) => {
    const [rowData, setRowData] = useState([]);

    useEffect(() => {
        getTails();
    }, [])


    const getTails = async () => {

        const headers = new Headers();

        const options = {
            method: "GET",
            headers: headers
        };

        console.log(props.airline.toUpperCase())
        const code = "rFbNmcU3UYhSKS8awX7vIs5YgvmEF5cQHNWdR9YMAaSHIV3CUTENTw==";
        //fetch(`${process.env.REACT_APP_FDR_GET_URI}?airline=${props.airline.toUpperCase()}`, options)
        //fetch(`${process.env.REACT_APP_FDR_GET_URI}?airline=TAV`, options)
        fetch(`https://functionfdatspdev.azurewebsites.net/api/FlightDataRecordingList?code=${code}&airlineId=${props.airline.toUpperCase()}`, options)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setRowData(data);
            }
            )
            .catch(error => console.log('error', error));
    }

    return (
        <div>
            {
                rowData
                    ?
                    <Tails rowData={rowData}></Tails>
                    :
                    <></>
            }
        </div>
    );
};


