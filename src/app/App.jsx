import React, { Component, useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import './App.scss';
import { Navbar } from './shared/Navbar';
import Sidebar from './shared/Sidebar';
import Footer from './shared/Footer';
import { withTranslation } from "react-i18next";
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "@azure/msal-react";
import { BrowserRouter as Router, Route, Link, useParams } from 'react-router-dom';
import { loginRequest } from "../authConfig";
import { callMsGraph, getGroupNames } from "../graph";
import { Login } from './user-pages/Login';
import { Switch, Redirect } from 'react-router-dom';
import { useIsAuthenticated } from "@azure/msal-react";
import { SignInButton } from "./basic-ui/SignInButton";
import { SignOutButton } from "./basic-ui/SignOutButton";
import { Dashboard } from "./dashboard/Dashboard";
import { BulkLoad } from "./users/BulkLoad";
import { BulkLoad2 } from "./users/BulkLoad2";
import { UserGrid } from "./users/UserGrid";
import { FDR } from "./user-pages/FDR";

const App = () => {
  const isAuthenticated = useIsAuthenticated();

  const { instance, accounts, inProgress } = useMsal();
  const [graphData, setGraphData] = useState([]);
  const [groupName, setGroupName] = useState([]);
  const [token, setToken] = useState();
  const [airline, setAirline] = useState();
  const [groupId, setGroupId] = useState();

  let accessToken = null;

  useEffect(() => {
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
          console.log(response.accessToken)
          return response.accessToken;
        }
        return null;
      });
    }



  }, [inProgress, accounts, instance, token]);

  return (
    <div className="App">
      <Router>
        <AuthenticatedTemplate>

          <Route path="/" exact render={() => {
            return (
              <div>
                <div className="container-scroller">
                  {<Sidebar account={accounts[0].name} membership={`airline-${airline}`} />}
                  <div className="container-fluid page-body-wrapper">
                    {<Navbar account={accounts[0].name} />}
                    <div className="main-panel">
                      <div className="content-wrapper">
                        {
                          airline
                            ?
                            <Dashboard airline={airline} token={token} graphData={graphData} groupId={groupId}></Dashboard>
                            :
                            <></>
                        }
                      </div>
                      {<Footer />
                      }
                    </div>
                  </div>
                </div>
              </div>

            );
          }}
          />
          <Route path="/users/UserGrid" exact render={() => {
            return (
              <div>
                <div className="container-scroller">
                  {<Sidebar account={accounts[0].name} membership={`airline-${airline}`} />}
                  <div className="container-fluid page-body-wrapper">
                    {<Navbar account={accounts[0].name} />}
                    <div className="main-panel">
                      <div className="content-wrapper">
                        <UserGrid />
                      </div>
                      {<Footer />
                      }
                    </div>
                  </div>
                </div>
              </div>

            );
          }}
          />
          <Route path="/users/BulkLoad" exact render={() => {
            return (
              <div>
                <div className="container-scroller">
                  {<Sidebar account={accounts[0].name} membership={`airline-${airline}`} />}
                  <div className="container-fluid page-body-wrapper">
                    {<Navbar account={accounts[0].name} />}
                    <div className="main-panel">
                      <div className="content-wrapper">
                        {
                          airline
                            ?
                            <BulkLoad airline={airline} />
                            :
                            <div></div>
                        }
                      </div>
                      {<Footer />
                      }
                    </div>
                  </div>
                </div>
              </div>

            );
          }}
          />
          <Route path="/users/BulkLoad2" exact render={() => {
            return (
              <div>
                <div className="container-scroller">
                  {<Sidebar account={accounts[0].name} membership={`airline-${airline}`} />}
                  <div className="container-fluid page-body-wrapper">
                    {<Navbar account={accounts[0].name} />}
                    <div className="main-panel">
                      <div className="content-wrapper">
                        {
                          airline
                            ?
                            <BulkLoad2 airline={airline} />
                            :
                            <div></div>
                        }
                      </div>
                      {<Footer />
                      }
                    </div>
                  </div>
                </div>
              </div>
            );
          }}
          />
          <Route path="/user-pages/FDR" exact render={() => {
            return (
              <div>
                <div className="container-scroller">
                  {<Sidebar account={accounts[0].name} membership={`airline-${airline}`} />}
                  <div className="container-fluid page-body-wrapper">
                    {<Navbar account={accounts[0].name} />}
                    <div className="main-panel">
                      <div className="content-wrapper">
                        <FDR />
                      </div>
                      {<Footer />
                      }
                    </div>
                  </div>
                </div>
              </div>

            );
          }}
          />


        </AuthenticatedTemplate>

        <UnauthenticatedTemplate>

          <Route path="/" exact render={() => {
            return (
              <div>
                <br></br>                        <br></br>
                <br></br>
                <Login></Login>
              </div>
            );
          }}
          />
        </UnauthenticatedTemplate>



      </Router>
    </div>
  );
};

export default App;

