import React, { useEffect, useState, useRef, useCallback } from 'react';
import { ProgressBar } from 'react-bootstrap';
import { ListUsers } from "../user-pages/ListUsers";
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "@azure/msal-react";
import { loginRequest } from "../../authConfig";
import { callMsGraph, getGroupNames } from "../../graph";
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from 'react-bootstrap/Spinner'
import Modal from "react-bootstrap/Modal";
import { Accordion, Card } from "react-bootstrap";
import Alert from 'react-bootstrap/Alert';
import 'ag-grid-community/dist/styles/ag-grid.css';
import "../aggrid.css";
import { composeInitialProps } from 'react-i18next';
import Ajv, { JSONSchemaType } from "ajv"
import addFormats from "ajv-formats"
const ajv = new Ajv()
addFormats(ajv)

export const BulkLoad = (props) => {

    const { instance, accounts, inProgress } = useMsal();
    const [graphData, setGraphData] = useState([]);
    const [groupName, setGroupName] = useState([]);
    const [token, setToken] = useState();
    const [items, setItems] = useState([]);
    const [rowData, setRowData] = useState([]);
    const gridRef = useRef(null);
    const [groupId, setGroupId] = useState();
    const [created, setCreated] = useState();
    const [notCreated, setNotCreated] = useState();
    const [loader, setLoader] = useState("Send Registration");
    const [loader2, setLoader2] = useState("");
    const [errorUsers, setErrorUsers] = useState();
    const [notCreatedCount, setnotCreatedCount] = useState(0);
    const [createdCount, setCreatedCount] = useState(0);
    const [show, setShow] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const handleClose = () => {
        setShowDelete(false);
        setShow(false);
    }
    const [disable, setDisable] = useState(true);
    const [statusLabel, setStatusLabel] = useState("NA");
    const [check, setCheck] = useState();
    const [deleteLabel, setDeleteLabel] = useState();
    const [showAlert, setShowAlert] = useState(false);
    const [deleteLoader, setDeleteLoader] = useState("Delete");
    const [uploadLoader, setUploadLoader] = useState("Upload");
    const [statusText, setStatusText] = useState();
    const [progressBarCount, setProgressBarCount] = useState(0);
    const [deleteProgressBarCount, setDeleteProgressBarCount] = useState(0);
    const [cancelButtonEnabled, setCancelButtonEnabled] = useState(false);
    const [deleteButtonDisabled, setDeleteButtonDisabled] = useState(false);
    const [gridDeleteButtonEnabled, setGridDeleteButtonEnabled] = useState(false);
    const [showProgressBar, setShowProgressBar] = useState(false);
    const [showDeleteProgressBar, setShowDeleteProgressBar] = useState(false);
    const [showAlertText, setShowAlertText] = useState();
    const file = useRef();
    const abort = useRef(0);
    const [createCancelButtonEnabled, setCreateCancelButtonEnabled] = useState();

    useEffect(() => {
        getPreUsers();
    }, [])

    const readExcel = (file) => {
        const promise = new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            try {
                fileReader.readAsArrayBuffer(file);
            }
            catch {
                console.log("not a blob file");
            }
            fileReader.onload = (e) => {
                const bufferArray = e.target.result;
                const wb = XLSX.read(bufferArray, { type: "buffer" });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = XLSX.utils.sheet_to_json(ws);
                resolve(data);
            };

            fileReader.onerror = (error) => {
                reject(error);
            };
        });

        promise.then((d) => {
            //console.log(d)
            setItems(d);
        });
    };

    const renderGrid = async () => {
        //setRowData(items);
        setProgressBarCount(0);

        const schema = {
            type: "array",
            items: {
                type: "object",
                properties: {
                    first: {
                        type: ["string", "null"]
                    },
                    last: {
                        type: ["string", "null"]
                    },
                    user: {
                        type: "string"
                    },
                    email: {
                        type: "string", format: "email"
                    },
                    role: {
                        type: "string",
                        enum: ["role-airlinefocal", "role-airlinepilot", "role-airlinecheckairman", "role-airlineefbadmin", "role-airlinemaintenance"]
                    }
                },
                required: [
                    "user", "email", "role"
                ]
            },
            minItems: 1,
            maxItems: 300
        }

        const valid = ajv.validate(schema, items)

        if (valid) {
            setDisable(true);
            setShow(true);
            setStatusText();
            setnotCreatedCount(0);
            setCreatedCount(0)
            setShowProgressBar(true);
            setUploadLoader(<><Spinner animation="border" size="sm" /></>);
            setCreateCancelButtonEnabled(true);
            let count = 0
            let increment = (100 / items.length);
            let countProgress = 0;
            let created = [];
            let notCreated = [];
            var x = "";
            setLoader(<><Spinner animation="border" size="sm" /></>);
            setLoader2(<><Spinner animation="border" size="sm" /></>);
            abort.current = 0;
            for (let node of items) {
                if (abort.current == 0) {
                    let status = await createPreUser(node);
                    if (status == 1) {
                        created.push(node);
                        x = x + '<i class="mdi mdi-checkbox-marked-circle-outline text-success"></i> Created [' + node.user + '] successfully</br>'
                        setStatusText(x);
                        setCreatedCount(created.length);
                    }
                    else {
                        let error = status;
                        if (error.includes("PreparedStatementCallback; SQL [INSERT INTO user_account_preregistrations (user_id, first, last, email, role, account_state, airline) VALUES (?, ?, ?, ?, ?, ?, ?)];")) {
                            error = "User already exists on database. Violation of UNIQUE KEY constraint, can't insert duplicate values."
                        }
                        notCreated.push(node.user);
                        x = x + '<i class="mdi mdi mdi-alert-circle text-danger"></i> Error creating [' + node.user + '] -> ' + error + '</br>'
                        setStatusText(x);
                        setnotCreatedCount(notCreated.length);
                    }
                    count++;
                    countProgress = countProgress + increment;
                    setProgressBarCount(countProgress);

                    if (count == items.length) {
                        setnotCreatedCount(notCreated.length);
                        setCreatedCount(created.length);
                        setUploadLoader("Upload");
                        setLoader("Send Registration");
                        setLoader2("");
                        setCreateCancelButtonEnabled(false);
                        getPreUsers();
                        setTimeout(() => {
                            setShowProgressBar(false);
                        }, 1000);
                    }
                }
                else {
                    setnotCreatedCount(notCreated.length);
                    setCreatedCount(created.length);
                    setUploadLoader("Upload");
                    setLoader("Send Registration");
                    setLoader2(": Aborted");
                    setCreateCancelButtonEnabled(false);
                    getPreUsers();
                    setTimeout(() => {
                        setShowProgressBar(false);
                    }, 1000);
                }
            }
        }
        else {
            setShowAlert(true);
            console.log(JSON.stringify(ajv.errors[0].params))
            setShowAlertText(`Error: ${JSON.stringify(ajv.errors[0].params)} </br> Message: ${ajv.errors[0].message}.`);
        }

        //setFile("");
        file.current.value = "";

    }

    const createPreUser = async (element) => {

        const headers = new Headers();
        const bearer = `Bearer ${props.token}`;

        headers.append("Authorization", bearer);
        headers.append("Content-Type", "application/json");
        headers.append("Ocp-Apim-Subscription-Key", `${process.env.REACT_APP_APIM_KEY}`);

        var data = JSON.stringify({
            "userId": `${element.user}`,
            "first": `${element.first}`,
            "last": `${element.last}`,
            "email": `${element.email}`,
            "role": `${element.role}`,
            "airline": `airline-${props.airline}`,
        });

        const options = {
            method: "POST",
            headers: headers,
            body: data
        };
        let res = await fetch(process.env.REACT_APP_PREUSERS_CREATE_URI, options);
        let message = await res.json();
        let status = res.status;

        if (status == 500) {
            return message.errorDescription;
        }
        else {
            return 1;
        }
    }

    const handleBulkLoad = () => {
        let rows = gridRef.current.api.getSelectedNodes().length;
        if (rows != 0) {
            setCreateCancelButtonEnabled(true);
            bulkLoad();

        }
    }

    const bulkLoad = async () => {
        //reset counters
        setDisable(true);
        setShow(true);
        setStatusText("Creating Users...");
        setShowProgressBar(true);
        setProgressBarCount(0);
        setnotCreatedCount(0);
        setCreatedCount(0);
        let countProgress = 0;
        let created = [];
        let notCreated = [];
        let label;
        var accessToken = await login();
        let count = 0;
        const selectedNodes = gridRef.current.api.getSelectedNodes()
        const selectedData = selectedNodes.map(node => node.data);
        let rows = gridRef.current.api.getSelectedNodes().length;
        let increment = (100 / rows);

        if (count != rows) {
            setLoader(<>
                <Spinner animation="border" size="sm" /></>);
            setLoader2(<>
                <Spinner animation="border" size="sm" /></>);
            var x = "";
        }

        abort.current = 0;
        for (let node of selectedData) {
            if (abort.current == 0) {
                let status = await createUser(node, accessToken);
                let statusDelete = await deletePreUsers(node.userId);
                if (status.objectId) {
                    setCheck("true")
                    created.push(node);
                    x = x + '<i class="mdi mdi-checkbox-marked-circle-outline text-success"></i> Created [' + node.userId + '] successfully.</br>'
                    setStatusText(x);
                    setCreatedCount(created.length);
                }
                else {
                    notCreated.push(node);
                    x = x + '<i class="mdi mdi mdi-alert-circle text-danger"></i> Error creating [' + node.userId + '] -> ' + status.errorDescription + '</br>'
                    setStatusText(x)
                    setnotCreatedCount(notCreated.length);
                }

                count++;
                countProgress = countProgress + increment;
                setProgressBarCount(countProgress);

                if (count == rows) {
                    setNotCreated(notCreated);
                    setCreated(created);
                    setnotCreatedCount(notCreated.length);
                    setCreatedCount(created.length);
                    setCreateCancelButtonEnabled(false);
                    /*
                    const DisplayData = notCreated.map(
                        (info) => {
                            return (
                                <tr key={(info.userId)} className="table-danger">
                                    <td>{info.userId}</td>
                                    <td>{info.first}</td>
                                    <td>{info.last}</td>
                                    <td>{info.email}</td>
                                    <td>{info.role}</td>
                                </tr>
                            )
                        }
                    )
                    console.log(DisplayData);
                    setErrorUsers(DisplayData);
                    */
                    setShow(true);
                    setDisable(false);
                    setLoader("Send Registration");
                    setLoader2("");
                    getPreUsers();
                    setTimeout(() => {
                        setShowProgressBar(false);
                    }, 1000);
                    //callback();
                }
            }
            else {
                setnotCreatedCount(notCreated.length);
                setCreatedCount(created.length);
                setUploadLoader("Upload");
                setLoader("Send Registration");
                setLoader2(": Aborted");
                getPreUsers();
                setTimeout(() => {
                    setShowProgressBar(false);
                }, 1000);
                return;
            }
        }
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
            return token.authenticationResult.accessToken;
        } catch (error) {
            console.log(error);
        }
    }

    const createUser = async (data, accessToken) => {

        const headers = new Headers();
        const bearer = `Bearer ${accessToken}`;

        headers.append("Authorization", bearer);
        headers.append("Content-Type", "application/json");
        headers.append("Ocp-Apim-Subscription-Key", `${process.env.REACT_APP_APIM_KEY}`);

        var body = JSON.stringify({
            "userPrincipalName": `${data.userId}`,
            "givenName": `${data.first}`,
            "surname": `${data.last}`,
            "displayName": `${data.first} ${data.last}`,
            "password": "Boeing12",
            "forceChangePasswordNextLogin": "false",
            "otherMails": [
                `${data.email}`
            ],
            "airlineGroupName": `airline-${props.airline}`,
            "roleGroupName": `${data.role}`
        });

        const options = {
            method: "POST",
            headers: headers,
            body: body
        };

        let res = await fetch(process.env.REACT_APP_USERS_CREATE_URI, options);
        let x = await res.json();
        return x;
    }

    const onGridReady = params => {
        params.api.sizeColumnsToFit();
        //params.api.showLoadingOverlay();

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

    const getPreUsers = async () => {

        const headers = new Headers();
        const bearer = `Bearer ${props.token}`;

        headers.append("Authorization", bearer);
        headers.append("Airline", `airline-${props.airline}`);
        headers.append("Ocp-Apim-Subscription-Key", `${process.env.REACT_APP_APIM_KEY}`);

        var requestOptions = {
            method: "GET",
            headers: headers
        };

        const options = {
            method: "GET",
            headers: headers,
        };

        fetch(process.env.REACT_APP_PREUSERS_GET_URI, requestOptions)
            .then(response => response.json())
            .then(data => {
                try {
                    setRowData(data);
                }
                catch (error) {
                    window.location.reload();
                }

            }
            )
            .catch(error => console.log('error', error));
    }

    const handleShowDelete = e => {
        setLoader2();
        let users = [];
        var x = "<br></br>";
        const selectedNodes = gridRef.current.api.getSelectedNodes()
        const selectedData = selectedNodes.map(node => node.data);
        const deleteUsers = selectedData.map(node => {
            users.push(node);
        })

        users.forEach(user => {
            x = x + '<i class="mdi mdi-account text-primary"></i> [' + user.userId + '] ' + user.last + ', ' + user.first + '</br>'

        });

        setDeleteLabel(`Do you really want to delete: ${x}`);
        if (deleteUsers.length != 0) {
            setShowDelete(true)
        }
    };

    const deleteHandler = async () => {
        setLoader2(<><Spinner animation="border" size="sm" /></>);
        setShowDeleteProgressBar(true)
        setDeleteProgressBarCount(0);
        setDeleteLoader(<><Spinner animation="border" size="sm" /></>);
        let selected = [];
        const selectedNodes = gridRef.current.api.getSelectedNodes()
        const selectedData = selectedNodes.map(node => node.data);

        let count = 0
        let increment = (100 / gridRef.current.api.getSelectedNodes().length);
        let countProgress = 0;
        let deleted = [];
        let notDeleted = [];
        var x = "";
        abort.current = 0;
        for (let node of selectedData) {
            if (abort.current == 0) {
                let status = await deletePreUsers(node.userId);

                if (status == 204) {
                    setCheck("true")
                    deleted.push(node);
                    x = x + '<i class="mdi mdi-checkbox-marked-circle-outline text-success"></i> Deleted [' + node.userId + '] successfully.</br>'
                    setDeleteLabel(x)
                }
                else {
                    notDeleted.push(node);
                    x = x + '<i class="mdi mdi mdi-alert-circle text-danger"></i> Error deleting [' + node.userId + '] -> ' + status.errorDescription + '</br>'
                    setDeleteLabel(x)
                }


                count++;
                countProgress = countProgress + increment;
                setDeleteProgressBarCount(countProgress);

                if (count == gridRef.current.api.getSelectedNodes().length) {
                    getPreUsers();
                    setDeleteLoader("Delete");

                    setTimeout(() => {
                        setShowDeleteProgressBar(false);
                        setLoader2();
                        setCancelButtonEnabled(false)
                        //setShowDelete(false);
                    }, 1000);
                }
            }
            else {
                getPreUsers();
                setDeleteLoader("Delete");
                setLoader2(": Aborted");

                setTimeout(() => {
                    setShowDeleteProgressBar(false);
                }, 1000);

            }
        }
    }

    const deletePreUsers = async (user) => {
        const headers = new Headers();
        const bearer = `Bearer ${props.token}`;

        headers.append("Authorization", bearer);
        headers.append("Ocp-Apim-Subscription-Key", `${process.env.REACT_APP_APIM_KEY}`);

        const options = {
            method: "DELETE",
            headers: headers,
        };

        let res = await fetch(`${process.env.REACT_APP_PREUSERS_DELETE_URI}/${user}/`, options);
        let x = await res.status;
        return x;

    }

    const gridOptions = {
        // PROPERTIES
        // Objects like myRowData and myColDefs would be created in your application

        pagination: true,
        onCellEditingStopped: function (event) {
            console.log("ask the server to update changed data in back end", event);
            let data = { rowIndex: event.rowIndex, id: event.data.userId, col: event.column.colId, value: event.value }
            console.log(data)
            editPreUser(event.data);
        },


    }

    const onFilterTextBoxChanged = e => {
        gridRef.current.api.setQuickFilter(e.target.value);
    }

    const editPreUser = async (data) => {

        const headers = new Headers();
        const bearer = `Bearer ${props.token}`;

        headers.append("Authorization", bearer);
        headers.append("Content-Type", "application/json");
        headers.append("Ocp-Apim-Subscription-Key", `${process.env.REACT_APP_APIM_KEY}`);

        var body = JSON.stringify({
            "userId": `${data.userId}`,
            "first": `${data.first}`,
            "last": `${data.last}`,
            "email": `${data.email}`,
            "role": `${data.role}`,
            "airline": `airline-${props.airline}`,
        });

        const options = {
            method: "PUT",
            headers: headers,
            body: body
        };

        fetch(process.env.REACT_APP_PREUSERS_EDIT_URI, options)
            .then(response => response.text())
            .then(data => {
                console.log(data)
            }
            )
            .catch(error => console.log('error', error));
    }

    const onRowSelected = useCallback((event) => {
        setGridDeleteButtonEnabled(true);
        //return { background: '#ff9998 !important'}; 
    }, []);

    const [selected, setSelected] = useState("active");
    const values = ["active", "pending", "na"];

    return (
        <div>
            <div className="page-header">
                <h3 className="page-title">Bulk Load</h3>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a onClick={event => event.preventDefault()}>User Management</a></li>
                        <li className="breadcrumb-item active" aria-current="page">Bulk Load</li>
                    </ol>
                </nav>
            </div>
            <div className="row">

                <div className="col-sm-12 grid-margin stretch-card">
                    <div className="card">
                        <div className="card-body">

                            {
                                <Form>
                                    <Form.Group className="mb-3" controlId="uploadxls">
                                        <Form.Label>Please upload an excel file to bulk load users.</Form.Label>
                                        <Form.Control
                                            type="file"
                                            ref={file}
                                            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                            onChange={(e) => {
                                                setDisable(false);
                                                const uploadedFile = e.target.files[0];
                                                readExcel(uploadedFile);
                                            }}
                                        />
                                        <Form.Text >
                                            .xls, xlsx.
                                        </Form.Text>
                                    </Form.Group>
                                </Form>
                            }
                            <button type="submit" disabled={disable} size="sm" className="btn btn-primary btn-sm" onClick={renderGrid}>
                                {uploadLoader}
                            </button>

                        </div>
                        {
                            showAlert == true
                                ?
                                <Alert variant="danger" onClose={() => setShowAlert(false)} dismissible>
                                    <Alert.Heading>Error parsing file!</Alert.Heading>
                                    <p>
                                        <div dangerouslySetInnerHTML={{ __html: showAlertText }} />
                                    </p>
                                </Alert>
                                :
                                <></>
                        }
                    </div>
                </div>

                <div className="col-sm-12 grid-margin stretch-card">
                    <div className="card">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-12 grid-margin">
                                    <div className="row">
                                        <div className="col-md-8">
                                            <h4 className="card-title">Pre Registration Table</h4>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="input-group">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text bg-primary text-white">
                                                        <i className="mdi mdi-account-search"></i>
                                                    </span>
                                                </div>
                                                <input aria-label="Amount (to the nearest dollar)" style={{ color: "#fff" }} placeholder="Search..." type="text" className="form-control form-control"
                                                    onChange={onFilterTextBoxChanged}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <p className="card-description"> Airline <code className="text-warning">{props.airline.toUpperCase()}</code></p>
                            {
                                gridDeleteButtonEnabled
                                    ?
                                    <Button variant="danger" style={{ borderRadius: 1, marginLeft: 3, fontWeight: "bold" }} size="sm" onClick={e => {
                                        handleShowDelete();
                                        setDeleteButtonDisabled(false);
                                        setCancelButtonEnabled(false);

                                    }}>
                                        <i className="mdi mdi-delete-forever"></i>{deleteLoader}
                                    </Button>
                                    :
                                    <></>
                            }
                            <div className="ag-theme-alpine-dark" style={{ width: '100%', height: 530 }}>
                                <AgGridReact
                                    ref={gridRef}
                                    rowData={rowData}
                                    rowSelection="multiple"
                                    defaultColDef={{ resizable: true, editable: true, cellEditorPopup: false }}
                                    animateRows={true}
                                    onGridReady={onGridReady}
                                    gridOptions={gridOptions}
                                    //onFirstDataRendered={autoSizeColumns}
                                    onRowSelected={onRowSelected}
                                    enableCellTextSelection={false}>
                                    <AgGridColumn field="userId" sortable={true} filter={true} checkboxSelection={true} headerCheckboxSelection={true} editable={false}></AgGridColumn>
                                    <AgGridColumn field="last" sortable={true} filter={true}></AgGridColumn>
                                    <AgGridColumn field="first" sortable={true} filter={true} hide={false}></AgGridColumn>
                                    <AgGridColumn field="role" sortable={true} filter={true} cellEditor="agSelectCellEditor" cellEditorParams={{
                                        values: ['role-airlinepilot', 'role-airlinefocal', 'role-airlineefbadmin', 'role-airlinecheckairman', 'role-airlinemaintenance'],
                                    }}></AgGridColumn>
                                    <AgGridColumn field="email" sortable={true} filter={true}></AgGridColumn>


                                </AgGridReact>

                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-sm-12 grid-margin stretch-card">
                    <div className="card">
                        <div className="card-body">
                            <button type="submit" disabled={false} size="sm" className="btn btn-primary btn-lg btn-block" onClick={handleBulkLoad}>
                                {loader}
                            </button>
                        </div>
                    </div>
                </div>

                <Modal show={show} size="lg" onHide={handleClose} scrollable="true" backdrop="static" contentClassName={"modal"}
                    keyboard={false}>
                    <Modal.Header closeButton>
                        <Modal.Title>Bulk Load Status {loader2}</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <>

                            <div dangerouslySetInnerHTML={{ __html: statusText }} />
                            <br></br>
                            Created Users: {createdCount}
                            <br></br>
                            Users with errors: {notCreatedCount}
                        </>
                        {/*
                        <Accordion>

                            <Accordion.Toggle as={Button}
                                variant="link" eventKey="0">
                                {">"} Show Details
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey="0">
                                <Card.Body>
                                    <div className="table-responsive">
                                        <table className="table ">
                                            <thead>
                                                <tr>
                                                    <th>User</th>
                                                    <th>Name</th>
                                                    <th>Last Name</th>
                                                    <th>Email</th>
                                                    <th>Role</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {errorUsers}
                                            </tbody>
                                        </table>
                                    </div>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Accordion>
                        */}
                        <br></br>

                    </Modal.Body>
                    {
                        showProgressBar
                            ?
                            <ProgressBar animated now={progressBarCount} />
                            :
                            <></>
                    }

                    <Modal.Footer>
                        {
                            createCancelButtonEnabled
                                ?
                                <Button variant="warning" onClick={e => {
                                    abort.current = 1;
                                    setCreateCancelButtonEnabled(false);
                                }
                                }>
                                    Abort
                                </Button>
                                :
                                <></>
                        }

                        <Button variant="secondary" onClick={e => {
                            handleClose();
                        }
                        }>
                            OK
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal scrollable="true" show={showDelete} contentClassName={"modal"} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title><i className='mdi mdi-alert-octagon text-warning'></i> Delete Users {loader2}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <div dangerouslySetInnerHTML={{ __html: deleteLabel }} />

                    </Modal.Body>
                    {
                        showDeleteProgressBar
                            ?
                            <ProgressBar variant="warning" animated now={deleteProgressBarCount} />
                            :
                            <></>
                    }
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
                                    Cancel
                                </Button>
                                :
                                <></>
                        }
                        <Button variant="secondary" size="sm" onClick={e => {
                            handleClose();
                            setCancelButtonEnabled(false);
                            //setGridDeleteButtonEnabled(true);
                        }
                        }>
                            Close
                        </Button>
                        <Button disabled={deleteButtonDisabled} variant="danger" size="sm" onClick={e => {
                            deleteHandler();
                            setCancelButtonEnabled(true);
                            setDeleteButtonDisabled(true);
                            //setGridDeleteButtonEnabled(true)
                        }
                        }>
                            {deleteLoader}
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );

}
