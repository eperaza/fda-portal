import React, { Component, useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Line, Bar, Pie, Scatter } from 'react-chartjs-2';
import { ListTails } from "../user-pages/ListTails";
import Spinner from 'react-bootstrap/Spinner';
import { ListPreferences } from '../user-pages/ListPreferences';
import { ListTriggers } from '../user-pages/ListTriggers';
import { ListFlightProgress } from '../user-pages/ListFlightProgress';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

export const Dashboard = (props) => {

  const [TSP, setTSP] = useState(<>
    <Stack spacing={1.5}>
      <Skeleton variant="text" width="60%" sx={{ bgcolor: "grey.900" }} />
    </Stack>
  </>);
  const [token, setToken] = useState();
  const [flightSource, setFlightSource] = useState(true);
  const [lastFlight, setLastFlight] = useState(true);
  const [dbConnectionOK, setDbConnectionOK] = useState(true);


  useEffect(() => {
    getTSPAF();
    getAirlineStatus();
  }, []);

  const getTSP = async () => {
    //const token = await login();
    const headers = new Headers();
    const bearer = `Bearer ${props.token}`;

    headers.append("Authorization", bearer);
    headers.append("Airline", `airline-${props.airline}`);
    headers.append("Ocp-Apim-Subscription-Key", `${process.env.REACT_APP_APIM_KEY}`);

    var requestOptions = {
      method: "GET",
      headers: headers
    };
    console.log(requestOptions)

    fetch(process.env.REACT_APP_TSP_GET_URI, requestOptions)
      .then(response => response.text())
      .then(data => {
        if (data != "") {
          setTSP(data);
        }
        else {
          setTSP("TSP Not Found");
        }
      }
      )
      .catch(error => console.log('error', error));
  }

  const getAirlineStatus = async () => {
    //const token = await login();
    const headers = new Headers();
    const bearer = `Bearer ${props.token}`;

    headers.append("Authorization", bearer);
    headers.append("Content-Type", "application/json");
    headers.append("Ocp-Apim-Subscription-Key", `${process.env.REACT_APP_APIM_KEY}`);

    var requestOptions = {
      method: "GET",
      headers: headers
    };

    fetch(`${process.env.REACT_APP_AIRLINE_STATUS_GET_URI}?airline=${props.airline}`, requestOptions)
      .then(response => response.json())
      .then(data => {
        try {
          if (data[1].content[0].source.airline = !undefined) {
            setFlightSource(true);
          }
          else {
            setFlightSource(false);
          }
        }
        catch (error) {
          setFlightSource(false);
        }

        try {
          if (data[1].content[1].lastFlight[0].id = !undefined) {
            setLastFlight(true);
          }
          else {
            setLastFlight(false);
          }
        }
        catch (error) {
          setLastFlight(false);
        }

        if (data[2].status == "OK") {
          setDbConnectionOK(true);
        }
        else {
          setDbConnectionOK(false);
        }
      }
      )
      .catch(error => console.log('error', error));
  }

  const getTSPAF = async () => {

    const code = process.env.REACT_APP_FUNCTION_TSP_GET_CODE;
    fetch(`${process.env.REACT_APP_FUNCTION_TSP_GET_URI}?code=${code}&airline=${props.airline}`)
      .then(response => response.text())
      .then(data => {
        if (data != "") {
          setTSP(data);
        }
        else {
          setTSP("TSP Not Found");
        }
      }
      )
      .catch(error => console.log('error', error));
  }



  return (
    <div>
      <div className="row">
        <div className="col-xl-4 col-sm-6 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-9">
                  <div className="d-flex align-items-center align-self-start">
                    <h3 className="mb-0">TSP</h3>
                    <p className="text-success ml-2 mb-0 font-weight-medium">newest</p>
                  </div>
                </div>
                <div className="col-3">
                  <div className="icon icon-box-success ">
                    <span className="mdi mdi-new-box icon-item"></span>
                  </div>
                </div>
              </div>
              <h6 className="text-muted font-weight-normal">{TSP}
              </h6>
            </div>
          </div>
        </div>
        <div className="col-xl-4 col-sm-6 grid-margin stretch-card">
          <div className="card">
            {
              dbConnectionOK
                ?
                <div className="card-body">
                  <div className="row">
                    <div className="col-9">
                      <div className="d-flex align-items-center align-self-start">
                        <h3 className="mb-0">DB Status</h3>
                        <p className="text-info ml-2 mb-0 font-weight-medium"></p>
                      </div>
                    </div>
                    <div className="col-3">
                      <div className="icon icon-box-success ">
                        <span className="mdi mdi mdi-database icon-item"></span>
                      </div>
                    </div>
                  </div>
                  <h6 className="text-muted font-weight-normal">
                    UP <i className='mdi mdi-check icon-item text-success'> </i>
                  </h6>
                </div>
                :
                <div className="card-body">
                  <div className="row">
                    <div className="col-9">
                      <div className="d-flex align-items-center align-self-start">
                        <h3 className="mb-0">Database</h3>
                        <p className="text-info ml-2 mb-0 font-weight-medium"></p>
                      </div>
                    </div>
                    <div className="col-3">
                      <div className="icon icon-box-danger ">
                        <span className="mdi mdi-database-alert icon-item"></span>
                      </div>
                    </div>
                  </div>
                  <h6 className="text-muted font-weight-normal">
                    Offline <i className='mdi mdi-alert-circle icon-item text-danger'> </i>
                  </h6>
                </div>
            }
          </div>
        </div>
        {<div className="col-xl-4 col-sm-6 grid-margin stretch-card">
          <div className="card">
            {
              flightSource && lastFlight
                ?
                <div className="card-body">
                  <div className="row">
                    <div className="col-9">
                      <div className="d-flex align-items-center align-self-start">
                        <h3 className="mb-0">Flight Plans</h3>
                        <p className="text-info ml-2 mb-0 font-weight-medium"></p>
                      </div>
                    </div>
                    <div className="col-3">
                      <div className="icon icon-box-success ">
                        <span className="mdi mdi-check-circle icon-item"></span>
                      </div>
                    </div>
                  </div>
                  <h6 className="text-muted font-weight-normal">
                    Source <i className='mdi mdi-check icon-item text-success'> </i>
                    DB Connection <i className='mdi mdi-check icon-item text-success'></i>
                  </h6>
                </div>
                :
                <div className="card-body">
                  <div className="row">
                    <div className="col-9">
                      <div className="d-flex align-items-center align-self-start">
                        <h3 className="mb-0">Flight Plans</h3>
                        <p className="text-info ml-2 mb-0 font-weight-medium"></p>
                      </div>
                    </div>
                    <div className="col-3">
                      <div className="icon icon-box-danger ">
                        <span className="mdi mdi-alert-circle icon-item"></span>
                      </div>
                    </div>
                  </div>
                  <h6 className="text-muted font-weight-normal">
                    Source
                    {
                      flightSource
                        ?
                        <i className='mdi mdi-check icon-item text-success'> </i>
                        :
                        <i className='mdi mdi-close icon-item text-danger'> </i>
                    }
                    DB Connection
                    {
                      lastFlight
                        ?
                        <i className='mdi mdi-check icon-item text-success'> </i>
                        :
                        <i className='mdi mdi-close icon-item text-danger'> </i>
                    }
                  </h6>
                </div>
            }
          </div>
        </div>}
      </div>
      <div className="row">
        <div className="col-md-8 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <div className="d-flex flex-row justify-content-between">
                <h4 className="card-title mb-1">User Info:</h4>
                <p className="text-muted mb-1">User claims</p>
              </div>
              <div className="row">
                <div className="col-12">
                  <div className="preview-list">
                    <div className="preview-item border-bottom">
                      <div className="">
                        <div className="preview-icon bg-primary">
                          <i className=""></i>
                        </div>
                      </div>
                      <div className="preview-item-content d-sm-flex flex-grow">
                        <div className="flex-grow">
                          <h6 className="preview-subject">{
                            props.airline.toUpperCase()
                          }</h6>
                          <p className="text-muted mb-0">Airline</p>
                        </div>
                      </div>
                    </div>
                    <div className="preview-item border-bottom">
                      <div className="">
                        <div className="preview-icon bg-success">
                          <i className=""></i>
                        </div>
                      </div>
                      <div className="preview-item-content d-sm-flex flex-grow">
                        <div className="flex-grow">
                          <h6 className="preview-subject">{
                            props.graphData.givenName
                          }</h6>
                          <p className="text-muted mb-0">Name</p>
                        </div>

                      </div>
                    </div>
                    <div className="preview-item border-bottom">
                      <div className="">
                        <div className="preview-icon bg-info">
                          <i className=""></i>
                        </div>
                      </div>
                      <div className="preview-item-content d-sm-flex flex-grow">
                        <div className="flex-grow">
                          <h6 className="preview-subject">{
                            props.graphData.surname
                          }</h6>
                          <p className="text-muted mb-0">Last Name</p>
                        </div>

                      </div>
                    </div>
                    <div className="preview-item border-bottom">
                      <div className="">
                        <div className="preview-icon bg-danger">
                          <i className=""></i>
                        </div>
                      </div>
                      <div className="preview-item-content d-sm-flex flex-grow">
                        <div className="flex-grow">
                          <h6 className="preview-subject">{
                            props.graphData.userPrincipalName
                          }</h6>
                          <p className="text-muted mb-0">User ID</p>
                        </div>

                      </div>
                    </div>
                    <div className="preview-item">
                      <div className="">
                        <div className="preview-icon bg-warning">
                          <i className=""></i>
                        </div>
                      </div>
                      <div className="preview-item-content d-sm-flex flex-grow">
                        <div className="flex-grow">
                          <h6 className="preview-subject">
                            {

                              props.role == "airlinesuperadmin"
                                ?
                                <>
                                  {props.role}<i className='mdi mdi-shield-star icon-item mdi-18px text-info'></i>
                                </>
                                :
                                <>
                                  {props.role}
                                </>
                            }
                          </h6>
                          <p className="text-muted mb-0">Role</p>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4 grid-margin stretch-card">
          <div className="card">
            <div className="card-body" style={{ overflowY: 'scroll', height: 450, marginBottom: 20 }} >
              <div className="d-flex flex-row justify-content-between">
                <h4 className="card-title mb-1">Tails:</h4>
                <p className="text-muted mb-1">FDR files</p>
              </div >
              {

                props.groupId
                  ?

                  <ListTails groupId={props.groupId} token={props.token} airline={props.airline} />
                  :
                  <div></div>
              }

            </div>
          </div>
        </div>
        {
          props.role == "airlinesuperadmin"
            ?
            <>
              <div className="col-md-6 grid-margin stretch-card">
                <div className="card">
                  <div className="card-body" style={{ overflowY: 'scroll', height: 300, marginBottom: 20 }} >
                    <div className="d-flex flex-row justify-content-between">
                      <h4 className="card-title mb-1">Units of Measurement Default Settings:</h4>
                      <p className="text-muted mb-1">User preferences</p>
                    </div >
                    {
                      props.groupId
                        ?

                        <ListPreferences token={props.token} airline={props.airline} />
                        :
                        <div></div>
                    }
                    <br></br>
                    <div className="d-flex flex-row justify-content-between">
                      <h4 className="card-title mb-1">Flight Progress Table Default Setting:</h4>
                      <p className="text-muted mb-1">User preferences</p>
                    </div >
                    Turn on to automatically save values for each flight.
                    {
                      props.groupId
                        ?

                        <ListFlightProgress token={props.token} airline={props.airline} />
                        :
                        <div></div>
                    }
                  </div>
                </div>
              </div>
              <div className="col-md-6 grid-margin stretch-card">
                <div className="card">
                  <div className="card-body" style={{ overflowY: 'scroll', height: 450, marginBottom: 20 }} >
                    <div className="d-flex flex-row justify-content-between">
                      <h4 className="card-title mb-1">Notification Trigger Default Settings:</h4>
                      <p className="text-muted mb-1">User preferences</p>
                    </div >
                    {

                      props.groupId
                        ?

                        <ListTriggers token={props.token} airline={props.airline} />
                        :
                        <div></div>
                    }

                  </div>
                </div>
              </div>
            </>
            :
            <></>
        }
      </div>
    </div>
  );

}
