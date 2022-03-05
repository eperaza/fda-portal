import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../../authConfig";
import DropdownButton from "react-bootstrap/DropdownButton";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/esm/Dropdown";
import { FaSignInAlt } from "react-icons/fa";

export const Login = () => {

  const { instance } = useMsal();

  const handleLogin = (loginType) => {
    if (loginType === "popup") {
      instance.loginPopup(loginRequest).catch(e => {
        console.log(e);
      });
    } else if (loginType === "redirect") {
      instance.loginRedirect(loginRequest).catch(e => {
        console.log(e);
      });
    }
  }

  return (
    <div>
      <div className="d-flex align-items-center auth px-0">
        <div className="row w-100 mx-0">
          <div className="col-lg-4 mx-auto">
            <div className="card text-left py-5 px-4 px-sm-5">
              <div className="brand-logo">
                <img src={require('../../assets/images/logo.png')} alt="logo" />
              </div>
              <h4>Welcome to Boeing FliteDeck Advisor</h4>
              <h6 className="font-weight-light">PLease follow instructions in your email to get started.</h6>
              <Form className="pt-3">
                <Form.Group className="d-flex search-field">
                  <Form.Control type="email" placeholder="Username" size="lg" className="h-auto" disabled="true" />
                </Form.Group>
                <Form.Group className="d-flex search-field">
                  <Form.Control type="password" placeholder="Activation Code" size="lg" className="h-auto" disabled="true"/>
                </Form.Group>
                <div className="mt-3">
                  <Button className="btn btn-block btn-facebook auth-form-btn" >Register</Button>
                  <br/>
                  <h6 className="font-weight-light">Or Sign In if you are registered.</h6>
                  <br/>
                  <Button className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn" onClick={() => handleLogin("redirect")}>Sign In</Button>
                </div>
                <div className="my-2 d-flex justify-content-between align-items-center">
                  <div className="form-check">
 
                  </div>
                </div>
                
                <div className="text-center mt-4 font-weight-light">
                   <Link to="/user-pages/register" className="text-primary"></Link>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

}

