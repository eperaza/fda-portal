import React, { useState, useCallback, useMemo } from "react";
import { useEffect, useRef } from 'react';
import { Tails } from "./Tails"
import 'ag-grid-community/dist/styles/ag-grid.css';
import "../aggrid.css";
import { Preferences } from "./Preferences";
import { Triggers } from "./Triggers";
import { AirlinePreferences } from "./AirlinePreferences";

const axios = require('axios');

export const ListAirlinePreferences = (props) => {
    const [rowData, setRowData] = useState([]);
    
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
        const code = process.env.REACT_APP_FUNCTION_AIRLINE_PREFERENCES_GET_CODE;
        fetch(`${process.env.REACT_APP_FUNCTION_AIRLINE_PREFERENCES_GET_URI}?code=${code}&airline=airline-${props.airline}`, options)
            .then(response => response.json())
            .then(data => {
                setRowData(data);
            }
            )
            .catch(error => console.log('error', error));
    }

    return (
        <div>
            <div className="row">

                <div className="col-6">
                </div>

                <div className="col-1">
                    EFB Admin
                </div>
                <div className="col-1">
                    Focal
                </div>
                <div className="col-1">
                    Check Airmen
                </div>
                <div className="col-1">
                    Pilot
                </div>
                <div className="col-1">
                    Maint.
                </div>
            </div>
            {
                rowData
                    ?
                    <AirlinePreferences rowData={rowData} airline={props.airline} />
                    :
                    <></>
            }
        </div>
    );
};


