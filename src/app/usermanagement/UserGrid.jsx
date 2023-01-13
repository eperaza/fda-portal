import React, { useEffect, useState, useRef } from 'react';
import { ListUsers } from "../components/ListUsers";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../../authConfig";
import { callMsGraph, getGroupNames } from "../../graph";

//import '../bootstrap.scss';


export const UserGrid = (props) => {

  const { instance, accounts, inProgress } = useMsal();
  const [graphData, setGraphData] = useState([]);
  const [token, setToken] = useState();
  const [airline, setAirline] = useState();
  const [groupId, setGroupId] = useState();
  const [objectId, setObjectId] = useState();
  const [role, setRole] = useState();
  const [dirRole, setDirRole] = useState();
  const [roles, setRoles] = useState([]);

  let accessToken = null;

  React.useEffect(() => {
    if (inProgress === "none" && accounts.length > 0) {
      // Retrieve an access token
      accessToken = instance.acquireTokenSilent({
        account: accounts[0],
        ...loginRequest
      }).then(async response => {
        if (response.accessToken) {
          callMsGraph(response.accessToken).then(response => setGraphData(response));
          getGroupNames(response.accessToken).then(response => {
            response.value.forEach(group => {
              if (group.displayName.startsWith("airline") == true) {
                //setAirline(group.displayName.replace("airline-", ""));
                setGroupId(group.id);
              }
              if (group.displayName.startsWith("role") == true) {
                setRole(group.displayName.replace("role-", ""));
              }
              if (group.displayName.includes("User Administrator") == true) {
                setDirRole(group.displayName);
              }

            });
          });

          setToken(response.accessToken);
          setObjectId(response.uniqueId);

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
            <li className="breadcrumb-item"><a onClick={event => event.preventDefault()}>User Management</a></li>
            <li className="breadcrumb-item active" aria-current="page">Users</li>
          </ol>
        </nav>
      </div>
      {
        groupId
          ?
          <ListUsers groupId={groupId} token={token} airline={props.airline} role={role} dirRole={dirRole} graphData={graphData} objectId={objectId} />
          :
          <div></div>
      }

    </div>
  );

}

