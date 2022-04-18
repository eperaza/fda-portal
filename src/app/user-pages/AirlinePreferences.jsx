import React, { useState, useCallback, useMemo, useEffect } from "react";
import BootstrapSwitchButton from 'bootstrap-switch-button-react'
import { Form } from 'react-bootstrap';
import Checkbox from '@mui/material/Checkbox';

export const AirlinePreferences = (props) => {

    useEffect(() => {
    }, []);

    const updatePreference = (key, value, role) => {
        const headers = new Headers();

        const options = {
            method: "GET",
            headers: headers
        };

        const code = process.env.REACT_APP_FUNCTION_AIRLINE_PREFERENCES_UPDATE_CODE;
        fetch(`${process.env.REACT_APP_FUNCTION_AIRLINE_PREFERENCES_UPDATE_URI}?code=${code}&airline=${props.airline}&value=${value}&airlineKey=${key}&role=${role}`, options)
            .then(response => response.text())
            .then(data => {
                console.log("Rows updated: " + data);
            }
            )
            .catch(error => console.log('error', error));
    }

    const renderPreferences = (data) => {
        return (
            <>
                {
                    data.airlineKey != "isFDALiteEnabled" && data.airlineKey != "isFDAPrimeEnabled"
                        ?
                        <div className="row">
                            <div className="col-12">
                                <div className="preview-list">
                                    <div className="preview-item border-bottom" style={{ paddingBottom: 10 }}>
                                        <div className="">
                                            <div className="preview-icon bg-primary">
                                                <i className=""></i>
                                            </div>
                                        </div>
                                        <div className="preview-item-content d-sm-flex flex-grow">
                                            <div className="flex-grow">
                                                <h6 className="preview-subject">
                                                    <div className="row">

                                                        <div className="col-6">
                                                            {data.preference}
                                                        </div>

                                                        <div className="col-1">
                                                            <Checkbox
                                                                defaultChecked={data.choiceEFBAdmin}
                                                                style={{ color: "#0d6efd" }}
                                                                onChange={e => updatePreference(data.airlineKey, e.target.checked, "choice_efbadmin")}
                                                            />
                                                        </div>
                                                        <div className="col-1">
                                                            <Checkbox
                                                                defaultChecked={data.choiceFocal}
                                                                style={{ color: "#0d6efd" }}
                                                                onChange={e => updatePreference(data.airlineKey, e.target.checked, "choice_focal")}
                                                            />
                                                        </div>
                                                        <div className="col-1">
                                                            <Checkbox
                                                                defaultChecked={data.choiceCheckAirman}
                                                                style={{ color: "#0d6efd" }}
                                                                onChange={e => updatePreference(data.airlineKey, e.target.checked, "choice_check_airman")}
                                                            />
                                                        </div>
                                                        <div className="col-1">
                                                            <Checkbox
                                                                defaultChecked={data.choicePilot}
                                                                style={{ color: "#0d6efd" }}
                                                                onChange={e => updatePreference(data.airlineKey, e.target.checked, "choice_pilot")}
                                                            />
                                                        </div>
                                                        <div className="col-1">
                                                            <Checkbox
                                                                defaultChecked={data.choiceMaintenance}
                                                                style={{ color: "#0d6efd" }}
                                                                onChange={e => updatePreference(data.airlineKey, e.target.checked, "choice_maintenance")}
                                                            />
                                                        </div>
                                                    </div>
                                                </h6>
                                                <p className="text-muted mb-0">

                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        :
                        <></>
                }
            </>
        );
    };

    return (
        <>
            {
                props.rowData.map(renderPreferences)
            }
        </>
    );
}