import React, { useState, useCallback, useMemo, useEffect } from "react";
import BootstrapSwitchButton from 'bootstrap-switch-button-react'
import { Form } from 'react-bootstrap';
import Checkbox from '@mui/material/Checkbox';
const { v4: uuidv4 } = require('uuid');

export const CreateFeatureManagementForm = (props) => {

    useEffect(() => {
    }, []);

    const updatePreference = (featureKey, checked, key) => {
        props.featureManagement.forEach((preference, index) => {
            if (preference.featureKey == featureKey) {
                if (key == "enabled") {
                    props.featureManagement[index]["enabled"] = checked
                }
                if (key == "display") {
                    props.featureManagement[index]["display"] = checked
                }
                if (key == "choiceEFBAdmin") {
                    props.featureManagement[index]["choiceEFBAdmin"] = checked
                }
                if (key == "choiceFocal") {
                    props.featureManagement[index]["choiceFocal"] = checked
                }
                if (key == "choiceCheckAirman") {
                    props.featureManagement[index]["choiceCheckAirman"] = checked
                }
                if (key == "choicePilot") {
                    props.featureManagement[index]["choicePilot"] = checked
                }
                if (key == "choiceMaintenance") {
                    props.featureManagement[index]["choiceMaintenance"] = checked
                }
            }
        })
        props.setFeatureManagement(props.featureManagement);
        console.log(props.featureManagement)
    }

    const renderPreferences = (data) => {
        return (
            <>
                {console.log(uuidv4)}
                {
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
                                                    <div className="col-3 vertical-center">
                                                        {data.title}
                                                    </div>
                                                    <div className="col-1">
                                                        <Checkbox
                                                            key={uuidv4()} /* fixed issue */
                                                            defaultChecked={
                                                                data.airline == "airline-fda"
                                                                ?
                                                                false
                                                                :
                                                                data.enabled
                                                            }
                                                            style={{ color: "#0d6efd" }}
                                                            onChange={e => updatePreference(data.featureKey, e.target.checked, "enabled", data.enabled)}
                                                        />
                                                    </div>
                                                    <div className="col-1">
                                                        <Checkbox
                                                            key={uuidv4()} /* fixed issue */
                                                            defaultChecked={
                                                                data.airline == "airline-fda"
                                                                ?
                                                                false
                                                                :
                                                                data.display
                                                            }
                                                            style={{ color: "#0d6efd" }}
                                                            onChange={e => updatePreference(data.featureKey, e.target.checked, "display", data.display)}
                                                        />
                                                    </div>
                                                    <div className="col-1">
                                                        <Checkbox
                                                            key={uuidv4()} /* fixed issue */
                                                            defaultChecked={
                                                                data.airline == "airline-fda"
                                                                ?
                                                                false
                                                                :
                                                                data.choiceEFBAdmin
                                                            }
                                                            style={{ color: "#0d6efd" }}
                                                            onChange={e => updatePreference(data.featureKey, e.target.checked, "choiceEFBAdmin", data.choiceEFBAdmin)}
                                                        />
                                                    </div>
                                                    <div className="col-1">
                                                        <Checkbox
                                                            key={uuidv4()} /* fixed issue */
                                                            defaultChecked={
                                                                data.airline == "airline-fda"
                                                                ?
                                                                false
                                                                :
                                                                data.choiceFocal
                                                            }
                                                            style={{ color: "#0d6efd" }}
                                                            onChange={e => updatePreference(data.featureKey, e.target.checked, "choiceFocal", data.choiceFocal)}
                                                        />
                                                    </div>
                                                    <div className="col-1">
                                                        <Checkbox
                                                            key={uuidv4()} /* fixed issue */
                                                            defaultChecked={
                                                                data.airline == "airline-fda"
                                                                ?
                                                                false
                                                                :
                                                                data.choiceCheckAirman
                                                            }
                                                            style={{ color: "#0d6efd" }}
                                                            onChange={e => updatePreference(data.featureKey, e.target.checked, "choiceCheckAirman", data.choiceCheckAirman)}
                                                        />
                                                    </div>
                                                    <div className="col-1">
                                                        <Checkbox
                                                            key={uuidv4()} /* fixed issue */
                                                            defaultChecked={
                                                                data.airline == "airline-fda"
                                                                ?
                                                                false
                                                                :
                                                                data.choicePilot
                                                            }
                                                            style={{ color: "#0d6efd" }}
                                                            onChange={e => updatePreference(data.featureKey, e.target.checked, "choicePilot", data.choicePilot)}
                                                        />
                                                    </div>
                                                    <div className="col-1">
                                                        <Checkbox
                                                            key={uuidv4()} /* fixed issue */
                                                            defaultChecked={
                                                                data.airline == "airline-fda"
                                                                ?
                                                                false
                                                                :
                                                                data.choiceMaintenance
                                                            }
                                                            style={{ color: "#0d6efd" }}
                                                            onChange={e => updatePreference(data.featureKey, e.target.checked, "choiceMaintenance", data.choiceMaintenance)}
                                                        />
                                                    </div>
                                                    <div className="col-2 vertical-center">
                                                        {props.graphData.userPrincipalName.split('@')[0]}
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


                }
            </>
        );
    };

    return (
        <>
            {
                props.featureManagement.map(renderPreferences)
            }
        </>
    );
}