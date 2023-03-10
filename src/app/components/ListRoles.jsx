import React, { useState, useCallback, useMemo } from "react";
import { useEffect, useRef } from 'react';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import { Accordion, Card } from "react-bootstrap";
import { ProgressBar } from 'react-bootstrap';
import { SwitchToggle } from "../usermanagement/SwitchToggle";
import { getAllGroups, createRole, getGroupNames, getAirlineRoles } from "../../graph";
import 'ag-grid-community/dist/styles/ag-grid.css';
import "../aggrid.css";
import { AccountEnabledCellRenderer } from "./AccountEnabledCellRenderer.jsx";
import CustomNoRowsOverlay from "./CustomNoRowsOverlay.jsx";
import { VersionCellRenderer } from "./VersionCellRenderer";

const axios = require('axios');

export const ListRoles = (props) => {
    const [showAlert, setShowAlert] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [createLabel, setCreateLabel] = useState("Create Role");
    const [showAlertText, setShowAlertText] = useState();
    const [showSuccessText, setShowSuccessText] = useState();
    const [rowData, setRowData] = useState([]);
    const gridRef = useRef(null);
    const [gridDeleteButtonEnabled, setGridDeleteButtonEnabled] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [deleteButtonDisabled, setDeleteButtonDisabled] = useState(false);
    const [loader2, setLoader2] = useState("");
    const [titleWarning, setTitleWarning] = useState();
    const [deleteLabel, setDeleteLabel] = useState();
    const [deleteLoader, setDeleteLoader] = useState("Delete");
    const [cancelButtonEnabled, setCancelButtonEnabled] = useState(false);
    const [isError, setIsError] = useState(false);
    const [deleteDisabled, setDeleteDisabled] = useState(true);


    const [roleName, setRoleName] = useState(),
        onInputRoleName = ({ target: { value } }) => setRoleName(value);
    const [description, setDescription] = useState(),
        onInputDescription = ({ target: { value } }) => setDescription(value);


    useEffect(() => {
        getAllRoles();
        getRoles();

    }, []);

    const getRoles = () => {
        let airlineId = null;

        getAllGroups(props.token).then(response => {
            response.value.forEach(group => {
                //get airline group id
                if (group.displayName.startsWith(`airline-${props.airline}`) == true) {
                    airlineId = group.id;
                }
            });
            getAirlineRoles(props.token, airlineId).then(response => {
                console.log(response.value)
                setRowData(response.value)
                gridRef.current.api.hideOverlay();

            });

        });

    }

    const getAllRoles = async () => {
        let roles = [];
        let names = [];
        names = await getAllGroups(props.token).then(async response => {

            response.value.forEach(group => {
                if (group.displayName.startsWith(`role-`) == true) {
                    roles.push(group);
                    names.push(group.displayName);
                }
            });
            return names;

        });
        return names;
    }

    const onFormSubmit = async () => {
        setShowAlert(false);
        let names = await getAllRoles();
        console.log(names)
        let role = roleName;
        console.log(role)
        try {
            console.log(description)
            if ((roleName != undefined && roleName != "") && (description != undefined && description != "")) {
                if (!role.startsWith("role-")) {
                    role = "role-" + role;
                }

                if (!names.includes(role)) {
                    let res = await getAllGroups(props.token).then(response => {

                        response.value.forEach(group => {
                            //get airline group id
                            if (group.displayName.startsWith(`airline-${props.airline}`) == true) {
                                createRole(props.token, group.id, role, description).then(response => {
                                    console.log(response);
                                    setShowSuccessText(role)
                                    setShowSuccess(true);
                                });

                            }
                            //getRoles()
                        });

                        return response;
                    });
                    setTimeout(() => {
                        console.log("hola")
                        getRoles();
                    }, 10000);
                }
                else {
                    setShowAlertText("Role already exists");
                    setShowAlert(true);

                }
                setIsError(false);
                
            }
            else throw 500;
        }
        catch (error) {
            //setShowAlert(true);
            //setShowAlertText("Empty fields");
            setIsError(true);
            
        }

    }

    const onGridReady = params => {
        params.api.sizeColumnsToFit();
        params.api.showLoadingOverlay();

    };

    const handleShow = e => {
/*
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
*/
    };

    const handleShowDelete = e => {
        setLoader2(": Warning");
        setTitleWarning(" <i class='mdi mdi-alert-octagon text-danger'></i>");
        let users = [];
        var x = "<br></br>";
        const selectedNodes = gridRef.current.api.getSelectedNodes()
        const selectedData = selectedNodes.map(node => node.data);
        const deleteUsers = selectedData.map(node => {
            users.push(node);
        })
        if (deleteUsers.length != 0) {

            users.forEach(user => {
                x = x + '<i class="mdi mdi-account text-primary"></i> [' + user.userId + '] ' + user.last + ', ' + user.first + '</br>'

            });

            setDeleteLabel(`Do you really want to delete: ${x}`);
            if (deleteUsers.length != 0) {
                setShowDelete(true)
            }
        }
        else {
            alert("No users selected!")
        }
    };

    const onFilterTextBoxChanged = e => {
        gridRef.current.api.setQuickFilter(e.target.value);
    }

    const refreshGrid = useCallback(() => {
        gridRef.current.api.showLoadingOverlay();
        getRoles();
    }, []);

    const onRowSelected = useCallback((event) => {
        let count = gridRef.current.api.getSelectedNodes().length;
        if (count == 0) {
            setDeleteDisabled(true);

        }
        else {
            setDeleteDisabled(false);
        }
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

                                            <h4> <i className="mdi mdi-chevron-double-down icon-md"></i>Create Role</h4>
                                        </Accordion.Toggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="0">
                                        <Card.Body style={{ backgroundColor: "rgb(17, 17, 17)" }}>
                                            <div className="col-12 grid-margin" >
                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <div className="input-group">
                                                            <label className="borderLabelAlt"><span class="required">* </span></label>
                                                            <input
                                                                type="text"
                                                                className={isError ? "inpError" : "inp"}
                                                                placeholder="Name"
                                                                aria-label="Name"
                                                                onChange={onInputRoleName}
                                                                value={roleName}
                                                                style={{ borderRadius: 10, fontStyle: 'italic' }}
                                                            />

                                                        </div>
                                                    </div>
                                                    <div className="col-md-7">
                                                        <div className="input-group">
                                                            <label className="borderLabel"><span class="required">* </span>description</label>
                                                            <textarea
                                                                className={isError ? "inpMailTAError" : "inpMailTA"}
                                                                placeholder="Type in group description..."
                                                                aria-label="Content"
                                                                onChange={onInputDescription}
                                                                value={description}
                                                                style={{ borderRadius: 10, fontStyle: 'italic', height: 70 }}
                                                            />

                                                        </div>
                                                    </div>


                                                </div>
                                                <br></br>

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
                                                            <Alert.Heading>Role [{showSuccessText}] created successfully!</Alert.Heading>

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
                <div className="col-sm-12 grid-margin stretch-card">
                    <div className="card">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-12 grid-margin">
                                    <div className="row">
                                        <div className="col-md-8">
                                            <h4 className="card-title">User Roles Table</h4>
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

                            <Button className="btn-primary-override" variant="primary" style={{ borderRadius: 1, marginLeft: 3, fontWeight: "bold", borderColor: "transparent", backgroundColor: "transparent", color: "#777" }} size="md" onClick={e => {
                                refreshGrid()

                            }}>
                                <i className="mdi mdi-refresh text-success mdi-18px"></i>Refresh
                            </Button>
                            {
                                    deleteDisabled
                                        ?
                                        <></>
                                        :
                                        <Button className="btn-primary-override" variant="danger" disabled={false} style={{ borderRadius: 1, marginLeft: 3, fontWeight: "bold", borderColor: "transparent", backgroundColor: "transparent", color: "#777" }} size="md" onClick={e => {
                                            handleShow();
                                            setCancelButtonEnabled(false);
                                        }}><i className="mdi mdi-delete-forever text-danger mdi-18px"></i>Delete</Button>



                                }

                            <div className="ag-theme-alpine-dark" style={{ width: '100%', height: 530 }}>
                                <AgGridReact
                                    ref={gridRef}
                                    rowData={rowData}
                                    rowSelection="single"
                                    defaultColDef={{ resizable: true, editable: true, cellEditorPopup: false }}
                                    animateRows={true}
                                    onGridReady={onGridReady}
                                    //gridOptions={gridOptions}
                                    //onFirstDataRendered={autoSizeColumns}
                                    onRowSelected={onRowSelected}
                                    stopEditingWhenCellsLoseFocus={true}
                                    enableCellTextSelection={false}>
                                    <AgGridColumn field="displayName" checkboxSelection={true} headerCheckboxSelection={false} sortable={true} filter={true} editable={false} hide={false}></AgGridColumn>
                                    <AgGridColumn field="description" sortable={true} filter={true} editable={false} hide={false}></AgGridColumn>
                                    <AgGridColumn field="createdDateTime" sortable={true} filter={true} editable={false} hide={false}></AgGridColumn>
                                    <AgGridColumn field="renewedDateTime" sortable={true} filter={true} editable={false} hide={false}></AgGridColumn>


                                </AgGridReact>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div >
    );
};


