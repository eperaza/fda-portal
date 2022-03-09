import React, { useEffect, useState, useRef } from 'react';
import { ProgressBar } from 'react-bootstrap';
import { ListUsers } from "../user-pages/ListUsers";
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "@azure/msal-react";
import { loginRequest } from "../../authConfig";
import { callMsGraph, getGroupNames } from "../../graph";
import { ListFDR } from "./ListFDR"

//import '../bootstrap.scss';

export const FDR = () => {

  const { instance, accounts, inProgress } = useMsal();
  const [graphData, setGraphData] = useState([]);
  const [groupName, setGroupName] = useState([]);
  const [token, setToken] = useState();
  const [airline, setAirline] = useState();
  const [groupId, setGroupId] = useState();

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
            });
          });
          setToken(response.accessToken);

          return response.accessToken;
        }
        return null;
      });
    }



  }, [inProgress, accounts, instance, token]);

  return (
    <div>
      <div className="page-header">
        <h3 className="page-title">FDR Files</h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><a onClick={event => event.preventDefault()}>FDR Files</a></li>
            <li className="breadcrumb-item active" aria-current="page">Download</li>
          </ol>
        </nav>
      </div>
              {
                groupId
                  ?
                  <ListFDR groupId={groupId} token={token} airline={airline} />
                  :
                  <div></div>
              }
    </div>
  );

}

