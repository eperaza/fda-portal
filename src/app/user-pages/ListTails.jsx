import React, { useState, useCallback, useMemo } from "react";
import { useEffect, useRef } from 'react';
import { Tails } from "./Tails"
import Skeleton from '@mui/material/Skeleton';
import 'ag-grid-community/dist/styles/ag-grid.css';
import "../aggrid.css";
import Stack from '@mui/material/Stack';

const axios = require('axios');

export const ListTails = (props) => {
    const [rowData, setRowData] = useState([]);
    const [loader, setLoader] = useState(<>
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
        getTails();
    }, [])


    const getTails = async () => {

        const headers = new Headers();

        const options = {
            method: "GET",
            headers: headers
        };

        console.log(props.airline.toUpperCase())
        const code = process.env.REACT_APP_FUNCTION_LIST_FDR_CODE;
         fetch(`${process.env.REACT_APP_FUNCTION_LIST_FDR_URI}?code=${code}&airlineId=${props.airline.toUpperCase()}&monthSpan=1`, options)
            .then(response => response.json())
            .then(data => {
                setRowData(data);
                setLoader();
            }
            )
            .catch(error => console.log('error', error));
    }

    return (
        <div>
            {loader}
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


