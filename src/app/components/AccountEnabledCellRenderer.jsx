import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

export const AccountEnabledCellRenderer = (props) => {

  const [show, setShow] = useState(false);
  const [sendLabel, setSendLabel] = useState("Send");
  const [sendDisable, setSendDisable] = useState(false);
  const [showAlertSuccess, setShowAlertSuccess] = useState(false);
  const [showAlertFail, setShowAlertFail] = useState(false);

  const renderTooltip = props => (
    <Tooltip {...props}>Send reminder</Tooltip>
  );

  const handleClose = () => {
    setShow(false);
    setShowAlertSuccess(false);
    setShowAlertFail(false);
  };

  const handleShow = () => {
    setShow(true);
    setSendDisable(false);
  };

  const [subject, setSubject] = useState("Registration Reminder for ["+props.data.mailNickname+"]"),
    onInputSubject = ({ target: { value } }) => setSubject(value);

  const [body, setBody] = useState("Hi "+props.data.givenName+", \n\nThis is a reminder for you to register your user ["+props.data.mailNickname+"] on FliteDeck Advisor. Thank you! \n\nSincerely,\nThe FDA team"),
    onInputBody = ({ target: { value } }) => setBody(value);

  const sendReminder = (e) => {
    e.preventDefault();
    setSendLabel(<><Spinner animation="border" size="sm" /></>);
    setSendDisable(true);

    const code = process.env.REACT_APP_FUNCTION_SEND_REMINDER_CODE;

    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("x-functions-key", code);


    var data = JSON.stringify({
      "recipient": `${props.data.otherMails}`,
      "body": `${body}`,
      "subject": `${subject}`,

    });

    const options = {
      method: "POST",
      headers: headers,
      body: data
    };

    fetch(process.env.REACT_APP_FUNCTION_SEND_REMINDER_URI, options)
      .then(response => response.status)
      .then(status => {
        if (status == 200) {
          //handleClose();
          setSendDisable(false);
          setShowAlertSuccess(true);
          setShowAlertFail(false);
        }
        else {
          setShowAlertFail(true);
          setShowAlertSuccess(false);
        }
        setSendLabel("Send");

      }
      )
      .catch(error => {
        console.log('error', error);
        setShowAlertFail(true);
        setShowAlertSuccess(false);
        setSendLabel("Send");
      });
  }

  return (

    <>
      {
        props.data.accountEnabled == "false"
          ?
          <div>
            <div className=''>PENDING
                <button style={{ backgroundColor: "transparent", border: "none" }} className="mdi mdi-message-processing text-primary" onClick={handleShow}></button>
            </div>
          </div>
          :
          <div className=''>REGISTERED <i className='mdi mdi-check text-success'></i></div>
      }
      <Modal show={show} onHide={handleClose} backdrop="static">
        <Modal.Header>
          <Modal.Title>Send Registration Reminder [{props.data.mailNickname}]</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-2 " style={{ verticalAlign: 'text-bottom', textAlign: "right", paddingTop: 9 }}>
              <label className="align-self-bottom">TO:</label>
            </div>
            <div className="col-md-10">
              <div className="input-group">
                <input
                  type="text"
                  disabled="true"
                  className="inpMail disabled"
                  placeholder="Subject"
                  aria-label="User Principal"
                  value={props.data.otherMails}
                  style={{ borderRadius: 10 }}
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-2 " style={{ verticalAlign: 'text-bottom', paddingTop: 9 }}>
              <label className="align-self-bottom">SUBJECT:</label>
            </div>
            <div className="col-md-10">
              <div className="input-group">
                <input
                  type="text"
                  className="inpMail"
                  placeholder="Subject"
                  aria-label="User Principal"
                  onChange={onInputSubject}
                  value={subject}
                  style={{ borderRadius: 10 }}
                />
              </div>
            </div>
          </div>


          <br></br>
          <div className="input-group">
            <label className="align-self-bottom">CONTENT:</label>

            <textarea
              className="inpMailTA"
              placeholder="Content..."
              aria-label="Content"
              onChange={onInputBody}
              value={body}
              style={{ borderRadius: 10, fontStyle: 'italic', height: 180 }}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" disabled={sendDisable} onClick={e => { sendReminder(e) }}>
            {sendLabel}
          </Button>
          {
            showAlertSuccess
              ?
              <Alert variant="success" onClose={() => setShow(false)} dismissible>
                <Alert.Heading>Success!</Alert.Heading>
                <p>
                  Registration reminder email sent to [{props.data.mailNickname}] successfully!
                </p>
              </Alert>
              :
              <></>
          }
          {
            showAlertFail
              ?
              <Alert variant="danger" onClose={() => setShow(false)} dismissible>
                <Alert.Heading>Error!</Alert.Heading>
                <p>
                  Error sending email to [{props.data.mailNickname}]. Service not available, please try again later.
                </p>
              </Alert>
              :
              <></>
          }
        </Modal.Footer>
      </Modal>

    </>


  );

}