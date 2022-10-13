import React, { useState, useCallback, useMemo } from "react";
import { useEffect, useRef } from 'react';


import 'ag-grid-community/dist/styles/ag-grid.css';
import "../aggrid.css";
import { FlightProgress } from "./FlightProgress";
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { CreateFlightProgress } from "./CreateFlightProgress";

const axios = require('axios');

export const CreateFlightProgressForm = (props) => {
    const [rowData, setRowData] = useState([]);
    const [skeleton, setSkeleton] = useState(
        <>
            <br></br>
            <Stack spacing={1.5}>
                <Skeleton variant="text" sx={{ bgcolor: "grey.900" }} />
                <Skeleton variant="text" sx={{ bgcolor: "grey.900" }} width="60%" />
            </Stack>
        </>
    );

    useEffect(() => {
        getPreferences();
    }, [props.airline])


    const getPreferences = async () => {

        const headers = new Headers();

        const options = {
            method: "GET",
            headers: headers
        };

        const code = process.env.REACT_APP_FUNCTION_USER_PREFERENCES_GET_CODE;
        fetch(`${process.env.REACT_APP_FUNCTION_USER_PREFERENCES_GET_URI}?code=${code}&airline=${props.airline}`, options)
            .then(response => response.json())
            .then(data => {
                if (props.airline == "airline-fda") {
                    data.forEach((preference) => {
                        if (preference.userKey == "saveFlightProgressTablesValues") {
                            preference.value = "false";
                        }
                    })
                }
                setRowData(data);
                props.setFlightProgress(data)
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
                    <CreateFlightProgress rowData={rowData} airline={props.airline} setFlightProgress={props.setFlightProgress} manualSelect={props.manualSelect} disabled={props.disabled} />
                    :
                    <></>
            }
        </div>
    );
};


