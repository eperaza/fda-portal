import React, { useEffect, useState, useRef } from 'react';
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

import 'ag-grid-community/dist/styles/ag-grid.css';
import "../aggrid.css";
import { composeInitialProps } from 'react-i18next';

export const BulkLoad2 = (async) => {

  const { instance, accounts, inProgress } = useMsal();
  const [graphData, setGraphData] = useState([]);
  const [groupName, setGroupName] = useState([]);
  const [token, setToken] = useState();
  const [airline, setAirline] = useState();
  const [items, setItems] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const gridRef = useRef(null);
  const [groupId, setGroupId] = useState();
  const [created, setCreated] = useState();
  const [notCreated, setNotCreated] = useState();
  const [loader, setLoader] = useState("Bulk Load");
  const [loader2, setLoader2] = useState("");
  const [errorUsers, setErrorUsers] = useState();
  const [notCreatedCount, setnotCreatedCount] = useState(0);
  const [createdCount, setCreatedCount] = useState(0);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [disable, setDisable] = useState(true);
  const [statusLabel, setStatusLabel] = useState("NA");
  const [check, setCheck] = useState();



  let accessToken = null;
  React.useEffect(() => {
    console.log("fired...")
    if (inProgress === "none" && accounts.length > 0) {
      // Retrieve an access token
      accessToken = instance.acquireTokenSilent({
        account: accounts[0],
        ...loginRequest
      }).then(response => {
        if (response.accessToken) {
          callMsGraph(response.accessToken).then(response => setGraphData(response));
          getGroupNames(response.accessToken).then(response => {
            response.value.forEach(group => {
              if (group.displayName.startsWith("airline") == true) {
                setAirline(group.displayName.replace("airline-", ""));
                console.log(airline)
              }
            });
          });
          setToken(response.accessToken);


          return response.accessToken;
        }
        return null;
      });
    }
  }, [inProgress, accounts, instance]);

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

  const renderGrid = () => {
    setRowData(items);
    ///let rowData = [];

  }

  const bulkLoad = async () => {
    setDisable(true);
    setShow(true);
    let created = [];
    let notCreated = [];
    let label;
    var accessToken = await login();
    let count = gridRef.current.api.getDisplayedRowCount();
    if (items.length != 0) {
      setLoader(<>
        <Spinner animation="border" size="sm" /></>);
      setLoader2(<>
        <Spinner animation="border" size="sm" /></>);
    }
    gridRef.current.api.forEachNode(async (node) => {
      //rowData.push(node.data);
      let status = await createUser(node.data, accessToken);
      console.log(node.data)
      if (status == "Created") {
        setCheck("true")
        created.push(node.data);
        setStatusLabel(node.data.user)
      }
      else {
        notCreated.push(node.data);

      }
      count--;
      if (count == 0) {
        setNotCreated(notCreated);
        setCreated(created);
        setnotCreatedCount(notCreated.length);
        setCreatedCount(created.length);
        const DisplayData = notCreated.map(
          (info) => {
            return (
              <tr key={(info.user)} className="table-danger">
                <td>{info.user}</td>
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
        setShow(true);
        setDisable(false);
        setLoader("Done!");
        setLoader2("");



        //callback();
      }

    });

  }

  const callback = (notCreated, created) => {
    setLoader("Done!");
    setCreated(created);
    //setNotCreated(notCreated);
    JsonDataDisplay(notCreated);
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

  const createUser = async (data, accessToken) => {

    const headers = new Headers();
    const bearer = `Bearer ${accessToken}`;
    headers.append("Authorization", bearer);
    headers.append("Content-Type", "application/json");

    var body = JSON.stringify({
      "userPrincipalName": `${data.user}`,
      "givenName": `${data.first}`,
      "surname": `${data.last}`,
      "displayName": `${data.first} ${data.last}`,
      "password": "Boeing12",
      "forceChangePasswordNextLogin": "false",
      "otherMails": [
        `${data.email}`
      ],
      "airlineGroupName": `airline-${airline}`,
      "roleGroupName": `${data.role}`
    });

    const options = {
      method: "POST",
      headers: headers,
      body: body
    };

    let res = await fetch(process.env.REACT_APP_USERS_CREATE_URI, options);
    let x = await res.text();
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

  const JsonDataDisplay = (notCreated) => {


  }

  return (
    <div>
      <div className="page-header">
        <h3 className="page-title"> User Management </h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><a href="!#" onClick={event => event.preventDefault()}>User Management</a></li>
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
                      onChange={(e) => {
                        setDisable(false);
                        const file = e.target.files[0];
                        readExcel(file);
                      }}
                    />
                    <Form.Text >
                      .xls, xlsx.
                    </Form.Text>
                  </Form.Group>
                </Form>
              }
              <button type="submit" disabled={disable} size="sm" className="btn btn-primary btn-sm" onClick={renderGrid}>
                Upload
              </button>

            </div>
          </div>
        </div>


        <div className="col-sm-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Bulk Load</h4>
              <p className="card-description"> Airline <code>{airline}</code>
              </p>

              <div className="ag-theme-alpine-dark" style={{ width: '100%', height: 475 }}>
                <AgGridReact
                  ref={gridRef}
                  rowData={rowData}
                  rowSelection="single"
                  defaultColDef={{ resizable: true, editable: true, cellEditorPopup: false }}
                  animateRows={true}
                  onGridReady={onGridReady}
                  //onFirstDataRendered={autoSizeColumns}
                  enableCellTextSelection={true}>
                  <AgGridColumn field="first" sortable={true} filter={true} hide={false}></AgGridColumn>
                  <AgGridColumn field="last" sortable={true} filter={true}></AgGridColumn>
                  <AgGridColumn field="user" sortable={true} filter={true} hide={false}></AgGridColumn>
                  <AgGridColumn field="email" sortable={true} filter={true}></AgGridColumn>
                  <AgGridColumn field="role" sortable={true} filter={true}></AgGridColumn>
                </AgGridReact>

              </div>
            </div>
          </div>
        </div>

        <div className="col-sm-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <button type="submit" disabled={disable} size="sm" className="btn btn-primary btn-lg btn-block" onClick={bulkLoad}>
                {loader}
              </button>
            </div>
          </div>
        </div>

        <Modal show={show} size="lg" onHide={handleClose} scrollable="true" backdrop="static"
          keyboard={false}>
          <Modal.Header closeButton>
            <Modal.Title>Bulk Load Status {loader2}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <>
              Created: {statusLabel}
              {
                check
                  ?
                  <i class="mdi mdi-checkbox-marked-circle-outline text-success"></i>
                  :
                  <></>
              }
              <br></br>
              Created Users: {createdCount}
              <br></br>
              Users with errors: {notCreatedCount}
            </>
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
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleClose}>
              OK
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal

          onHide={handleClose}
          backdrop="static"
          keyboard={false}
          scrollable={true}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>Modal title</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <>
              Created: {statusLabel} <i class="mdi mdi-account-search"></i>
              Created Users: {createdCount}. Users with errors: {notCreatedCount}
            </>

          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary">Understood</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );

}

