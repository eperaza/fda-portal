import { graphConfig } from "./authConfig";

/**
 * Attaches a given access token to a MS Graph API call. Returns information about the user
 * @param accessToken 
 */
export async function callMsGraph(accessToken) {
    const headers = new Headers();
    const bearer = `Bearer ${accessToken}`;

    headers.append("Authorization", bearer);

    const options = {
        method: "GET",
        headers: headers
    };

    return fetch(graphConfig.graphMeEndpoint, options)
        .then(response => response.json())
        .catch(error => console.log(error));
}

export async function getGroupNames(accessToken) {
    const headers = new Headers();
    const bearer = `Bearer ${accessToken}`;

    headers.append("Authorization", bearer);
    
    const options = {
        method: "GET",
        headers: headers,
    };

    return fetch(graphConfig.graphMeEndpoint+"/memberOf", options)
    .then(response => response.json())
    .catch(error => console.log(error));
        
}

export async function getAllGroups(accessToken) {
    const headers = new Headers();
    const bearer = `Bearer ${accessToken}`;

    headers.append("Authorization", bearer);
    
    const options = {
        method: "GET",
        headers: headers,
    };

    return fetch(`https://graph.microsoft.com/v1.0/groups`, options)
    .then(response => response.json())
    .catch(error => console.log(error));
        
}

export async function deleteFromGroup(accessToken, groupId, objectId) {
    const headers = new Headers();
    const bearer = `Bearer ${accessToken}`;

    headers.append("Authorization", bearer);
    
    const options = {
        method: "DELETE",
        headers: headers,
    };

    return fetch(`https://graph.microsoft.com/v1.0/groups/${groupId}/members/${objectId}/$ref`, options)
    .then(response => response.status)
    .catch(error => console.log(error));
        
}

export async function addToGroup(accessToken, groupId, objectId) {
    const headers = new Headers();
    const bearer = `Bearer ${accessToken}`;

    headers.append("Authorization", bearer);
    headers.append("Content-type", "application/json");


    var body = JSON.stringify({
        "@odata.id": `https://graph.microsoft.com/v1.0/directoryObjects/${objectId}`,
    });
    
    const options = {
        method: "POST",
        headers: headers,
        body: body
    };

    return fetch(`https://graph.microsoft.com/v1.0/groups/${groupId}/members/$ref`, options)
    .then(response => response.status)
    .catch(error => console.log(error));
        
}

export async function getDirectoryRoles(accessToken) {
    const headers = new Headers();
    const bearer = `Bearer ${accessToken}`;

    headers.append("Authorization", bearer);
    
    const options = {
        method: "GET",
        headers: headers,
    };

    return fetch("https://graph.microsoft.com/v1.0/directoryRoles", options)
    .then(response => response.json())
    .catch(error => console.log(error));
        
}

async function createGroup(accessToken, groupName, description) {
    const headers = new Headers();
    const bearer = `Bearer ${accessToken}`;

    headers.append("Authorization", bearer);
    headers.append("Content-type", "application/json");


    var body = JSON.stringify({
        "displayName": `${groupName}`,
        "mailEnabled": false,
        "mailNickname": `${groupName}`,
        "securityEnabled": true,    
        "description": `${description}`
    
    });
    
    const options = {
        method: "POST",
        headers: headers,
        body: body
    };

    let res = await fetch(`https://graph.microsoft.com/v1.0/groups`, options);
    let status = res.status;
    let data = await res.json();
    if (status == 201) {
        return data.id;
    }
    else {console.log (status)}
     
}

export async function createRole(accessToken, airlineId, displayName, description) {
    let groupId = await createGroup(accessToken, displayName, description);
    const headers = new Headers();
    const bearer = `Bearer ${accessToken}`;

    headers.append("Authorization", bearer);
    headers.append("Content-type", "application/json");


    var body = JSON.stringify({
        "@odata.id": `https://graph.microsoft.com/v1.0/directoryObjects/${groupId}`

    });
    
    const options = {
        method: "POST",
        headers: headers,
        body: body
    };

    return fetch(`https://graph.microsoft.com/v1.0/groups/${airlineId}/members/$ref`, options)
    .then(response => response.status)
    .catch(error => console.log(error));
    
}

export async function getAirlineRoles(accessToken, airlineId) {
    const headers = new Headers();
    const bearer = `Bearer ${accessToken}`;

    headers.append("Authorization", bearer);
    headers.append("Content-type", "application/json");
    headers.append("ConsistencyLevel", "eventual");


    var body = JSON.stringify({
        "securityEnabledOnly": true               
    });

    const options = {
        method: "GET",
        headers: headers,
    };

    return fetch(`https://graph.microsoft.com/v1.0/groups/${airlineId}/transitiveMembers?$select=displayName,description,createdDateTime,renewedDateTime&$search="displayName:role-"`, options)
    .then(response => response.json())
    .catch(error => console.log(error));
    
}
