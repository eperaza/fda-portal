import React, { useEffect, useState, useRef } from 'react';
import { ListUsers } from "../components/ListUsers";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../../authConfig";
import { callMsGraph, getGroupNames, getAllGroups } from "../../graph";
import { ListRoles } from '../components/ListRoles';

export const Roles = () => {

  const { instance, accounts, inProgress } = useMsal();
  const [graphData, setGraphData] = useState([]);
  const [token, setToken] = useState();
  const [airline, setAirline] = useState();
  const [groupId, setGroupId] = useState();
  const [objectId, setObjectId] = useState();
  const [role, setRole] = useState();
  const [dirRole, setDirRole] = useState();
  const [roles, setRoles] = useState([]);
  const [airlineId, setAirlineId] = useState();

  let accessToken = null;
  React.useEffect(() => {
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
              if (group.displayName.startsWith("role") == true) {
                setRole(group.displayName.replace("role-", ""));
              }
              if (group.displayName.includes("User Administrator") == true) {
                setDirRole(group.displayName);
              }
            });
          });
          getAllGroups(response.accessToken).then(response => {
            let roles = [];
            response.value.forEach(group => {
              if (group.displayName.startsWith("role") == true) {
                roles.push(group.displayName);
              }
            });
            setRoles(roles);
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
        <h3 className="page-title">Roles</h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><a onClick={event => event.preventDefault()}>User Management</a></li>
            <li className="breadcrumb-item active" aria-current="page">Roles</li>
          </ol>
        </nav>
      </div>
      {
        groupId
          ?
          <ListRoles groupId={groupId} token={token} airline={airline} airlineId={airlineId} role={role} dirRole={dirRole} graphData={graphData} objectId={objectId} roles={roles} />
          :
          <div></div>
      }

    </div>
  );

}

