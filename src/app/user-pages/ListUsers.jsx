import React, { useState, useCallback, useMemo } from "react";
import { useEffect, useRef } from 'react';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Alert from 'react-bootstrap/Alert';
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Spinner from 'react-bootstrap/Spinner';
import { Accordion, Card } from "react-bootstrap";
import { ProgressBar } from 'react-bootstrap';
import { SwitchToggle } from "../usermanagement/SwitchToggle";
import { deleteFromGroup, getAllGroups, addToGroup } from "../../graph";

import 'ag-grid-community/dist/styles/ag-grid.css';
import "../aggrid.css";
import UserCellRenderer from "../components/UserCellRenderer.jsx";
import CustomNoRowsOverlay from "../components/CustomNoRowsOverlay.jsx";

const axios = require('axios');

export const ListUsers = (props) => {
    const [rowData, setRowData] = useState([]);
    const gridRef = useRef(null);
    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);
    const [token, setToken] = useState();
    const [loader2, setLoader2] = useState("");
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
    const [disableDeleteButton, setDisableDeleteButton] = useState(false);
    const [count, setCount] = useState(0);
    const [filterVal, setFilterVal] = useState();
    const [deleteDisabled, setDeleteDisabled] = useState(true);
    const [exportDisabled, setExportDisabled] = useState(true);
    const [cancelButtonEnabled, setCancelButtonEnabled] = useState(false);
    const [titleWarning, setTitleWarning] = useState();
    const [closeDisabled, setCloseDisable] = useState(false);

    const abort = useRef(0);

    useEffect(() => {
        getUsers();
    }, []);

    const handleClose = () => {
        setShow(false);
        setShowAlert(false);
        setShowAdd(false)
    }

    const gridOptions = {
        // PROPERTIES
        // Objects like myRowData and myColDefs would be created in your application

        pagination: true,
        onCellEditingStopped: async function (event) {
            console.log("ask the server to update changed data in back end", event);
            let data = { rowIndex: event.rowIndex, id: event.data.userId, col: event.column.colId, value: event.value }
            let status = await editUser(event.data);

            if (status == 204) {
                let oldGroupId = null;
                let newGroupId = null;
                if (event.oldValue.includes("role-")) {
                    if (event.oldValue != event.newValue) {
                        getAllGroups(props.token).then(response => {
                            response.value.forEach(group => {
                                if (group.displayName.includes(event.oldValue) == true) {
                                    oldGroupId = group.id;
                                }
                                if (group.displayName.includes(event.newValue) == true) {
                                    newGroupId = group.id;
                                }

                            });
                            deleteFromGroup(props.token, oldGroupId, event.data.objectId).then(response => {
                                console.log(response);
                            });
                            addToGroup(props.token, newGroupId, event.data.objectId).then(response => {
                                console.log(response);
                            });
                        });
                    }
                }

                //var column = event.column.colDef.field;
                //event.colDef.cellStyle = { 'color': 'green' };
                event.api.flashCells({
                    force: true,
                    columns: [event.column.colId],
                    rowNodes: [event.node]

                });
            }
            else {
                alert("Error updating user.");
                event.colDef.cellStyle = {
                    'background-color': 'red', 'transition': 'background-color 0.5s'
                };
                event.api.refreshCells({
                    force: true,
                    columns: [event.column.colId],
                    rowNodes: [event.node]

                });

                setTimeout(() => {
                    event.colDef.cellStyle = { 'background-color': 'transparent', 'transition': 'background-color 0.5s' };
                    event.api.refreshCells({
                        force: true,
                        columns: [event.column.colId],
                        rowNodes: [event.node]

                    });
                }, 500);
            }
        }

    }

    const editUser = async (data) => {

        const headers = new Headers();
        const bearer = `Bearer ${props.token}`;

        headers.append("Authorization", bearer);
        headers.append("Content-Type", "application/json");
        headers.append("Airline", `airline-${props.airline}`);

        headers.append("Ocp-Apim-Subscription-Key", `${process.env.REACT_APP_APIM_KEY}`);

        var body = JSON.stringify({
            "objectId": `${data.objectId}`,
            "displayName": `${data.displayName}`,
            "givenName": `${data.givenName}`,
            "surname": `${data.surname}`,
            "userRole": `${data.userRole}`,
            "mailNickname": `${data.mailNickname}`,
            "otherMails": [
                `${data.otherMails}`
            ],
            "userRole": `${data.userRole}`,
            "createdDateTime": `${data.createdDateTime}`,

        });

        const options = {
            method: "PUT",
            headers: headers,
            body: body
        };

        let res = await fetch(process.env.REACT_APP_USERS_EDIT_URI, options);
        let message = await res.text();
        let status = res.status;
        return status;
    }

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

    const handleShow = e => {

        let users = [];
        var x = "<br></br>";
        const selectedNodes = gridRef.current.api.getSelectedNodes();
        const selectedData = selectedNodes.map(node => node.data);
        const deleteUsers = selectedData.map(node => {
            users.push(node);
        });
        setLoader2(": Warning");
        setTitleWarning(" <i class='mdi mdi-alert-octagon text-danger'></i>");
        setDisableDeleteButton(false);
        setStatusText();
        if (deleteUsers.length != 0) {
            setShow(true);
            users.forEach(user => {
                x = x + '<i class="mdi mdi-account text-primary"></i> [' + user.mailNickname + '] ' + user.surname + ', ' + user.givenName + '</br>'

            });
            setDeleteUsersLabel(`You are about to delete: ${x}`);
        }
        else {
            alert("No users selected!")
        }

    };

    const deleteHandler = async (e) => {
        e.preventDefault();
        setDisableDeleteButton(true);
        setShowDeleteProgressBar(true)
        setDeleteUsersLabel("Deleting Users...");
        setDeleteProgressBarCount(0);
        setTitleWarning();
        setDeleteLabel(<><Spinner animation="border" size="sm" /></>);
        setLoader2(<><Spinner animation="border" size="sm" /></>);
        setCloseDisable(true);
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
        abort.current = 0;

        for (let node of selectedData) {
            if (abort.current == 0) {
                let status = await deleteUsers(node.objectId);
                console.log(status)
                countProgress = countProgress + increment;
                setDeleteProgressBarCount(countProgress);
                count++;
                if (status == 204) {
                    deleted.push(node);
                    x = x + '<i class="mdi mdi-checkbox-marked-circle-outline text-success"></i> Deleted [' + node.mailNickname + '] successfully.</br>'
                    setDeleteUsersLabel(x)
                }
                else {
                    notDeleted.push(node);
                    x = x + '<i class="mdi mdi mdi-alert-circle text-danger"></i> Error deleting [' + node.mailNickname + '] -> User not found!</br>'
                    setDeleteUsersLabel(x)
                }

                if (count == gridRef.current.api.getSelectedNodes().length) {
                    getUsers();
                    setDeleteLabel("Delete");
                    setLoader2(": Done");
                    setCancelButtonEnabled(false);
                    //setStatusText(`${x} </br>`);
                    //setDeleteUsersLabel("Done");
                    let rows = gridRef.current.api.getDisplayedRowCount();
                    setCount(rows);
                    setTimeout(() => {
                        setShowDeleteProgressBar(false);
                        //setShow(false);
                        //setStatusText();

                    }, 1000);

                }
            }
            else {
                getUsers();
                setDeleteLabel("Delete");
                setLoader2(": Aborted");

                //setStatusText(`${x} </br>`);
                //setDeleteUsersLabel("Done");
                let rows = gridRef.current.api.getDisplayedRowCount();
                setCount(rows);
                setTimeout(() => {
                    setShowDeleteProgressBar(false);
                    //setShow(false);
                    //setStatusText();

                }, 1000);
                setCloseDisable(false);
                return;
            }
        }
        setCloseDisable(false)
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

        const options = {
            method: "DELETE",
            headers: headers,
        };

        let res = await fetch(`${process.env.REACT_APP_USERS_DELETE_URI}/${user}`, options);
        let x = await res.status;
        return x;
    }

    const login = async () => {
        try {
            const headers = new Headers();

            headers.append("Ocp-Apim-Subscription-Key", `${process.env.REACT_APP_APIM_KEY}`);
            headers.append("Content-Type", "application/json");

            var data = JSON.stringify({
                "azUsername": `${process.env.REACT_APP_FDAGROUND_USER}`,
                "azPassword": `${process.env.REACT_APP_FDAGROUND_PASS}`

            });
            const options = {
                method: "POST",
                headers: headers,
                body: data
            };
            let res = await fetch(process.env.REACT_APP_LOGIN_URI, options);
            let token = await res.json();
            console.log("el token es " + token.authenticationResult.accessToken)
            return token.authenticationResult.accessToken;
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
        try {
            let res = await fetch(process.env.REACT_APP_USERS_GET_URI, requestOptions);
            let status = await res.status;
            let data = await res.json();
            if (status == 200) {
                setRowData(data);
                let rows = gridRef.current.api.getDisplayedRowCount();
                setCount(rows);
            }
        }
        catch (error) {
            console.log(error);
        }
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
        onInputMail = ({ target: { value } }) => setMail(value.toLowerCase());

    const [role, setRole] = useState("role-airlinefocal")

    const onFormSubmit = e => {
        e.preventDefault();
        createUser();
    }

    const createUser = async () => {
        setShowSuccess(false);
        setShowAlert(false)
        setShowAlertText();
        setCreateLabel(<><Spinner animation="border" size="sm" /></>)

        const tokenFDA = await login();

        const headers = new Headers();
        const bearer = `Bearer ${tokenFDA}`;

        headers.append("Authorization", bearer);
        headers.append("Content-Type", "application/json");
        //headers.append("DirRole", `${props.dirRole}`);
        headers.append("Ocp-Apim-Subscription-Key", `${process.env.REACT_APP_APIM_KEY}`);

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
                    setShowSuccessText(data.mailNickname);
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
        //gridRef.current.api.showNoRowsOverlay();
        setFilterVal(e.target.value)
        gridRef.current.api.setQuickFilter(e.target.value);
        let rows = gridRef.current.api.getDisplayedRowCount();
        setCount(rows);

    }

    const accountStateFormatter = (params) => {
        if (params.data.accountEnabled == "false") {
            return "PENDING";
        }
        else return "REGISTERED";
    };

    const rowClassRules = {
        'row-activated': function (params) { return params.data.accountEnabled == "true"; },
        //'row-pending': function (params) { return params.data.accountEnabled == "false"; }
    };

    const cellClassRules = {
        'text-success': function (params) { return params.data.accountEnabled == "true"; },
        'text-warning': function (params) { return params.data.accountEnabled == "false"; }
    };

    const onRowSelected = useCallback((event) => {
        let count = gridRef.current.api.getSelectedNodes().length;
        if (count == 0) {
            setDeleteDisabled(true);
            setExportDisabled(true);

        }
        else {
            setDeleteDisabled(false);
            setExportDisabled(false);
        }
    }, []);

    const setAutoHeight = useCallback(() => {
        gridRef.current.api.setDomLayout('autoHeight');
        // auto height will get the grid to fill the height of the contents,
        // so the grid div should have no height set, the height is dynamic.
        document.querySelector('#myGrid').style.height = '';
    }, []);

    const noRowsOverlayComponent = useMemo(() => {
        return CustomNoRowsOverlay;
    }, []);

    const onFilterChanged = () => {
        let rows = gridRef.current.api.getDisplayedRowCount();
        setCount(rows);
    }

    const onBtnExport = useCallback(() => {
        gridRef.current.api.exportDataAsCsv({
            onlySelected: true,
          });
      }, []);

    return (
        <div>
            <div className="row">
                <div className="col-sm-12 grid-margin stretch-card">
                    <div className="card">
                        <div className="card-body">
                            <Accordion >
                                <Card>
                                    <Card.Header style={{ backgroundColor: "rgb(17, 17, 17)" }}>
                                        <Accordion.Toggle as={Button}
                                            variant="link" eventKey="0">

                                            <h4> <i className="mdi mdi-chevron-double-down icon-md"></i>Create User</h4>
                                        </Accordion.Toggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="0">
                                        <Card.Body style={{ backgroundColor: "rgb(17, 17, 17)" }}>
                                            <div className="col-12 grid-margin" >
                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <div className="input-group">
                                                            {/*<div className="input-group-prepend">
                                                                <span className="input-group-text bg-primary text-white">User</span>
                                                            </div>*/
                                                            }

                                                            <input
                                                                type="text"
                                                                className="inp"
                                                                placeholder="User ID"
                                                                aria-label="User Principal"
                                                                onChange={onInputPrincipal}
                                                                value={principal}
                                                                style={{ borderRadius: 10, fontStyle: 'italic' }}
                                                            />
                                                            {/*
                                                            <div className="input-group-append">
                                                                <span className="input-group-text text-white">@flitedeckadvisor.com</span>
                                                                </div>
                                                                */}
                                                        </div>
                                                    </div>
                                                    <div className="col-md-3">
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="input-group">
                                                            <select
                                                                name="cars"
                                                                id="cars"
                                                                className="inp"
                                                                value={role}
                                                                onChange={e => {
                                                                    console.log("e.target.value", e.target.value);
                                                                    setRole(e.target.value);
                                                                }}
                                                                style={{ borderRadius: 10, fontStyle: 'italic' }}>
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
                                                        <div className="input-group">
                                                            {/*<div className="input-group-prepend">
                                                                <span className="input-group-text bg-primary text-white">First Name</span>
                                                            </div>*/}
                                                            <input
                                                                aria-label=""
                                                                type="text"
                                                                className="inp"
                                                                onChange={onInputGivenName}
                                                                value={givenName}
                                                                placeholder="First Name"
                                                                style={{ borderRadius: 10, fontStyle: 'italic' }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-3">
                                                        <div className="input-group">

                                                            <input
                                                                aria-label=""
                                                                type="text"
                                                                className="inp"
                                                                placeholder="Last Name"
                                                                onChange={onInputSurname}
                                                                value={surname}
                                                                style={{ borderRadius: 10, fontStyle: 'italic' }} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-5">
                                                        <div className="input-group">
                                                            {/*<div className="input-group-prepend">
                                                                <span className="input-group-text bg-primary text-white">eMail</span>
                                                        </div>*/}
                                                            <input
                                                                className="inp"
                                                                aria-label="First name"
                                                                type="text"
                                                                onChange={onInputMail}
                                                                value={mail}
                                                                placeholder="eMail"
                                                                style={{ borderRadius: 10, fontStyle: 'italic' }} />

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
                                                            <Alert.Heading>User with ID [{showSuccessText}] created successfully!</Alert.Heading>
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
                                            <div className="input-group">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text bg-primary text-white">
                                                        <i className="mdi mdi-account-search"></i>
                                                    </span>
                                                </div>
                                                <input value={filterVal} aria-label="" style={{ color: "#fff" }} placeholder="Search..." type="text" className="form-control form-control"
                                                    onChange={onFilterTextBoxChanged}
                                                />

                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div className="col-12 grid-margin" style={{ marginBottom: 0 }}>
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="row">
                                            <p className="card-description"> Airline <code className="text-warning">{props.airline.toUpperCase()}</code></p>
                                        </div>
                                    </div>
                                    <div className="col-md-4 align-self-center d-flex align-items-center justify-content-center">
                                        <div className="row">
                                            <SwitchToggle values={["pending", "all", "registered"]} selected="all" gridRef={gridRef} setCount={setCount} setFilterVal={setFilterVal} />

                                        </div>
                                        <div className="row" >
                                            <div className="col-12 ">
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">

                                    </div>
                                </div>
                            </div>
                            <div className="col-12 grid-margin" style={{ marginTop: 0 }}>
                                <div className="row">
                                    <div className="col-md-4">

                                    </div>
                                    <div className="col-md-4 align-self-center d-flex align-items-center justify-content-center">

                                        <div className="">
                                            <div className="col-12 ">
                                                <h4><i className='text-primary'>{count}</i></h4>

                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">

                                    </div>
                                </div>
                            </div>

                            <div className="ag-theme-alpine-dark" style={{ width: '100%', height: 550, marginTop: -15 }}>
                                {
                                    deleteDisabled
                                        ?
                                        <></>
                                        :
                                        <Button variant="danger" disabled={false} style={{ borderRadius: 1, marginLeft: 3, fontWeight: "bold" }} size="sm" onClick={e => {
                                            handleShow();
                                            setCancelButtonEnabled(false);
                                        }}><i className="mdi mdi-delete-forever"></i>{deleteLabel}</Button>

                                }
                                {
                                    exportDisabled
                                        ?
                                        <></>
                                        :
                                        <Button variant="primary" disabled={false} style={{ borderRadius: 1, marginLeft: 3, fontWeight: "bold" }} size="sm" onClick={e => {
                                            onBtnExport(); 
                                        }}><i className="mdi mdi-download"></i>Export</Button>
                                }
                                
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
                                    rowClassRules={rowClassRules}
                                    onRowSelected={onRowSelected}
                                    onFilterChanged={onFilterChanged}
                                    selectionChanged={e => console.log(e)}
                                    //noRowsOverlayComponent={noRowsOverlayComponent}
                                    suppressExcelExport={true}

                                >
                                    <AgGridColumn field="objectId" sortable={true} filter={true} hide={true} editable={false}></AgGridColumn>
                                    <AgGridColumn field="mailNickname" sortable={true} filter={true} headerName={"User"} checkboxSelection={true} headerCheckboxSelection={true} editable={false}></AgGridColumn>
                                    <AgGridColumn field="displayName" sortable={true} filter={true} hide={true} ></AgGridColumn>
                                    <AgGridColumn field="givenName" sortable={true} filter={true}></AgGridColumn>
                                    <AgGridColumn field="surname" sortable={true} filter={true} headerName={"Last Name"}></AgGridColumn>
                                    {
                                        //<AgGridColumn field="userPrincipalName" sortable={true} filter={true} hide={true}></AgGridColumn>
                                    }
                                    <AgGridColumn field="createdDateTime" sortable={true} filter={true} sort={"desc"} editable={false}></AgGridColumn>
                                    <AgGridColumn field="userRole" sortable={true} filter={true} cellEditor="agSelectCellEditor" cellEditorParams={{
                                        values: ['role-airlinepilot', 'role-airlinefocal', 'role-airlineefbadmin', 'role-airlinecheckairman', 'role-airlinemaintenance'],
                                    }}></AgGridColumn>
                                    <AgGridColumn field="accountEnabled" sortable={true} filter={true} hide={false} valueGetter={accountStateFormatter} cellClassRules={cellClassRules} headerName={"Status"} editable={false}></AgGridColumn>
                                    <AgGridColumn field="otherMails" sortable={true} filter={true} headerName={"Email"} editable={false}></AgGridColumn>
                                </AgGridReact>

                                <Modal scrollable="true" show={show} onHide={handleClose} contentClassName={"modal"}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Delete Users {loader2}
                                            <a dangerouslySetInnerHTML={{ __html: titleWarning }} />
                                        </Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <div dangerouslySetInnerHTML={{ __html: deleteUsersLabel }} />
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
                                        {
                                            cancelButtonEnabled
                                                ?
                                                <Button variant="warning" size="sm" onClick={e => {
                                                    abort.current = 1;
                                                    setCancelButtonEnabled(false);
                                                    //setGridDeleteButtonEnabled(true);
                                                }
                                                }>
                                                    Abort
                                                </Button>
                                                :
                                                <></>
                                        }
                                        <Button variant="secondary" disabled={closeDisabled} size="sm" onClick={e => {
                                            handleClose();
                                            setCancelButtonEnabled(false);

                                        }}>
                                            Close
                                        </Button>

                                        <Button variant="danger" size="sm" onClick={e => {
                                            deleteHandler(e);
                                            setCancelButtonEnabled(true);
                                        }} disabled={disableDeleteButton}>
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


