import React, { useState } from "react";
import { useEffect, useRef } from 'react';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Alert from 'react-bootstrap/Alert';
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Spinner from 'react-bootstrap/Spinner'
import { Accordion, Card } from "react-bootstrap";
import { ProgressBar } from 'react-bootstrap';
import { SwitchToggle } from "../users/SwitchToggle.jsx";

import 'ag-grid-community/dist/styles/ag-grid.css';
import "../aggrid.css";

const axios = require('axios');

export const ListUsers = (props) => {
    const [rowData, setRowData] = useState([]);
    const gridRef = useRef(null);
    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);
    const [token, setToken] = useState();
    const [showAlert, setShowAlert] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [show, setShow] = useState(false);
    const [showAdd, setShowAdd] = useState(false);
    const [deleteLabel, setDeleteLabel] = useState("Delete");
    const [createLabel, setCreateLabel] = useState("Create User");
    const [deleteUsersLabel, setDeleteUsersLabel] = useState("Create User");
    const [statusText, setStatusText] = useState();
    const [showAlertText, setShowAlertText] = useState();
    const [showSuccessText, setShowSuccessText] = useState();
    const [showDeleteProgressBar, setShowDeleteProgressBar] = useState(false);
    const [deleteProgressBarCount, setDeleteProgressBarCount] = useState(0);


    const handleClose = () => {
        setShow(false);
        setShowAlert(false);
        setShowAdd(false)
    }
    const handleShow = e => {
        const selectedNodes = gridRef.current.api.getSelectedNodes()
        const selectedData = selectedNodes.map(node => node.data);
        const principalName = selectedData.map(node => `${node.mailNickname}`).join(', ');
        setDeleteUsersLabel(principalName);
        if (principalName.length != 0) {
            setShow(true)
        }
    };

    const gridOptions = {
        // PROPERTIES
        // Objects like myRowData and myColDefs would be created in your application

        pagination: true,

    }

    const handleShowAdd = e => {
        setShowAdd(true)
    };

    useEffect(() => {
        getUsers();
    }, [])

    const onGridReady = params => {
        params.api.sizeColumnsToFit();
        params.api.showLoadingOverlay();

    };

    /**
     * Auto-size all columns once the initial data is rendered.
     */
    const autoSizeColumns = params => {
        const colIds = params.columnApi
            .getAllDisplayedColumns()
            .map(col => col.getColId());

        params.columnApi.autoSizeColumns(colIds);
    };

    const deleteHandler = e => {
        e.preventDefault();
        setShowDeleteProgressBar(true)
        setDeleteProgressBarCount(0);
        setDeleteLabel(<><Spinner animation="border" size="sm" /></>);
        let selected = [];
        const selectedNodes = gridRef.current.api.getSelectedNodes()
        const selectedData = selectedNodes.map(node => node.data);
        //const objectId = selectedData.map(node => `${node.objectId}`).join(', ');

        let count = 0
        let increment = (100 / gridRef.current.api.getSelectedNodes().length);
        let countProgress = 0;

        let deleted = [];
        let notDeleted = [];
        var x = "";

        selectedData.forEach(async (node) => {
            let status = await deleteUsers(node.objectId);

            countProgress = countProgress + increment;
            setDeleteProgressBarCount(countProgress);
            count++;

            if (status == 201) {
                deleted.push(node);
                x = x + '<i class="mdi mdi-checkbox-marked-circle-outline text-success"></i> [' + node.objectId + ']</br>'
                setStatusText(x)
            }
            else {
                notDeleted.push(node);
                x = x + '<i class="mdi mdi mdi-alert-circle text-danger"></i> [' + node.objectId + '] -> Error</br>'
                setStatusText(x)
            }

            if (count == gridRef.current.api.getSelectedNodes().length) {
                getUsers();
                setDeleteLabel("Delete");
                setTimeout(() => {
                    setShowDeleteProgressBar(false);
                    //setShow(false);
                    //setStatusText();

                }, 1000);

            }
        });
    }

    const deleteUsers = async (user) => {
        const headers = new Headers();
        const bearer = `Bearer ${props.token}`;

        headers.append("Authorization", bearer);
        headers.append("User", user);
        headers.append("Membership", `airline-${props.airline}`);
        headers.append("Role", `role-${props.role}`);
        headers.append("ObjectID", `${props.graphData.id}`);
        headers.append("Ocp-Apim-Subscription-Key", `${process.env.REACT_APP_APIM_KEY}`);

        console.log(props.graphData.id)
        const options = {
            method: "DELETE",
            headers: headers,
        };

        let res = await fetch(`${process.env.REACT_APP_USERS_DELETE_URI}/${user}`, options);
        let x = await res.text();
        if (x == "")
            return 201;
        else {
            return 500;
        }
    }

    const login = async () => {
        try {
            let res = await fetch(process.env.REACT_APP_LOGIN_URI);
            let token = await res.json();
            return token;
        } catch (error) {
            console.log(error);
        }
    }

    const getUsers = async () => {

        var requestOptions = {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${props.token}`,
                "Airline": `airline-${props.airline}`,
                "ObjectID": `${props.objectId}`,
                "Ocp-Apim-Subscription-Key": `${process.env.REACT_APP_APIM_KEY}`
            }
        };

        fetch(process.env.REACT_APP_USERS_GET_URI, requestOptions)
            .then(response => response.json())
            .then(data => {
                setTimeout(() => {
                    setRowData(data);
                }, 0);
                console.log(data);
            }
            )
            .catch(error => console.log('error', error));
    }

    //Create Users
    const [principal, setPrincipal] = useState(""),
        onInputPrincipal = ({ target: { value } }) => setPrincipal(value);

    const [givenName, setGivenName] = useState(""),
        onInputGivenName = ({ target: { value } }) => setGivenName(value);

    const [surname, setSurname] = useState(""),
        onInputSurname = ({ target: { value } }) => setSurname(value);

    const [displayName, setDisplayName] = useState(""),
        onInputDisplayName = ({ target: { value } }) => setDisplayName(value);

    const [password, setPassword] = useState(""),
        onInputPassword = ({ target: { value } }) => setPassword(value);

    const [mail, setMail] = useState(""),
        onInputMail = ({ target: { value } }) => setMail(value);

    const [role, setRole] = useState("role-airlinefocal")

    const onFormSubmit = e => {
        e.preventDefault();
        createUser();
    }

    const createUser = async () => {
        setShowSuccess(false);
        setShowAlert(false)
        setCreateLabel(<><Spinner animation="border" size="sm" /></>)
        const token = await login();
        setToken(token);
        const headers = new Headers();
        const bearer = `Bearer ${token}`;

        headers.append("Authorization", bearer);
        headers.append("Content-Type", "application/json");

        var data = JSON.stringify({
            "userPrincipalName": `${principal}`,
            "givenName": `${givenName}`,
            "surname": `${surname}`,
            "displayName": `${givenName} ${surname}`,
            "password": `Boeing12`,
            "forceChangePasswordNextLogin": "false",
            "otherMails": [
                `${mail}`
            ],
            "airlineGroupName": `airline-${props.airline}`,
            "roleGroupName": `${role}`
        });

        const options = {
            method: "POST",
            headers: headers,
            body: data
        };

        fetch(process.env.REACT_APP_USERS_CREATE_URI, options)
            .then(response => response.json())
            .then(data => {

                if (data.objectId) {
                    setShowAdd(false);
                    getUsers();
                    setShowSuccess(true);
                    setShowSuccessText(data.objectId);
                    setCreateLabel("Create User");

                }
                else {
                    setShowAlert(true);
                    setShowAlertText(data.errorDescription);
                    setCreateLabel("Create User");

                }
            }
            )
            .catch(error => {
                console.log('error', error);
                setShowAlert(true);
            });

    }

    const onFilterTextBoxChanged = e => {
        gridRef.current.api.setQuickFilter(e.target.value);
    }

    const accountStateFormatter = (params) => {
        console.log(params.data.accountEnabled)
        if (params.data.accountEnabled == "false") {
            return "PENDING";
        }
        else return "ACTIVATED";
    };

    return (
        <div>
            <div className="row">
                <div className="col-sm-12 grid-margin stretch-card">
                    <div className="card">
                        <div className="card-body">
                            <Accordion >
                                <Card>
                                    <Card.Header style={{ backgroundColor: "#111" }}>
                                        <Accordion.Toggle as={Button}
                                            variant="link" eventKey="0">

                                            <h4> <i class="mdi mdi-chevron-double-down icon-md"></i>Create User</h4>
                                        </Accordion.Toggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="0">
                                        <Card.Body style={{ backgroundColor: "#111" }}>
                                            <div className="col-12 grid-margin" >
                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <div class="input-group">
                                                            {/*<div class="input-group-prepend">
                                                                <span class="input-group-text bg-primary text-white">User</span>
                                                            </div>*/
                                                            }

                                                            <input
                                                                aria-label="" type="text" className="inp"
                                                                placeholder="User ID"
                                                                aria-label="User Principal"
                                                                type="text"
                                                                onChange={onInputPrincipal}
                                                                value={principal}
                                                                style={{borderRadius:10, fontStyle:'italic'}}
                                                                />
                                                            {/*
                                                            <div class="input-group-append">
                                                                <span class="input-group-text text-white">@flitedeckadvisor.com</span>
                                                                </div>
                                                                */}
                                                        </div>
                                                    </div>
                                                    <div className="col-md-3">
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div class="input-group">
                                                            <select
                                                                name="cars"
                                                                id="cars"
                                                                className="inp"
                                                                value={role}
                                                                onChange={e => {
                                                                    console.log("e.target.value", e.target.value);
                                                                    setRole(e.target.value);
                                                                }}
                                                                style={{borderRadius:10, fontStyle:'italic'}}>
                                                                <option value="role-airlinefocal">Focal</option>
                                                                <option value="role-airlinepilot">Pilot</option>
                                                                <option value="role-airlinecheckairman">Check Airman</option>
                                                                <option value="role-airlineefbadmin">FB Admin</option>
                                                                <option value="role-airlinemaintenance">Maintenance</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <br></br>
                                                <div className="row">
                                                    <div className="col-md-4">
                                                        <div class="input-group">
                                                            {/*<div class="input-group-prepend">
                                                                <span class="input-group-text bg-primary text-white">First Name</span>
                                                            </div>*/}
                                                            <input
                                                                aria-label="" type="text"
                                                                className="inp"
                                                                onChange={onInputGivenName}
                                                                value={givenName}
                                                                type="text"
                                                                placeholder="First Name" 
                                                                style={{borderRadius:10, fontStyle:'italic'}}
                                                                />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-3">
                                                        <div class="input-group">
                                                            
                                                            <input
                                                                aria-label="" type="text"
                                                                className="inp"
                                                                type="text"
                                                                placeholder="Last Name"
                                                                onChange={onInputSurname}
                                                                value={surname}
                                                                type="text" 
                                                                style={{borderRadius:10, fontStyle:'italic'}}/>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-5">
                                                        <div class="input-group">
                                                            {/*<div class="input-group-prepend">
                                                                <span class="input-group-text bg-primary text-white">eMail</span>
                                                        </div>*/}
                                                            <input
                                                                aria-label="Amount (to the nearest dollar)" type="text"
                                                                className="inp"
                                                                aria-label="First name"
                                                                type="text"
                                                                onChange={onInputMail}
                                                                value={mail}
                                                                type="text" placeholder="eMail" 
                                                                style={{borderRadius:10, fontStyle:'italic'}}/>

                                                        </div>
                                                    </div>
                                                </div>
                                                <br></br>
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <button type="submit" disabled={false} size="sm" className="btn btn-primary btn-lg btn-block" onClick={onFormSubmit}>
                                                            {createLabel}
                                                        </button>
                                                    </div>
                                                </div>
                                                {
                                                    showAlert == true
                                                        ?
                                                        <Alert variant="danger" onClose={() => setShowAlert(false)} dismissible>
                                                            <Alert.Heading>Conflict!</Alert.Heading>
                                                            <p>
                                                                {showAlertText}
                                                            </p>
                                                        </Alert>
                                                        :
                                                        <></>
                                                }
                                                {
                                                    showSuccess == true
                                                        ?
                                                        <Alert variant="success" onClose={() => setShowSuccess(false)} dismissible>
                                                            <Alert.Heading>User with Object ID: {showSuccessText} created.</Alert.Heading>
                                                            <p>
                                                                {showAlertText}
                                                            </p>
                                                        </Alert>
                                                        :
                                                        <></>
                                                }
                                            </div>
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                            </Accordion>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-sm-12 grid-margin stretch-card">
                    <div className="card">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-12 grid-margin">
                                    <div className="row">
                                        <div className="col-md-9">
                                            <h4 className="card-title">Registration Table</h4>

                                        </div>
                                        <div className="col-md-3">
                                            <div class="input-group">
                                                <div class="input-group-prepend">
                                                    <span class="input-group-text bg-primary text-white">
                                                        <i class="mdi mdi-account-search"></i>
                                                    </span>
                                                </div>
                                                <input aria-label="" style={{ color: "#fff" }} placeholder="Search..." type="text" class="form-control form-control"
                                                    onChange={onFilterTextBoxChanged}
                                                />
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div className="col-12 grid-margin">
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="row">
                                            <p className="card-description"> Airline <code>{props.airline}</code></p>
                                        </div>
                                    </div>
                                    <div className="col-md-4 align-self-center d-flex align-items-center justify-content-center">
                                        <div className="row">
                                            <SwitchToggle values={["pending", "all", "activated"]} selected="all" gridRef={gridRef} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">

                                    </div>
                                </div>
                            </div>

                            <div className="ag-theme-alpine-dark" style={{ width: '100%', height: 500, marginTop:-15 }}>

                                <Button variant="danger" style={{ borderRadius: 1, marginLeft: 3, fontWeight: "bold" }} size="sm" onClick={handleShow}><i class="mdi mdi-delete-forever"></i>{deleteLabel}</Button>

                                <AgGridReact
                                    ref={gridRef}
                                    rowData={rowData}
                                    rowSelection="multiple"
                                    defaultColDef={{ resizable: true, editable: true, cellEditorPopup: false }}
                                    onGridReady={onGridReady}
                                    onFirstDataRendered={autoSizeColumns}
                                    enableCellTextSelection={false}
                                    gridOptions={gridOptions}
                                    animateRows={true}
                                >
                                    <AgGridColumn field="objectId" sortable={true} filter={true} hide={true}></AgGridColumn>
                                    <AgGridColumn field="mailNickname" sortable={true} filter={true} headerName={"User"} checkboxSelection={true}></AgGridColumn>
                                    <AgGridColumn field="displayName" sortable={true} filter={true} hide={true} ></AgGridColumn>
                                    <AgGridColumn field="givenName" sortable={true} filter={true}></AgGridColumn>
                                    <AgGridColumn field="surname" sortable={true} filter={true}></AgGridColumn>
                                    <AgGridColumn field="userPrincipalName" sortable={true} filter={true} hide={true}></AgGridColumn>
                                    <AgGridColumn field="createdDateTime" sortable={true} filter={true} sort={"desc"}></AgGridColumn>
                                    <AgGridColumn field="userRole" sortable={true} filter={true}></AgGridColumn>
                                    <AgGridColumn field="accountEnabled" sortable={true} filter={true} valueGetter={accountStateFormatter} headerName={"Status"}></AgGridColumn>
                                    <AgGridColumn field="otherMails" sortable={true} filter={true} headerName={"Email"}></AgGridColumn>

                                </AgGridReact>

                                <Modal scrollable="true" show={show} onHide={handleClose}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Delete User</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        {
                                            showAlert == true
                                                ?
                                                <Alert variant="danger" onClose={() => setShowAlert(false)} dismissible>
                                                    <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                                                    <p>
                                                        The User could not be deleted. Not Found (404).
                                                    </p>
                                                </Alert>
                                                :
                                                <></>
                                        }
                                        Do you really want to delete: {deleteUsersLabel} ?
                                    </Modal.Body>
                                    {
                                        showDeleteProgressBar
                                            ?
                                            <ProgressBar variant="danger" animated now={deleteProgressBarCount} />
                                            :
                                            <></>
                                    }
                                    <div dangerouslySetInnerHTML={{ __html: statusText }} />

                                    <Modal.Footer>
                                        <Button variant="secondary" size="sm" onClick={handleClose}>
                                            Cancel
                                        </Button>
                                        <Button variant="danger" size="sm" onClick={deleteHandler}>
                                            {deleteLabel}
                                        </Button>
                                    </Modal.Footer>
                                </Modal>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


