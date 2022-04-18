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
import { ListAirlinePreferences } from '../user-pages/ListAirlinePreferences';

export const Preferences = (props) => {

  const [TSP, setTSP] = useState(<>
    <Stack spacing={1.5}>
      <Skeleton variant="text" width="60%" sx={{ bgcolor: "grey.900" }} />
    </Stack>
  </>);
  
  useEffect(() => {
    
  }, []);

  

  return (
    <div>
      <div className="page-header">
                <h3 className="page-title">Preferences</h3>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a onClick={event => event.preventDefault()}>User Management</a></li>
                        <li className="breadcrumb-item active" aria-current="page">Preferences</li>
                    </ol>
                </nav>
            </div>
      <div className="row">
        
        <div className="col-md-6 grid-margin stretch-card">
          <div className="card">
            <div className="card-body" style={{ overflowY: 'scroll', height: 300, marginBottom: 20 }} >
              <div className="d-flex flex-row justify-content-between">
                <h4 className="card-title mb-1">Units of Measurement:</h4>
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
                <h4 className="card-title mb-1">Units of Measurement:</h4>
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
                <h4 className="card-title mb-1">Notification Triggers:</h4>
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
      </div>

      <div className="row">
        
        
        <div className="col-md-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body" style={{ overflowY: 'scroll', height: 500, marginBottom: 20 }} >
              <div className="d-flex flex-row justify-content-between">
                <h4 className="card-title mb-1">Airline Preferences:</h4>
                <p className="text-muted mb-1">User preferences</p>
              </div >
              {

                props.groupId
                  ?

                  <ListAirlinePreferences token={props.token} airline={props.airline} />
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
