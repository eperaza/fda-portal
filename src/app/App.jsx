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
import Spinner from 'react-bootstrap/Spinner';
import { Dashboard } from "./dashboard/Dashboard";
import { BulkLoad } from "./usermanagement/BulkLoad";
import { UserGrid } from "./usermanagement/UserGrid";
import { FDR } from "./fdrfiles/FDR";
import { Error404 } from "./error-pages/Error404";
import { Error401 } from "./error-pages/Error401";
import { Preferences } from './usermanagement/Preferences';
import { Groups, Roles } from './usermanagement/Roles';

const App = () => {

  const isAuthenticated = useIsAuthenticated();
  const { instance, accounts, inProgress } = useMsal();
  const [graphData, setGraphData] = useState([]);
  const [groupName, setGroupName] = useState([]);
  const [token, setToken] = useState();
  const [airline, setAirline] = useState("");
  const [groupId, setGroupId] = useState();
  const [dirRoles, setDirRoles] = useState();
  const [role, setRole] = useState();
  const [featureManagement, setFeatureManagement] = useState([]);

  let accessToken = null;

  useEffect(() => {
    let airline = null;

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
                airline = (group.displayName.replace("airline-", ""));
                getFeatureManagement(airline);
              }
              if (group.displayName.startsWith("role") == true) {
                setRole(group.displayName.replace("role-", ""));
              }
            });
          });
          setToken(response.accessToken);
          return response.accessToken;
        }
        return null;
      });
    }

    setTimeout(() => {
      handleLogin();
    }, 1800000);

  }, [inProgress, accounts, instance, token]);

  const handleLogin = () => {
    instance.loginRedirect(loginRequest).catch(e => {
      console.log(e);
    });
  }

  const getFeatureManagement = (airline) => {

    const code = process.env.REACT_APP_FUNCTION_FEATURE_MANAGEMENT_GET_CODE;
    fetch(`${process.env.REACT_APP_FUNCTION_FEATURE_MANAGEMENT_GET_URI}?code=${code}&airline=${airline}`)
      .then(response => response.json())
      .then(data => {
        if (data != "") {
          console.log(data)
          setFeatureManagement(data);
        }
        else {
          setFeatureManagement(data);
        }
      }
      )
      .catch(error => console.log('error', error));
  }

  const renderRoutes = (role) => {
    featureManagement.forEach(feature =>{

    });
    
    if (role == "airlinefocal" || role == "airlineefbadmin") {
      return (
        <Switch>
          <Route path="/" exact component={() => {
            return (
              <div>
                <div className="container-scroller">
                  {
                    accounts[0]
                      ?
                      <Sidebar account={accounts[0].name} membership={`airline-${airline}`} role={role} />
                      :
                      <></>
                  }
                  <div className="container-fluid page-body-wrapper">
                    {<Navbar account={accounts[0].name} />}
                    <div className="main-panel">
                      <div className="content-wrapper">
                        {
                          airline
                            ?
                            <Dashboard airline={airline} token={token} graphData={graphData} groupId={groupId} role={role}></Dashboard>
                            :
                            <>
                              No airline membership (Unauthorized).
                            </>
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
          <Route path="/dashboard/Dashboard" exact component={() => {
            return (
              <div>
                <div className="container-scroller">
                  {
                    accounts[0]
                      ?
                      <Sidebar account={accounts[0].name} membership={`airline-${airline}`} role={role} />
                      :
                      <></>
                  }
                  <div className="container-fluid page-body-wrapper">
                    {<Navbar account={accounts[0].name} />}
                    <div className="main-panel">
                      <div className="content-wrapper">
                        {
                          airline
                            ?
                            <Dashboard airline={airline} token={token} graphData={graphData} groupId={groupId} role={role}></Dashboard>
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
          <Route path="/usermanagement/UserGrid" exact component={() => {
            return (
              <div>
                <div className="container-scroller">
                  {<Sidebar account={accounts[0].name} membership={`airline-${airline}`} role={role} />}
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
          <Route path="/usermanagement/BulkLoad" exact component={() => {
            return (
              <div>
                <div className="container-scroller">
                  {<Sidebar account={accounts[0].name} membership={`airline-${airline}`} role={role} />}
                  <div className="container-fluid page-body-wrapper">
                    {<Navbar account={accounts[0].name} />}
                    <div className="main-panel">
                      <div className="content-wrapper">
                        {
                          airline
                            ?
                            <BulkLoad airline={airline} token={token} />
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
          <Route path="/fdrfiles/FDR" exact component={() => {
            return (
              <div>
                <div className="container-scroller">
                  {<Sidebar account={accounts[0].name} membership={`airline-${airline}`} role={role} />}
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
          <Route path="*" exact component={() => {
            return (
              <div>
                <Error404 style={{}} />
              </div>
            );
          }}
          />
        </Switch>
      )
    }
    else if (role == "airlinesuperadmin") {
      return (
        <Switch>
          <Route path="/" exact component={() => {
            return (
              <div>
                <div className="container-scroller">
                  {
                    accounts[0]
                      ?
                      <Sidebar account={accounts[0].name} membership={`airline-${airline}`} role={role} />
                      :
                      <></>
                  }
                  <div className="container-fluid page-body-wrapper">
                    {<Navbar account={accounts[0].name} />}
                    <div className="main-panel">
                      <div className="content-wrapper">
                        {
                          airline
                            ?
                            <Dashboard airline={airline} token={token} graphData={graphData} groupId={groupId} role={role}></Dashboard>
                            :
                            <>
                              No airline membership (Unauthorized).
                            </>
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
          <Route path="/dashboard/Dashboard" exact component={() => {
            return (
              <div>
                <div className="container-scroller">
                  {
                    accounts[0]
                      ?
                      <Sidebar account={accounts[0].name} membership={`airline-${airline}`} role={role} />
                      :
                      <></>
                  }
                  <div className="container-fluid page-body-wrapper">
                    {<Navbar account={accounts[0].name} />}
                    <div className="main-panel">
                      <div className="content-wrapper">
                        {
                          airline
                            ?
                            <Dashboard airline={airline} token={token} graphData={graphData} groupId={groupId} role={role}></Dashboard>
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
          <Route path="/usermanagement/UserGrid" exact component={() => {
            return (
              <div>
                <div className="container-scroller">
                  {<Sidebar account={accounts[0].name} membership={`airline-${airline}`} role={role} />}
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
          <Route path="/usermanagement/BulkLoad" exact component={() => {
            return (
              <div>
                <div className="container-scroller">
                  {<Sidebar account={accounts[0].name} membership={`airline-${airline}`} role={role} />}
                  <div className="container-fluid page-body-wrapper">
                    {<Navbar account={accounts[0].name} />}
                    <div className="main-panel">
                      <div className="content-wrapper">
                        {
                          airline
                            ?
                            <BulkLoad airline={airline} token={token} />
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
          <Route path="/usermanagement/Preferences" exact component={() => {
            return (
              <div>
                <div className="container-scroller">
                  {<Sidebar account={accounts[0].name} membership={`airline-${airline}`} role={role} />}
                  <div className="container-fluid page-body-wrapper">
                    {<Navbar account={accounts[0].name} />}
                    <div className="main-panel">
                      <div className="content-wrapper">
                        {
                          airline
                            ?
                            <Preferences airline={airline} token={token} graphData={graphData} groupId={groupId} />
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
          <Route path="/usermanagement/Roles" exact component={() => {
            return (
              <div>
                <div className="container-scroller">
                  {<Sidebar account={accounts[0].name} membership={`airline-${airline}`} role={role} />}
                  <div className="container-fluid page-body-wrapper">
                    {<Navbar account={accounts[0].name} />}
                    <div className="main-panel">
                      <div className="content-wrapper">
                        <Roles />
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
          <Route path="/fdrfiles/FDR" exact component={() => {
            return (
              <div>
                <div className="container-scroller">
                  {<Sidebar account={accounts[0].name} membership={`airline-${airline}`} role={role} />}
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

          <Route path="*" exact component={() => {
            return (
              <div>
                <Error404 style={{}} />
              </div>
            );
          }}
          />
        </Switch>
      );
    }
    else {
      return (
        <Switch>
          <Route path="/" exact component={() => {
            return (
              <div>
                <Error401 style={{}} />
              </div>
            );
          }}
          />
        </Switch>
      );
    }
  }

  return (
    <div className="App">
      <Router>
        <AuthenticatedTemplate>

          {
            featureManagement && role
              ?
              <>
                {renderRoutes(role)}
              </>
              :
              <></>
          }


        </AuthenticatedTemplate>

        <UnauthenticatedTemplate>
          {/* default redirect to home page */}
          <Redirect from="*" to="/" />
          <Route path="/" exact render={() => {
            return (
              <div>
                <br></br>
                <br></br>
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

