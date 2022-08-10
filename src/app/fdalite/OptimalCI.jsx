import React, { useEffect, useState, useRef } from 'react';
import { ListUsers } from "../components/ListUsers";
import { useMsal } from "@azure/msal-react";
import { BlobServiceClient } from "@azure/storage-blob";
import { loginRequest } from "../../authConfig";
import { callMsGraph, getGroupNames } from "../../graph";
import Form from "react-bootstrap/Form";
import Alert from 'react-bootstrap/Alert';
import { Accordion, Card } from "react-bootstrap";
import Button from "react-bootstrap/Button";

export const OptimalCI = (props) => {

    const [showAlert, setShowAlert] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [createLabel, setCreateLabel] = useState("Create Role");
    const [showAlertText, setShowAlertText] = useState();
    const [showSuccessText, setShowSuccessText] = useState();


    const [isError, setIsError] = useState(false);

    const file = useRef();

    const [tail, setTail] = useState(),
        onInputTail = ({ target: { value } }) => setTail(value);
    const [grossWeight, setGrossWeight] = useState(),
        onInputGW = ({ target: { value } }) => setGrossWeight(value);
    const [flightLevel, setFlightLevel] = useState(),
        onInputFL = ({ target: { value } }) => setFlightLevel(value);
    const [SAT, setSAT] = useState(),
        onInputSAT = ({ target: { value } }) => setSAT(value);

    useEffect(() => {
        listFiles()
    }, []);

    const listFiles = async () => {
        // Update <placeholder> with your Blob service SAS URL string
        const blobSasUrl = "https://fdagroundstorage.blob.core.windows.net/?sv=2021-06-08&ss=bfqt&srt=sco&sp=rwdlacupitfx&se=2100-06-19T11:59:27Z&st=2022-06-19T03:59:27Z&spr=https&sig=mQjWiT59JAr3hyLrubWeoFeHxj57ZpnBkIyFfnTMBcc%3D";

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

    const uploadMobileConfig = async (file) => {
        // Update <placeholder> with your Blob service SAS URL string
        const blobSasUrl = "https://fdagroundstorage.blob.core.windows.net/?sv=2021-06-08&ss=bfqt&srt=sco&sp=rwdlacupitfx&se=2100-06-19T11:59:27Z&st=2022-06-19T03:59:27Z&spr=https&sig=mQjWiT59JAr3hyLrubWeoFeHxj57ZpnBkIyFfnTMBcc%3D";

        // Create a new BlobServiceClient
        const blobServiceClient = new BlobServiceClient(blobSasUrl);

        // Create a unique name for the container by 
        // appending the current time to the file name
        const containerName = "config";

        // Get a container client from the BlobServiceClient
        const containerClient = blobServiceClient.getContainerClient(containerName);

        try {
            const promises = [];

            const blockBlobClient = containerClient.getBlockBlobClient(file.name);
            promises.push(blockBlobClient.uploadBrowserData(file));

            await Promise.all(promises);
            listFiles();
        }
        catch (error) {
        }
    }

    const createAirline = () => {

    }


    return (

        <>
            <div>
                <div className="page-header">
                    <h3 className="page-title">Optimal Cost Index</h3>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a onClick={event => event.preventDefault()}>FDA Lite</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Optimal CI</li>
                        </ol>
                    </nav>
                </div>


            </div>
            <div className='row'>
                <div className="col-sm-3 grid-margin stretch-card">
                    <div className="card">
                        <div className="card-body">
                            <div className="col-9">
                                <div className="d-flex align-items-center align-self-start">
                                    <h4 className="mb-0">Tail #</h4>
                                </div>
                            </div>

                            <div className="" >
                                <div className="">
                                    <div className="col-md-12">
                                        <div className="input-group">
                                            <label className="borderLabelAlt2"><span class="required">* </span></label>
                                            <input
                                                type="text"
                                                className={isError ? "inpError" : "inp2"}
                                                placeholder="Tail"
                                                aria-label="Tail"
                                                onChange={onInputTail}
                                                value={tail}
                                                style={{ borderRadius: 10, fontStyle: 'italic' }}
                                            />

                                        </div>
                                    </div>



                                </div>


                            </div>

                        </div>
                    </div>
                </div>
                <div className="col-sm-3 grid-margin stretch-card">
                    <div className="card">
                        <div className="card-body">
                            <div className="col-9">
                                <div className="d-flex align-items-center align-self-start">
                                    <h4 className="mb-0">Gross Weight</h4>
                                </div>
                            </div>
                            <div className="col-12 grid-margin" >
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="input-group">
                                            <label className="units">kg x 1000</label>

                                            <input
                                                className={isError ? "inpMailTAError" : "inpMailTA2"}
                                                placeholder="Gross Weight"
                                                aria-label="Gross Weight"
                                                onChange={onInputGW}
                                                value={grossWeight}
                                                style={{ borderRadius: 10, fontStyle: 'italic', height: 50 }}
                                            />

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-sm-3 grid-margin stretch-card">
                    <div className="card">
                        <div className="card-body">
                            <div className="col-9">
                                <div className="d-flex align-items-center align-self-start">
                                    <h4 className="mb-0">Flight Level</h4>
                                    <p className="text-success ml-2 mb-0 font-weight-medium">FL</p>

                                </div>
                            </div>
                            <div className="col-12 grid-margin" >
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="input-group">
                                            <label className="units">ft x 100</label>

                                            <input
                                                className={isError ? "inpMailTAError" : "inpMailTA2"}
                                                placeholder="Flight Level"
                                                aria-label="Flight Level"
                                                onChange={onInputFL}
                                                value={flightLevel}
                                                style={{ borderRadius: 10, fontStyle: 'italic', height: 50 }}
                                            />

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-sm-3 grid-margin stretch-card">
                    <div className="card">
                        <div className="card-body">
                            <div className="col-9">
                                <div className="d-flex align-items-center align-self-start">
                                    <h4 className="mb-0">SAT</h4>
                                </div>
                            </div>
                            <div className="col-12 grid-margin" >
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="input-group">
                                            <label className="units">C</label>

                                            <input
                                                className={isError ? "inpMailTAError" : "inpMailTA2"}
                                                placeholder="SAT"
                                                aria-label="SAT"
                                                onChange={onInputSAT}
                                                value={SAT}
                                                style={{ borderRadius: 10, fontStyle: 'italic', height: 50 }}
                                            />

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>




            </div>

            <br></br>

            <br></br>
            <div className="row">
                <div className="col-md-12">
                    <button type="submit" disabled={false} size="sm" className="btn btn-primary btn-lg btn-block" onClick={createAirline}>
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
        </>
    );
}