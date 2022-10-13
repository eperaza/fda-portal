import React, { useState, useCallback, useMemo, useEffect } from "react";
import BootstrapSwitchButton from 'bootstrap-switch-button-react'
import { useSnackbar } from 'notistack';

export const Preferences = (props) => {
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
        const renderSwitch = () => {
            if (data.userKey == "fuelWeightUnit") {
                return (
                    <>
                        Pound {" "}
                        <BootstrapSwitchButton checked={
                            data.value == "kg"
                                ?
                                true
                                :
                                false
                        } size="xs" width="100" onlabel="kg" offlabel="lb" onstyle="dark" offstyle="dark"
                            onChange={(e) => {
                                if (e == true) {
                                    updatePreference(data.userKey, "kg");
                                }
                                else {
                                    updatePreference(data.userKey, "lb");
                                }
                            }}
                        />
                        {" "} Kilogram
                    </>
                );
            }
            if (data.userKey == "speedUnit") {
                return (
                    <>
                        Mach {" "}
                        <BootstrapSwitchButton checked={
                            data.value == "knots"
                                ?
                                true
                                :
                                false
                        } size="xs" width="100" onlabel="knots" offlabel="mach" onstyle="dark" offstyle="dark"
                            onChange={(e) => {
                                if (e == true) {
                                    updatePreference(data.userKey, "knots");
                                }
                                else {
                                    updatePreference(data.userKey, "mach");
                                }
                            }}
                        />
                        {" "} Knots
                    </>
                );
            }
            if (data.userKey == "fuelMileageUnit") {
                return (
                    <>
                        NM/100lb {" "}
                        <BootstrapSwitchButton checked={
                            data.value == "nm100kg"
                                ?
                                true
                                :
                                false
                        } size="xs" width="100" onlabel="nm100kg" offlabel="nm100lb" onstyle="dark" offstyle="dark"
                            onChange={(e) => {
                                if (e == true) {
                                    updatePreference(data.userKey, "nm100kg");
                                }
                                else {
                                    updatePreference(data.userKey, "nm100lb");
                                }
                            }}
                        />
                        {" "} NM/100kg
                    </>
                );
            }
            if (data.userKey == "altitudeUnit") {
                return (
                    <>
                        FeetX100 {" "}
                        <BootstrapSwitchButton checked={
                            data.value == "meterX100"
                                ?
                                true
                                :
                                false
                        } size="xs" width="100" onlabel="meterX100" offlabel="feetX100" onstyle="dark" offstyle="dark"
                            onChange={(e) => {
                                if (e == true) {
                                    updatePreference(data.userKey, "meterX100");
                                }
                                else {
                                    updatePreference(data.userKey, "feetX100");
                                }
                            }}
                        />
                        {" "} MeterX100
                    </>
                );
            }
        }
        return (
            <>
                {
                    data.value != "true" && data.value != "false" && data.value != 0 && data.value != 1
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

                                                        <div className="col-4">
                                                            {data.preference}
                                                        </div>

                                                        <div className="col-8">
                                                            {

                                                                renderSwitch()

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