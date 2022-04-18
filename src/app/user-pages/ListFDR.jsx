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
import { SwitchToggle } from "../usermanagement/SwitchToggle.jsx";

import 'ag-grid-community/dist/styles/ag-grid.css';
import "../aggrid.css";
const axios = require('axios');

export const ListFDR = (props) => {
    const [rowData, setRowData] = useState([]);
    const [monthSpan, setMonthSpan] = useState("role-airlinefocal")

    useEffect(() => {
        getFDR();
    }, [])


    const getFDR = async (months) => {

        const headers = new Headers();
        const options = {
            method: "GET",
            headers: headers
        };

        console.log(props.airline.toUpperCase())
        const code = process.env.REACT_APP_FUNCTION_LIST_FDR_CODE;
        fetch(`${process.env.REACT_APP_FUNCTION_LIST_FDR_URI}?code=${code}&airlineId=${props.airline.toUpperCase()}&monthSpan=${months}`, options)
            .then(response => response.json())
            .then(data => {
                setRowData(data);
            }
            )
            .catch(error => console.log('error', error));
    }

    const handleMonthSpan = (months) => {
        setMonthSpan(months);
        getFDR(months);
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

                                                <div className="input-group">
                                                    <select
                                                        name="cars"
                                                        id="cars"
                                                        className="inp"
                                                        value={monthSpan}
                                                        onChange={e => {
                                                            console.log("e.target.value", e.target.value);
                                                            handleMonthSpan(e.target.value);
                                                        }}
                                                        style={{ borderRadius: 10, fontStyle: 'italic', backgroundColor: '#191c24' }}>
                                                        <option value="1">1 month</option>
                                                        <option value="2">2 months</option>
                                                        <option value="3">3 months</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div className="col-12 grid-margin">
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="row">
                                            <p className="card-description"> Airline <code className=" text-warning">{props.airline.toUpperCase()}</code></p>
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
                                    <AccordionFDR rowData={rowData} airline={props.airline}></AccordionFDR>
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


