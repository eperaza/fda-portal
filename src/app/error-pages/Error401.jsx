import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { useMsal } from "@azure/msal-react";

export const Error401 = () => {

  const { instance } = useMsal();

  const handleLogout = (logoutType) => {
    instance.logoutRedirect({
      postLogoutRedirectUri: "/",
    });
  }
  return (
    <div>
      <div className="d-flex align-items-center text-center error-page bg-primary pt-5 pb-4 h-100">
        <div className="row flex-grow">
          <div className="col-lg-8 mx-auto text-white">
            <div className="row align-items-center d-flex flex-row">
              <div className="col-lg-6 text-lg-right pr-lg-4">
                <h1 className="display-1 mb-0">401</h1>
              </div>
              <div className="col-lg-6 error-page-divider text-lg-left pl-lg-4">
                <h2>UNAUTHORIZED!</h2>
                <h3 className="font-weight-light">Your role is not autorized to view this content.</h3>
              </div>
            </div>
            <div className="row mt-5">
              <div className="col-12 text-center mt-xl-2">
                <img height="45px" width="200px" src={require('../../assets/images/logo.png')} />
                <br></br>
                <Link className="text-white font-weight-medium" onClick={handleLogout}>Logout</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

}

