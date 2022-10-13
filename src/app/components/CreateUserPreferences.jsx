import React, { useState, useCallback, useMemo, useEffect } from "react";
import BootstrapSwitchButton from 'bootstrap-switch-button-react'
const { v4: uuidv4 } = require('uuid');

export const CreateUserPreferences = (props) => {

    useEffect(() => {
    }, []);

    const updatePreference = (userKey, value) => {
        console.log(userKey);
        console.log(value);

        props.rowData.forEach((preference, index) => {
            if (preference.userKey == userKey) {
                props.rowData[index]["value"] = value;

            }
        });

        props.setUserPreferences(props.rowData);
    }

    const renderPreferences = (data) => {
        const renderSwitch = () => {
            if (data.userKey == "fuelWeightUnit") {
                return (
                    <>
                        Pound {" "}
                        <BootstrapSwitchButton
                            key={uuidv4()} /* fixed issue */
                            disabled={props.disabled}
                            checked={
                                props.manualSelect == true
                                    ?
                                    false
                                    :
                                    data.value == "kg"
                                        ?
                                        true
                                        :
                                        false
                            }
                            size="xs" width="100" onlabel="kg" offlabel="lb" onstyle="dark" offstyle="dark"
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
                        <BootstrapSwitchButton
                            key={uuidv4()} /* fixed issue */
                            disabled={props.disabled}
                            checked={
                                props.manualSelect == true
                                    ?
                                    false
                                    :
                                    data.value == "knots"
                                        ?
                                        true
                                        :
                                        false
                            }
                            size="xs" width="100" onlabel="knots" offlabel="mach" onstyle="dark" offstyle="dark"
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
                        <BootstrapSwitchButton
                            key={uuidv4()} /* fixed issue */
                            disabled={props.disabled}
                            checked={
                                props.manualSelect == true
                                    ?
                                    false
                                    :
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
                        <BootstrapSwitchButton
                            key={uuidv4()} /* fixed issue */
                            disabled={props.disabled}
                            checked={
                                props.manualSelect == true
                                    ?
                                    false
                                    :
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