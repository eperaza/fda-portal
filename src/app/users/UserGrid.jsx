import React, { useEffect, useState, useRef } from 'react';
import { ProgressBar } from 'react-bootstrap';
import { ListUsers } from "../user-pages/ListUsers";
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "@azure/msal-react";
import { loginRequest } from "../../authConfig";
import { callMsGraph, getGroupNames } from "../../graph";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Alert from 'react-bootstrap/Alert';
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
//import '../bootstrap.scss';


export const UserGrid = () => {

  const { instance, accounts, inProgress } = useMsal();
  const [graphData, setGraphData] = useState([]);
  const [token, setToken] = useState();
  const [airline, setAirline] = useState();
  const [groupId, setGroupId] = useState();
  const [objectId, setObjectId] = useState();
  const [role, setRole] = useState();
  const [dirRole, setDirRole] = useState();






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
                setGroupId(group.id);
              }
              if(group.displayName.startsWith("role") == true){
                setRole(group.displayName.replace("role-", ""));
              }
              if(group.displayName.includes("User Administrator") == true){
                setDirRole(group.displayName);
              }
            });
          });
          setToken(response.accessToken);
          setObjectId(graphData.objectId);

          return response.accessToken;
        }
        return null;
      });
    }



  }, [inProgress, accounts, instance, token]);

  return (
    <div>
      <div className="page-header">
        <h3 className="page-title">Users</h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><a href="!#" onClick={event => event.preventDefault()}>User Management</a></li>
            <li className="breadcrumb-item active" aria-current="page">Users</li>
          </ol>
        </nav>
      </div>
              {
                groupId
                  ?
                  <ListUsers groupId={groupId} token={token} airline={airline} role={role} groupId={groupId} dirRole={dirRole} graphData={graphData}/>
                  :
                  <div></div>
              }
              {
                objectId?objectId:<></>
              }
    </div>
  );

}

