import React, { Component, useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Line, Bar, Pie, Scatter } from 'react-chartjs-2';
import { ListTails } from "../user-pages/ListTails";

export const Dashboard = (props) => {

  const [TSP, setTSP] = useState();
  const [token, setToken] = useState();

  useEffect(() => {
    getTSP();
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

  const getTSPAF = async () => {

    const code = "6A/snQUVOX4rtKd1HOZf54PtHLppaQWsptKRCEXjRr10SE8ktl4zYQ==";
    fetch(`https://fdalitewebfunctiontest.azurewebsites.net/api/getTSP?code=${code}&airline=${props.airline}`)
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
        <div className="col-xl-3 col-sm-6 grid-margin stretch-card">
          <div className="card">
            {
              /* 
              <div className="card-body">
                  <div className="row">
                    <div className="col-9">
                      <div className="d-flex align-items-center align-self-start">
                        <h3 className="mb-0">FDA</h3>
                        <p className="text-info ml-2 mb-0 font-weight-medium"></p>
                      </div>
                    </div>
                    <div className="col-3">
                      <div className="icon icon-box-info ">
                        <span className="mdi mdi-alert-decagram icon-item"></span>
                      </div>
                    </div>
                  </div>
                  <h6 className="text-muted font-weight-normal">v.6.3</h6>
                </div>
                */
            }
          </div>
        </div>
        <div className="col-xl-3 col-sm-6 grid-margin stretch-card">
          <div className="card">
            {
              /*
                <div className="card-body">
                  <div className="row">
                    <div className="col-9">
                      <div className="d-flex align-items-center align-self-start">
                        <h3 className="mb-0">User Mgmt</h3>
                        <p className="text-danger ml-2 mb-0 font-weight-medium"></p>
                      </div>
                    </div>
                    <div className="col-3">
                      <div className="icon icon-box-primary ">
                        <span className="mdi mdi mdi-beta icon-item"></span>
                      </div>
                    </div>
                  </div>
                  <h6 className="text-muted font-weight-normal">BETA v.1.1</h6>
                </div>
              */
            }
          </div>
        </div>
        <div className="col-xl-2 col-sm-6 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-9">
                  <div className="d-flex align-items-center align-self-start">
                    <h3 className="mb-0"></h3>
                    <p className="text-success ml-2 mb-0 font-weight-medium"></p>
                  </div>
                </div>
                <div className="col-3">
                  <div className="">
                    <span className=""></span>
                  </div>
                </div>
              </div>
              <h6 className="text-muted font-weight-normal"></h6>
            </div>
          </div>
        </div>
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
                          <h6 className="preview-subject">airline-focal</h6>
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
                <p className="text-muted mb-1">Last month</p>
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
      </div>




    </div>
  );

}
