import React, { useState, useCallback, useMemo } from "react";
import { useEffect, useRef } from 'react';
import { Tails } from "./Tails"


import 'ag-grid-community/dist/styles/ag-grid.css';
import "../aggrid.css";
import { Triggers } from "./Triggers";
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

const axios = require('axios');

export const ListTriggers = (props) => {
    const [rowData, setRowData] = useState([]);
    const [skeleton, setSkeleton] = useState(<>
        <br></br>
        <Stack spacing={1.5}>
          <Skeleton variant="rectangular"  height={118} sx={{ bgcolor: "grey.900" }} />
          <Skeleton variant="text" sx={{ bgcolor: "grey.900" }}/>
          <Skeleton variant="text" sx={{ bgcolor: "grey.900" }}/>
          <Skeleton variant="text" sx={{ bgcolor: "grey.900" }}/>
          <Skeleton variant="text" sx={{ bgcolor: "grey.900" }}/>
          <Skeleton variant="text" sx={{ bgcolor: "grey.900" }} width="60%"/>
          <Skeleton variant="text" sx={{ bgcolor: "grey.900" }} width="60%"/>
        </Stack>
        </>);

    useEffect(() => {
        getPreferences();
    }, [])


    const getPreferences = async () => {

        const headers = new Headers();

        const options = {
            method: "GET",
            headers: headers
        };

        console.log(props.airline.toUpperCase())
        const code = process.env.REACT_APP_FUNCTION_USER_PREFERENCES_GET_CODE;
        fetch(`${process.env.REACT_APP_FUNCTION_USER_PREFERENCES_GET_URI}?code=${code}&airline=airline-${props.airline}`, options)
            .then(response => response.json())
            .then(data => {
                setRowData(data);
                setSkeleton();
            }
            )
            .catch(error => console.log('error', error));
    }

    return (
        <div>
            {skeleton}
            {
                rowData
                    ?
                    <Triggers rowData={rowData} airline={props.airline}></Triggers>
                    :
                    <></>
            }
        </div>
    );
};


