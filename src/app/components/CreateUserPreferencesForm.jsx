import React, { useState, useCallback, useMemo } from "react";
import { useEffect, useRef } from 'react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import "../aggrid.css";
import { Preferences } from "./Preferences";
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { CreateUserPreferences } from "./CreateUserPreferences";

const axios = require('axios');

export const CreateUserPreferencesForm = (props) => {
    const [rowData, setRowData] = useState([]);
    const [skeleton, setSkeleton] = useState(
        <>
            <br></br>
            <Stack spacing={1.5}>
                <Skeleton variant="rectangular" height={118} sx={{ bgcolor: "grey.900" }} />
                <Skeleton variant="text" sx={{ bgcolor: "grey.900" }} />
                <Skeleton variant="text" sx={{ bgcolor: "grey.900" }} width="60%" />
            </Stack>
        </>
    );

    useEffect(() => {
        console.log(props.airline)
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
                props.setUserPreferences(data)
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
                    <CreateUserPreferences rowData={rowData} airline={props.airline} setUserPreferences={props.setUserPreferences} />
                    :
                    <></>
            }
        </div>
    );
};


