import React, { Component, useState } from 'react';
import { Link } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../../authConfig";
import DropdownButton from "react-bootstrap/DropdownButton";
import Button from "react-bootstrap/Button";
import { FaSignInAlt } from "react-icons/fa";
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseButton from 'react-bootstrap/CloseButton'
import Spinner from 'react-bootstrap/Spinner';

export const Login = () => {

  const { instance } = useMsal();
  const [email, setEmail] = useState(""),
    onInputEmail = ({ target: { value } }) => setEmail(value);
  const [code, setCode] = useState(""),
    onInputCode = ({ target: { value } }) => setCode(value);
  const [password, setPassword] = useState(""),
    onInputPassword = ({ target: { value } }) => setPassword(value);
  const [passwordConfirm, setPasswordConfirm] = useState(""),
    onInputPasswordConfirm = ({ target: { value } }) => setPasswordConfirm(value);

  const [open, setOpen] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [userId, setUserId] = useState();
  const [disabled, setDisabled] = useState(false);
  const [registerLabel, setRegisterLabel] = useState("Register");
  const [registrationErrorText, setRegistrationErrorText] = useState("Registration Failed");

  const handleLogin = (loginType) => {
    if (loginType === "popup") {
      instance.loginPopup(loginRequest).catch(e => {
        console.log(e);
      });
    } else if (loginType === "redirect") {
      if (userId) {
        const loginRequest = {
          scopes: ["User.Read"],
          loginHint: userId
        };
        instance.loginRedirect(loginRequest).catch(e => {
          console.log(e);
        });
      }
      else {
        instance.loginRedirect(loginRequest).catch(e => {
          console.log(e);
        });
      }

    }
  }

  const getClientCert = async () => {
    const headers = new Headers();
    headers.append("Ocp-Apim-Subscription-Key", `${process.env.REACT_APP_APIM_KEY}`);

    var requestOptions = {
      method: "GET",
      headers: headers
    };

    let res = await fetch(`${process.env.REACT_APP_CLIENT_CERT_GET_URI}?activationCode=${code}&emailAddress=${email}`, requestOptions)
    let data = await res.json();
    var array;

    try {
      var decodedString = window.atob(data.certificate);
      var x = decodedString.split(/(\s+)/).filter(e => e.trim().length > 0)
      array = [x[0], x[1]];
    }
    catch (error) {
      console.log(error);
    }
    return array
  }

  const registerUser = async () => {

    if (password == passwordConfirm) {
      if (email != "" && code != "" && password != "" && passwordConfirm != "") {
        setDisabled(true);
        setRegisterLabel(<><Spinner animation="border" size="sm" /></>);
        var userAccount = await getClientCert();
        const headers = new Headers();

        headers.append("Ocp-Apim-Subscription-Key", `${process.env.REACT_APP_APIM_KEY}`);
        headers.append("Content-type", "application/json");

        try {
          var body = JSON.stringify({
            "registrationToken": `${userAccount[1]}`,
            "username": `${userAccount[0]}`,
            "password": `${password}`,
            "activationCode": `${code}`
          });

          const options = {
            method: "POST",
            headers: headers,
            body: body
          };

          let res = await fetch(process.env.REACT_APP_USER_REGISTER_URI, options)
          let data = await res.json();
          let status = await res.status;

          if (status == 200) {
            setUserId(userAccount[0]);
            setOpen(true);
            setOpenError(false);
            //optional
            const loginRequest = {
              scopes: ["User.Read"],
              loginHint: userAccount[0]
            };
            instance.loginRedirect(loginRequest).catch(e => {
              console.log(e);
            });
          }
          else {
            setOpen(false);
            setOpenError(true);
            setRegistrationErrorText("Registration Failed");

          }

        }
        catch (error) {
          setOpen(false);
          setOpenError(true);
          setRegistrationErrorText("Registration Failed");

        }

        setDisabled(false);
        setRegisterLabel("Register");
      }
      else {
        setRegistrationErrorText("Empty fields")
        setDisabled(false);
        setRegisterLabel("Register");
        setOpenError(true);
      }
    }
    else {
      setRegistrationErrorText("Passwords don't match")
      setDisabled(false);
      setRegisterLabel("Register");
      setOpenError(true);

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
              <h6 className="font-weight-light">Please follow instructions in your email to get started.</h6>

              <Form className="pt-3">
                <Form.Group className="d-flex search-field">
                  <Form.Control type="text" onChange={onInputEmail} value={email} placeholder="Email" size="lg" className="h-auto" />
                </Form.Group>
                <Form.Group className="d-flex search-field">
                  <Form.Control type="password" onChange={onInputCode} value={code} placeholder="Activation Code" size="lg" className="h-auto" />
                </Form.Group>
                <Form.Group className="d-flex search-field">
                  <Form.Control type="password" onChange={onInputPassword} value={password} placeholder="Set Password" size="lg" className="h-auto" />
                  <Form.Control type="password" onChange={onInputPasswordConfirm} value={passwordConfirm} placeholder="Confirm Password" size="lg" className="h-auto" />
                </Form.Group>

                <Collapse in={open}>
                  <Alert
                    action={
                      <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                          setOpen(false);
                        }}
                      >

                      </IconButton>
                    }
                    sx={{ mb: 2 }}
                  >
                    Registration successfull. Your user ID is: [{userId}]. Click Sign In to proceed.
                  </Alert>
                </Collapse>
                <Collapse in={openError}>
                  <Alert
                    severity="error"
                    action={
                      <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                          setOpenError(false);
                        }}
                      >

                      </IconButton>
                    }
                    sx={{ mb: 2 }}
                  >
                    {registrationErrorText}.
                  </Alert>
                </Collapse>
                <div className="mt-3">
                  <Button className="btn btn-block btn-facebook auth-form-btn" onClick={registerUser}>{registerLabel}</Button>
                  <br />
                  <h6 className="font-weight-light">Or Sign In if you are registered.</h6>
                  <br />
                  <Button disabled={disabled} className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn" onClick={() => handleLogin("redirect")}>Sign In</Button>
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

