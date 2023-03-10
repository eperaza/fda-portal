import React, { useState, useCallback, useMemo, useEffect } from "react";
import BootstrapSwitchButton from 'bootstrap-switch-button-react'
import { useSnackbar } from 'notistack';

export const Triggers = (props) => {
    const [snack, setSnack] = useState("");
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    useEffect(() => {
    }, []);

    const updatePreference = (key, value) => {
        const headers = new Headers();

        const options = {
            method: "GET",
            headers: headers
        };

        const code = process.env.REACT_APP_FUNCTION_USER_PREFERENCES_UPDATE_CODE;
        fetch(`${process.env.REACT_APP_FUNCTION_USER_PREFERENCES_UPDATE_URI}?code=${code}&airline=${props.airline}&value=${value}&userKey=${key}`, options)
            .then(response => response.text())
            .then(data => {
                console.log("Rows updated: " + data);
                enqueueSnackbar(`Preference updated: ${key}_${value}`, { variant: 'success' });
            }
            )
            .catch(error => {
                enqueueSnackbar("Error", { variant: 'error' })
                console.log('error', error)
            });
    }

    const renderPreferences = (data) => {
        return (
            <>
                {
                    (data.value == "true" || data.value == "false" || data.value == 0 || data.value == 1) && data.userKey != "saveFlightProgressTablesValues"
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

                                                        <div className="col-9">
                                                            {data.preference}
                                                        </div>

                                                        <div className="col-3">
                                                            {
                                                                <BootstrapSwitchButton checked={
                                                                    data.value == "1" || data.value == "true"
                                                                        ?
                                                                        true
                                                                        :
                                                                        false
                                                                } size="xs" onstyle="success" offstyle="dark"
                                                                    onChange={(e) => {
                                                                        updatePreference(data.userKey, e);
                                                                    }}
                                                                />

                                                            }
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