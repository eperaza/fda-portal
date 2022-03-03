import React, { useState, useCallback, useMemo } from "react";
import { useEffect, useRef } from 'react';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Alert from 'react-bootstrap/Alert';
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Spinner from 'react-bootstrap/Spinner'
import { AccordionFDR } from "./Accordion";
import { ProgressBar } from 'react-bootstrap';
import { SwitchToggle } from "../users/SwitchToggle.jsx";

import 'ag-grid-community/dist/styles/ag-grid.css';
import "../aggrid.css";

const axios = require('axios');

export const ListFDR = (props) => {
    const [rowData, setRowData] = useState([]);
    
    useEffect(() => {
        getFDR();
    }, [])


    const getFDR = async () => {

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

            <div className="row">
                <div className="col-sm-12 grid-margin stretch-card">
                    <div className="card">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-12 grid-margin">
                                    <div className="row">
                                        <div className="col-md-9">
                                            <h4 className="card-title">Aircraft Tails</h4>

                                        </div>
                                        <div className="col-md-3">
                                            <div class="input-group">
                                                

                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div className="col-12 grid-margin">
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="row">
                                            <p className="card-description"> Airline <code>{props.airline.toUpperCase()}</code></p>
                                        </div>
                                    </div>
                                    <div className="col-md-4 align-self-center d-flex align-items-center justify-content-center">
                                        <div className="row">
                                        </div>
                                    </div>
                                    <div className="col-md-4">

                                    </div>
                                </div>
                            </div>

                            {
                                rowData
                                    ?
                                    <AccordionFDR rowData={rowData}></AccordionFDR>
                                    :
                                    <></>
                            }


                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


