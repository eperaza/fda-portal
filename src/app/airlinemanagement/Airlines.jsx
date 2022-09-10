import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { ListUsers } from "../components/ListUsers";
import { useMsal } from "@azure/msal-react";
import { BlobServiceClient } from "@azure/storage-blob";
import { loginRequest } from "../../authConfig";
import { createGroup } from "../../graph";
import Form from "react-bootstrap/Form";
import { Button } from 'react-bootstrap';
import Modal from "react-bootstrap/Modal";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { styled } from "@mui/material/styles";
import { ConfigDropZone } from '../components/ConfigDropZone';
import JSZip from "jszip";
import { CreateAirlinePreferencesForm } from '../components/CreateAirlinePreferencesForm';
import { getAllGroups } from "../../graph";
import { ListFlightProgress } from '../components/ListFlightProgress';
import { CreateFeatureManagementForm } from '../components/CreateFeatureManagementForm';
import { CreateUserPreferencesForm } from '../components/CreateUserPreferencesForm';
import { CreateFlightProgressForm } from '../components/CreateFlightProgressForm';
import { CreateTriggersForm } from '../components/CreateTriggersForm';
import { MultiStepForm, Step } from 'react-multi-form';
import Checkbox from '@mui/material/Checkbox';
import { InstructionsDropZone } from '../components/InstructionsDropZone';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Spinner from 'react-bootstrap/Spinner'
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

const StyledAutocomplete = styled(Autocomplete)({
    "& .MuiInputLabel-outlined:not(.MuiInputLabel-shrink)": {
        // Default transform is "translate(14px, 20px) scale(1)""
        // This lines up the label with the initial cursor position in the input
        // after changing its padding-left.
        transform: "translate(34px, 20px) scale(1);"
    },
    "& .MuiAutocomplete-inputRoot": {
        color: "purple",
        // This matches the specificity of the default styles at https://github.com/mui-org/material-ui/blob/v4.11.3/packages/material-ui-lab/src/Autocomplete/Autocomplete.js#L90
        '&[class*="MuiOutlinedInput-root"] .MuiAutocomplete-input:first-child': {
            // Default left padding is 6px
            paddingLeft: 26,
            color: "white",
            height: 2
        },
        "& .MuiOutlinedInput-notchedOutline": {
            borderRight: "none",
            borderLeft: "none",
            borderTop: "none",
            borderBottom: "none"


        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "red"
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "purple"
        },
        "& .MuiInputBase-input.MuiAutocomplete-input": {
            color: "blue",
            fontSize: 14
        },
        "& .css-14s5rfu-MuiFormLabel-root-MuiInputLabel-root": {
            color: "blue",
            fontSize: 14
        }//<label class=" MuiInputLabel-animated MuiInputLabel-outlined MuiFormLabel-root MuiFormLabel-colorPrimary css-14s5rfu-MuiFormLabel-root-MuiInputLabel-root" data-shrink="false" for="combo-box-demo" id="combo-box-demo-label">ICAO</label>


    }
});

