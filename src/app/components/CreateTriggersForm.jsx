import React, { useState, useCallback, useMemo } from "react";
import { useEffect, useRef } from 'react';
import { Tails } from "./Tails"


import 'ag-grid-community/dist/styles/ag-grid.css';
import "../aggrid.css";
import { Triggers } from "./Triggers";
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { CreateTriggers } from "./CreateTriggers";

const axios = require('axios');

export const CreateTriggersForm = (props) => {
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
    }, [props.airline])


    const getPreferences = async () => {

        const headers = new Headers();

        const options = {
            method: "GET",
            headers: headers
        };

        console.log(props.airline.toUpperCase())
        const code = process.env.REACT_APP_FUNCTION_USER_PREFERENCES_GET_CODE;
        fetch(`${process.env.REACT_APP_FUNCTION_USER_PREFERENCES_GET_URI}?code=${code}&airline=${props.airline.replace("airline-","")}`, options)
            .then(response => response.json())
            .then(data => {
                setRowData(data);
                props.setTriggers(data);
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
                    <CreateTriggers rowData={rowData} airline={props.airline} setTriggers={props.setTriggers}/>
                    :
                    <></>
            }
        </div>
    );
};