export const Airlines = (props) => {

    const file = useRef();
    const [operators, setOperators] = useState();
    const [isError, setIsError] = useState(false);
    const airlineDescription = useRef(null);
    const [configFiles, setConfigFiles] = useState([]);
    const [instructionFiles, setInstructionFiles] = useState([]);
    const [fileBuffer, setFileBuffer] = useState([]);
    const [zip, setZip] = useState();
    const [loader, setLoader] = useState("Create Airline");
    const [airlinePreferences, setAirlinePreferences] = useState([]);
    const [airlines, setAirlines] = useState([]);
    const [airline, setAirline] = useState("airline-" + props.airline);
    const [userPreferences, setUserPreferences] = useState([]);
    const [flightProgress, setFlightProgress] = useState([]);
    const [triggers, setTriggers] = useState([]);
    const [isMP, setIsMP] = useState(false);
    const [settings, setSettings] = useState();
    const [ICAO, setICAO] = useState("");
    const [featureManagement, setFeatureManagement] = useState([]);
    const [key, setKey] = useState('home');
    const [loader2, setLoader2] = useState("");
    const [statusLoader, setStatusLoader] = useState("");
    const [okDisabled, setOKDisabled] = useState(true);
    const [show, setShow] = useState(false);
    const handleClose = () => {
        setShow(false);
    }
    const [statusText, setStatusText] = useState("");
    const [statusCreateGroup, setStatusCreateGroup] = useState("");
    const [statusUploadConfig, setStatusUploadConfig] = useState("");
    const [statusUploadAirlinePrefs, setStatusUploadAirlinePrefs] = useState("");
    const [statusUploadUserPrefs, setStatusUploadUserPrefs] = useState("");
    const [statusUploadFlightProgress, setStatusUploadFlightProgress] = useState("");
    const [statusUploadTriggers, setStatusUploadTriggers] = useState("");
    const [statusUploadFeatureMgmt, setStatusUploadFeatureMgmt] = useState("");
    const [statusCompleted, setStatusCompleted] = useState("");
    const [skeleton, setSkeleton] = useState(<>
        <br></br>
        <Stack spacing={1.5}>
            <Skeleton variant="rectangular" height={30} sx={{ bgcolor: "grey.900" }} width="25%" />
        </Stack>
    </>);
    const [focalRegistrationStatus, setfocalRegistrationStatus] = useState("");
    const [active, setActive] = React.useState(1);

    useEffect(() => {
        getOperators();
        getAirlinePreferences(airline);
        getFeatureManagement(airline);
        getAirlines();
        //generate zip on files change
        generateZip();

    }, [configFiles, instructionFiles, airline, settings, statusText, ICAO]);

    const generateZip = () => {
        setFileBuffer([]);
        console.log("isMP " + isMP)
        var data = JSON.stringify({
            "isMPForRegistration": `${isMP}`
        });

        for (let file of instructionFiles) {
            fileBuffer.push(file)
        }
        for (let file of configFiles) {
            fileBuffer.push(file)
        }

        var zip = new JSZip();
        zip.file(ICAO.toLowerCase() + ".settings", data);
        for (let file of fileBuffer) {
            zip.file(file.name, file);
        }

        zip.generateAsync({ type: "blob" }).then((content) => {
            console.log(content)
            setZip(content);
        })
    }

    const getOperators = () => {
        const headers = new Headers();

        const options = {
            method: "GET",
            headers: headers
        };

        const code = process.env.REACT_APP_FUNCTION_AIRLINE_OPERATORS_GET_CODE;
        fetch(`${process.env.REACT_APP_FUNCTION_AIRLINE_OPERATORS_GET_URI}?code=${code}`, options)
            .then(response => response.json())
            .then(data => {
                setOperators(data);
                setSkeleton();
            }
            )
            .catch(error => console.log('error', error));
    }

    const getAirlinePreferences = async (airline) => {

        const headers = new Headers();

        const options = {
            method: "GET",
            headers: headers
        };

        const code = process.env.REACT_APP_FUNCTION_AIRLINE_PREFERENCES_GET_CODE;
        fetch(`${process.env.REACT_APP_FUNCTION_AIRLINE_PREFERENCES_GET_URI}?code=${code}&airline=${airline.replace("airline-", "")}`, options)
            .then(response => response.json())
            .then(data => {
                setAirlinePreferences(data);
            }
            )
            .catch(error => console.log('error', error));
    }

    const getFeatureManagement = (airline) => {
        const headers = new Headers();

        const options = {
            method: "GET",
            headers: headers
        };

        const code = process.env.REACT_APP_FUNCTION_FEATURE_MANAGEMENT_GET_CODE;
        fetch(`${process.env.REACT_APP_FUNCTION_FEATURE_MANAGEMENT_GET_URI}?code=${code}&airline=${airline.replace("airline-", "")}`, options)
            .then(response => response.json())
            .then(data => {
                console.log("datos " + data)
                setFeatureManagement(data);
            }
            )
            .catch(error => console.log('error', error));
    }

    const listFiles = async () => {
        // Update <placeholder> with your Blob service SAS URL string
        const blobSasUrl = process.env.REACT_APP_STORAGE_BLOB_SAS_URL;

        // Create a new BlobServiceClient
        const blobServiceClient = new BlobServiceClient(blobSasUrl);

        // Create a unique name for the container by 
        // appending the current time to the file name
        const containerName = "config";

        // Get a container client from the BlobServiceClient
        const containerClient = blobServiceClient.getContainerClient(containerName);

        try {
            let iter = containerClient.listBlobsFlat();
            let blobItem = await iter.next();
            while (!blobItem.done) {
                console.log(blobItem.value.name)

                blobItem = await iter.next();
            }
        } catch (error) {
        }
    };

    const uploadConfig = async (file) => {
        // Update <placeholder> with your Blob service SAS URL string
        const blobSasUrl = process.env.REACT_APP_STORAGE_BLOB_SAS_URL;
        // Create a new BlobServiceClient
        const blobServiceClient = new BlobServiceClient(blobSasUrl);

        // Create a unique name for the container by 
        // appending the current time to the file name
        const containerName = "airline-onboarding-automation";

        // Get a container client from the BlobServiceClient
        const containerClient = blobServiceClient.getContainerClient(containerName);

        try {
            const promises = [];

            const blockBlobClient = containerClient.getBlockBlobClient(ICAO.toLowerCase() + ".zip");
            promises.push(blockBlobClient.uploadBrowserData(zip));

            await Promise.all(promises);
            setStatusUploadConfig('Config uploaded <i class="mdi mdi-checkbox-marked-circle-outline text-success"></i>');
        }
        catch (error) {
            setStatusUploadConfig('Error uploading configuration <i class="mdi mdi mdi-alert-circle text-danger"></i>');
        }

        setStatusCompleted(`Airline [${ICAO}] setup completed <i class="mdi mdi-checkbox-marked-circle-outline text-success"></i></br>`);
        setfocalRegistrationStatus("Waiting for Azure AAD to send focal initial registrations, can take up to 15 seconds...");
    }


    const getAirlines = () => {
        let airlines = [];
        getAllGroups(props.token).then(response => {
            response.value.forEach(group => {
                if (group.displayName.startsWith("airline") == true) {
                    airlines.push(group.displayName);
                }
            });
            setAirlines(airlines);
        });
    }

    const uploadAirlinePreferences = async () => {
        const headers = new Headers();
        const code = process.env.REACT_APP_FUNCTION_AIRLINE_PREFS_INSERT_CODE;

        headers.append("x-functions-key", code);
        headers.append("Content-type", "application/json");

        const options = {
            method: "POST",
            headers: headers,
            body: JSON.stringify(airlinePreferences)
        };

        try {
            let res = await fetch(`${process.env.REACT_APP_FUNCTION_AIRLINE_PREFS_INSERT_URI}?airline=airline-${ICAO.toLowerCase()}&updatedBy=${props.graphData.userPrincipalName.split('@')[0]}`, options);
            let status = res.status;
            console.log(status);
            if (status == 200) {
                setStatusUploadAirlinePrefs('Airline preferences created <i class="mdi mdi-checkbox-marked-circle-outline text-success"></i>')
            }
            else {
                setStatusUploadAirlinePrefs('Error creating airline preferences <i class="mdi mdi mdi-alert-circle text-danger"></i>')
            }
        }
        catch (e) {
            console.log(e);
            setStatusUploadConfig('Error creating airline preferences <i class="mdi mdi mdi-alert-circle text-danger"></i>')
        }
    }

    const uploadFeatureManagement = async () => {
        const headers = new Headers();
        const code = process.env.REACT_APP_FUNCTION_FEATURE_MGMT_INSERT_CODE;

        headers.append("x-functions-key", code);
        headers.append("Content-type", "application/json");

        const options = {
            method: "POST",
            headers: headers,
            body: JSON.stringify(featureManagement)
        };

        try {
            let res = await fetch(`${process.env.REACT_APP_FUNCTION_FEATURE_MGMT_INSERT_URI}?airline=airline-${ICAO.toLowerCase()}&updatedBy=${props.graphData.userPrincipalName.split('@')[0]}`, options);
            let status = res.status;
            console.log(status);
            if (status == 200) {
                setStatusUploadFeatureMgmt('Feature management created <i class="mdi mdi-checkbox-marked-circle-outline text-success"></i>');
            }
            else {
                setStatusUploadFeatureMgmt('Error creating feature management <i class="mdi mdi mdi-alert-circle text-danger"></i>');
            }
        }
        catch (e) {
            console.log(e);
            setStatusUploadFeatureMgmt('Error creating feature management <i class="mdi mdi mdi-alert-circle text-danger"></i>');
        }
    }

    const uploadUserPreferences = async () => {
        const headers = new Headers();
        const code = process.env.REACT_APP_FUNCTION_USER_PREFS_INSERT_CODE;

        headers.append("x-functions-key", code);
        headers.append("Content-type", "application/json");

        console.log(userPreferences)

        const options = {
            method: "POST",
            headers: headers,
            body: JSON.stringify(userPreferences)
        };

        try {
            let res = await fetch(`${process.env.REACT_APP_FUNCTION_USER_PREFS_INSERT_URI}?airline=airline-${ICAO.toLowerCase()}&updatedBy=${props.graphData.userPrincipalName.split('@')[0]}`, options);
            let status = res.status;
            console.log(status);
            if (status == 200) {
                setStatusUploadUserPrefs('User preferences created <i class="mdi mdi-checkbox-marked-circle-outline text-success"></i>')
            }
            else {
                setStatusUploadUserPrefs('Error creating user preferences <i class="mdi mdi mdi-alert-circle text-danger"></i>')
            }

        }
        catch (e) {
            console.log(e);
            setStatusUploadUserPrefs('Error creating user preferences <i class="mdi mdi mdi-alert-circle text-danger"></i>')
        }
    }

    const uploadFlightProgress = async () => {
        const headers = new Headers();
        const code = process.env.REACT_APP_FUNCTION_FLIGHT_PROGRESS_INSERT_CODE;

        headers.append("x-functions-key", code);
        headers.append("Content-type", "application/json");

        console.log(userPreferences)

        const options = {
            method: "POST",
            headers: headers,
            body: JSON.stringify(flightProgress)
        };

        try {
            let res = await fetch(`${process.env.REACT_APP_FUNCTION_FLIGHT_PROGRESS_INSERT_URI}?airline=airline-${ICAO.toLowerCase()}&updatedBy=${props.graphData.userPrincipalName.split('@')[0]}`, options);
            let status = res.status;
            console.log(status);
            if (status == 200) {
                setStatusUploadFlightProgress('Flight progress created <i class="mdi mdi-checkbox-marked-circle-outline text-success"></i>')
            }
            else {
                setStatusUploadFlightProgress('Error creating flight progress <i class="mdi mdi mdi-alert-circle text-danger"></i>')
            }

        }
        catch (e) {
            console.log(e);
            setStatusUploadFlightProgress('Error creating flight progress <i class="mdi mdi mdi-alert-circle text-danger"></i>')
        }
    }

    const uploadTriggers = async () => {
        const headers = new Headers();
        const code = process.env.REACT_APP_FUNCTION_TRIGGERS_INSERT_CODE;

        headers.append("x-functions-key", code);
        headers.append("Content-type", "application/json");

        console.log(userPreferences)

        const options = {
            method: "POST",
            headers: headers,
            body: JSON.stringify(triggers)
        };

        try {
            let res = await fetch(`${process.env.REACT_APP_FUNCTION_TRIGGERS_INSERT_URI}?airline=airline-${ICAO.toLowerCase()}&updatedBy=${props.graphData.userPrincipalName.split('@')[0]}`, options);
            let status = res.status;
            console.log(status);
            if (status == 200) {
                setStatusUploadTriggers('Notification triggers created <i class="mdi mdi-checkbox-marked-circle-outline text-success"></i>')
            }
            else {
                setStatusUploadTriggers('Error creating notification triggers <i class="mdi mdi mdi-alert-circle text-danger"></i>')
            }
        }
        catch (e) {
            console.log(e);
            setStatusUploadTriggers('Error creating airline preferences <i class="mdi mdi mdi-alert-circle text-danger"></i>')
        }
    }

    const createAirlineGroup = () => {
        createGroup(props.token, `airline-${ICAO.toLowerCase()}`, airlineDescription.current.value).then(response => {
            console.log("Airline group created: " + response);
            if (response == 201) {
                setStatusCreateGroup('Airline group created <i class="mdi mdi-checkbox-marked-circle-outline text-success"></i>')
            }
            else {
                setStatusCreateGroup('Error creating group <i class="mdi mdi mdi-alert-circle text-danger"></i>')

            }
        });
    }

    const createInitialRegistrations = async () => {
        let json = null;
        try {
            // Update <placeholder> with your Blob service SAS URL string
            const blobSasUrl = process.env.REACT_APP_STORAGE_BLOB_SAS_URL;
            // Create a new BlobServiceClient
            const blobServiceClient = new BlobServiceClient(blobSasUrl);

            // Create a unique name for the container by 
            // appending the current time to the file name
            const containerName = "airline-onboarding-automation";

            // Get a container client from the BlobServiceClient
            const containerClient = blobServiceClient.getContainerClient(containerName);

            // Create a unique name for the blob
            const blobName = "initial-registration-focals.json";

            // Get a block blob client
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);

            const downloadBlockBlobResponse = await blockBlobClient.download();
            console.log("\nDownloaded blob content...");
            let blob = await (downloadBlockBlobResponse.blobBody)
            json = await (new Response(blob)).json();
            console.log(json)
        }
        catch (e) {
            console.log(e)
        }

        const tokenFDA = await login();
        const headers = new Headers();
        const bearer = `Bearer ${tokenFDA}`;

        headers.append("Authorization", bearer);
        headers.append("Content-Type", "application/json");
        headers.append("Ocp-Apim-Subscription-Key", `${process.env.REACT_APP_APIM_KEY}`);
        var x = "";
        setfocalRegistrationStatus();

        for (let focal of json) {
            console.log(`${focal.userPrincipalName}.${ICAO}`)

            var data = JSON.stringify({
                "userPrincipalName": `${focal.userPrincipalName}.${ICAO.toLowerCase()}`,
                "givenName": `${focal.givenName}`,
                "surname": `${focal.surname}`,
                "displayName": `${focal.givenName} ${focal.surname}`,
                "password": `${process.env.REACT_APP_FDAGROUND_PASS}`,
                "forceChangePasswordNextLogin": "false",
                "otherMails": [
                    `${focal.otherMails}`
                ],
                "airlineGroupName": `airline-${ICAO.toLowerCase()}`,
                "roleGroupName": `role-airlinefocal`
            });

            const options = {
                method: "POST",
                headers: headers,
                body: data
            };

            try {
                let res = await fetch(process.env.REACT_APP_USERS_CREATE_URI, options)
                let data = await res.json();
                if (data.objectId) {
                    x = x + 'Sent focal registration to [' + focal.otherMails + '] successfully <i class="mdi mdi-checkbox-marked-circle-outline text-success"></i></br>';
                    setfocalRegistrationStatus(x)
                }
                else {
                    x = x + 'Error sending focal registration to [' + focal.otherMails + '] <i class="mdi mdi mdi-alert-circle text-danger"></i> -> ' + data.errorDescription + '</br>';
                    setfocalRegistrationStatus(x)
                }
            }
            catch (error) {
                console.log(error);
            }
        }
        setOKDisabled(false);
        setLoader2("OK");
        setStatusLoader();

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

    const createAirline = () => {
        setStatusCompleted()
        setStatusCreateGroup()
        setStatusUploadAirlinePrefs()
        setStatusUploadUserPrefs()
        setStatusUploadConfig()
        setStatusUploadFeatureMgmt()
        setStatusUploadFlightProgress()
        setStatusUploadTriggers()
        setfocalRegistrationStatus()

        if (ICAO == "" || configFiles.length == 0 || instructionFiles.length == 0 || airlinePreferences.length == 0 || userPreferences.length == 0 || flightProgress.length == 0 || triggers == 0) {
            setIsError(true);
            alert("Missing configuration");
        }
        else {
            if (airlineDescription.current.value == "") {
                airlineDescription.current.value = `Airline group for ${ICAO}`;
            }
            setShow(true);
            setLoader2(<><Spinner animation="border" size="sm" /></>);
            setStatusLoader(<><Spinner variant="primary" animation="border" size="sm" /></>);
            setStatusText(`Creating airline [${ICAO}]...`);

            createAirlineGroup();
            uploadAirlinePreferences();
            uploadUserPreferences();
            uploadFlightProgress();
            uploadTriggers();
            uploadFeatureManagement();
            uploadConfig();
            setTimeout(() => {
                createInitialRegistrations();
            }, 18000);
        }

    }

    return (
        <>
            <div>
                <div className="page-header">
                    <h3 className="page-title">Create Airline</h3>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a onClick={event => event.preventDefault()}>Airline Management</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Create Airline</li>
                        </ol>
                    </nav>
                </div>
            </div>
            <MultiStepForm activeStep={active}>
                <Step label='AAD'>
                    <div className="col-xl-12 col-sm-6 grid-margin stretch-card">
                        <div className="card">
                            <div className="card-body">
                                <div className="d-flex flex-row justify-content-between">
                                    <h5 className="card-title mb-1">Airline Information</h5>
                                    <p className="text-muted mb-1">AAD Setup</p>
                                </div >
                                <br></br>
                                {skeleton}
                                {
                                    operators
                                        ?
                                        <StyledAutocomplete


                                            id="combo-box-demo"
                                            getOptionLabel={(option) => option.AirlineID}
                                            options={operators}
                                            sx={{ width: 300 }}
                                            onChange={(event, newValue) => {
                                                try {
                                                    setICAO(newValue.IcaoCode);
                                                }
                                                catch (e) {
                                                    setICAO("");
                                                    console.log(e);
                                                }
                                            }}
                                            renderInput={(params) => <TextField className={isError ? "autocompleteError" : "autocomplete"} {...params} placeholder="ICAO" label="" />}
                                            renderOption={(props, option) => (
                                                <Box component="li" {...props}>

                                                    {option.AirlineID} ({option.Name})
                                                </Box>
                                            )}
                                        />

                                        :
                                        <></>
                                }
                                <br></br>
                                <div className="row col-xl-8 col-sm-6 grid-margin stretch-card">
                                    <div className="input-group">
                                        <label className="borderLabelAlt"></label>
                                        <input
                                            type="text"
                                            className={isError ? "inpError2" : "inp2"}
                                            placeholder="Airline Description"
                                            aria-label="Airline Description"
                                            ref={airlineDescription}
                                            style={{ borderRadius: 10, fontStyle: 'italic' }}
                                        />
                                    </div>
                                </div>
                                <br></br>
                                {
                                    /*
                                    Is .mp for registration?
                                    <Checkbox
                                        defaultChecked={false}
                                        value={isMP}
                                        style={{ color: "#0d6efd" }}
                                        onChange={e => {
                                            setIsMP(e.target.checked);
                                            generateZip();
                                        }}
    
                                    />
                                    */
                                }

                            </div>
                        </div>
                    </div>
                </Step>
                <Step label='Storage'>
                    <div className="col-xl-12 col-sm-6 grid-margin stretch-card">
                        <div className="card">
                            <div className="card-body">
                                <div className="d-flex flex-row justify-content-between">
                                    <h5 className="card-title mb-1">Mobile Configuration</h5>
                                    <p className="text-muted mb-1">Storage Setup</p>
                                </div >
                                <br></br>
                                <ConfigDropZone setConfigFiles={setConfigFiles} />

                            </div>
                        </div>
                    </div>
                    <div className="col-xl-12 col-sm-6 grid-margin stretch-card">
                        <div className="card">
                            <div className="card-body">
                                <div className="d-flex flex-row justify-content-between">
                                    <h5 className="card-title mb-1">Email Instructions</h5>
                                    <p className="text-muted mb-1">Storage Setup</p>
                                </div >
                                <br></br>
                                <InstructionsDropZone setInstructionFiles={setInstructionFiles} />
                            </div>
                        </div>
                    </div>
                </Step>
                <Step label='Db'>
                    <div className="col-xl-6 col-sm-6 grid-margin stretch-card">
                        Select an airline to create a preference snapshot from:
                    </div>
                    <div className="col-xl-6 col-sm-6 grid-margin stretch-card">
                        <div className="input-group" style={{ marginTop: 0 }}>
                            <label className="borderLabel2">clone preferences from</label>
                            <select
                                name="airlines"
                                id="airlines"
                                className={isError ? "inpSelect2" : "inpSelect2"}
                                value={airline}
                                onChange={e => {
                                    getAirlinePreferences(e.target.value);
                                    setAirline(e.target.value);
                                }}
                                style={{ borderRadius: 10, fontStyle: 'italic' }}>
                                <option value="">--Select airline--</option>

                                {
                                    airlines.map((airline) => {
                                        return (
                                            <>
                                                {
                                                    airline !== "airline-fda"
                                                        ?
                                                        <option value={airline}>{airline}</option>
                                                        :
                                                        <></>
                                                }
                                            </>
                                        );
                                    })
                                }
                            </select>
                        </div>
                    </div>

                    <div className="col-xl-6 col-sm-6 grid-margin stretch-card">
                        If you don't want to use a snapshot you can also set them manually:
                    </div>

                    <Tabs
                        id="controlled-tab-example"
                        activeKey={key}
                        onSelect={(k) => setKey(k)}
                        className="mb-3"
                    >
                        <Tab eventKey="home" title="User Preferences">
                            <div className="row">
                                <div className="col-xl-6 col-sm-6 grid-margin stretch-card">
                                    <div className="card">
                                        <div className="card-body">
                                            <div className="d-flex flex-row justify-content-between">
                                                <h5 className="card-title mb-1">User Preferences</h5>
                                                <p className="text-muted mb-1">DB Setup</p>
                                            </div >
                                            {
                                                airlinePreferences
                                                    ?
                                                    <CreateUserPreferencesForm airline={airline} setUserPreferences={setUserPreferences} />
                                                    :
                                                    <></>
                                            }
                                            <br></br>
                                            <div className="d-flex flex-row justify-content-between">
                                                <h5 className="card-title mb-1">Flight Progress Table Default Setting:</h5>
                                                <p className="text-muted mb-1">DB Setup</p>
                                            </div >
                                            Turn on to automatically save values for each flight.
                                            {
                                                airlinePreferences
                                                    ?

                                                    <CreateFlightProgressForm token={props.token} airline={airline} setFlightProgress={setFlightProgress} />
                                                    :
                                                    <div></div>
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-6 col-sm-6 grid-margin stretch-card">
                                    <div className="card">
                                        <div className="card-body">
                                            <div className="d-flex flex-row justify-content-between">
                                                <h5 className="card-title mb-1">Notification Triggers</h5>
                                                <p className="text-muted mb-1">DB Setup</p>
                                            </div >
                                            {
                                                airlinePreferences
                                                    ?

                                                    <CreateTriggersForm token={props.token} airline={airline} setTriggers={setTriggers} />
                                                    :
                                                    <div></div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Tab>
                        <Tab eventKey="profile" title="Airline Preferences">
                            <div className="row">
                                <div className="col-xl-12 col-sm-6 grid-margin stretch-card">
                                    <div className="card">
                                        <div className="card-body">
                                            <div className="d-flex flex-row justify-content-between">
                                                <h5 className="card-title mb-1">Airline Preferences</h5>
                                                <p className="text-muted mb-1">DB Setup</p>
                                            </div >
                                            <br></br>
                                            <div className="row">
                                                <div className="col-3">

                                                </div>
                                                <div className="col-1">
                                                    Enabled
                                                </div>
                                                <div className="col-1">
                                                    Display
                                                </div>
                                                <div className="col-1">
                                                    EFB Admin
                                                </div>
                                                <div className="col-1">
                                                    Focal
                                                </div>
                                                <div className="col-1">
                                                    Check Airmen
                                                </div>
                                                <div className="col-1">
                                                    Pilot
                                                </div>
                                                <div className="col-1">
                                                    Maint.
                                                </div>
                                                <div className="col-2">
                                                    Updated By
                                                </div>
                                            </div>
                                            {
                                                airlinePreferences
                                                    ?
                                                    <CreateAirlinePreferencesForm airlinePreferences={airlinePreferences} airline={airline} graphData={props.graphData} setAirlinePreferences={setAirlinePreferences} />
                                                    :
                                                    <></>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Tab>
                        <Tab eventKey="contact" title="Feature Management">
                            <div className="row">
                                <div className="col-xl-12 col-sm-6 grid-margin stretch-card">
                                    <div className="card">
                                        <div className="card-body">
                                            <div className="d-flex flex-row justify-content-between">
                                                <h5 className="card-title mb-1">Airline Preferences</h5>
                                                <p className="text-muted mb-1">DB Setup</p>
                                            </div >
                                            <br></br>
                                            <div className="row">
                                                <div className="col-3">

                                                </div>
                                                <div className="col-1">
                                                    Enabled
                                                </div>
                                                <div className="col-1">
                                                    Display
                                                </div>
                                                <div className="col-1">
                                                    EFB Admin
                                                </div>
                                                <div className="col-1">
                                                    Focal
                                                </div>
                                                <div className="col-1">
                                                    Check Airmen
                                                </div>
                                                <div className="col-1">
                                                    Pilot
                                                </div>
                                                <div className="col-1">
                                                    Maint.
                                                </div>
                                                <div className="col-2">
                                                    Updated By
                                                </div>
                                            </div>
                                            {
                                                featureManagement
                                                    ?
                                                    <CreateFeatureManagementForm featureManagement={featureManagement} airline={airline} graphData={props.graphData} setFeatureManagement={setFeatureManagement} />
                                                    :
                                                    <></>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Tab>
                    </Tabs>
                </Step>
            </MultiStepForm>

            {
                /*
                {
                    active !== 1 && (
                        <Button onClick={() => setActive(active - 1)}>Previous</Button>
                    )
                }
                {
                    active !== 3 && (
                        <>
                            {
                                ICAO == "" && configFiles.length == 0 && instructionFiles.length == 0
                                    ?
                                    <></>
                                    :
                                    <Button
                                        onClick={() => setActive(active + 1)}
                                        style={{ float: 'right' }}
                                    >
                                        Next
                                    </Button>
                            }
                        </>
                    )
                    
                }
                */
            }

            {
                active === 1 && (
                    <>
                        {
                            ICAO === ""
                                ?
                                <></>
                                :
                                <Button
                                    onClick={() => setActive(active + 1)}
                                    style={{ float: 'right' }}
                                >
                                    Next
                                </Button>
                        }
                    </>
                )
            }
            {
                active === 2 && (
                    <>
                        {
                            configFiles.length === 0 || instructionFiles.length === 0
                                ?
                                <></>
                                :
                                <Button
                                    onClick={() => setActive(active + 1)}
                                    style={{ float: 'right' }}
                                >
                                    Next
                                </Button>
                        }
                    </>
                )

            }
            {
                active === 3
                    ?
                    <>
                        <div className="row">
                            <div className="col-sm-12 grid-margin stretch-card">
                                <div className="card">
                                    <div className="card-body">
                                        <button type="submit" disabled={false} size="sm" className="btn btn-primary btn-lg btn-block" onClick={createAirline}>
                                            {loader}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                    :
                    <></>
            }
            {
                active !== 1 && (
                    <Button onClick={() => setActive(active - 1)}>Previous</Button>
                )
            }

            <Modal show={show} size="lg" onHide={handleClose} scrollable="true" backdrop="static" contentClassName={"modal"}
                keyboard={false}>
                <Modal.Header>
                    <Modal.Title>Airline Create Status {statusLoader}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div dangerouslySetInnerHTML={{ __html: statusText }} />
                    <div dangerouslySetInnerHTML={{ __html: statusUploadAirlinePrefs }} />
                    <div dangerouslySetInnerHTML={{ __html: statusUploadUserPrefs }} />
                    <div dangerouslySetInnerHTML={{ __html: statusUploadFlightProgress }} />
                    <div dangerouslySetInnerHTML={{ __html: statusUploadTriggers }} />
                    <div dangerouslySetInnerHTML={{ __html: statusUploadFeatureMgmt }} />
                    <div dangerouslySetInnerHTML={{ __html: statusCreateGroup }} />
                    <div dangerouslySetInnerHTML={{ __html: statusUploadConfig }} />
                    <div dangerouslySetInnerHTML={{ __html: statusCompleted }} />
                    <br></br>
                    <div dangerouslySetInnerHTML={{ __html: focalRegistrationStatus }} />

                </Modal.Body>
                <Modal.Footer>
                    <Button disabled={okDisabled} variant="secondary" onClick={e => {
                        handleClose();
                    }
                    }>
                        {loader2}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>

    );
}