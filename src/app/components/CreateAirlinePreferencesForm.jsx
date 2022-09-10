import React, { useState, useCallback, useMemo, useEffect } from "react";
import BootstrapSwitchButton from 'bootstrap-switch-button-react'
import { Form } from 'react-bootstrap';
import Checkbox from '@mui/material/Checkbox';
const { v4: uuidv4 } = require('uuid');

export const CreateAirlinePreferencesForm = (props) => {

    useEffect(() => {
    }, []);

    const updatePreference = (airlineKey, checked, key) => {

        props.airlinePreferences.forEach((preference, index) => {
            if (preference.airlineKey == airlineKey) {
                if (key == "enabled") {
                    props.airlinePreferences[index]["enabled"] = checked
                }
                if (key == "display") {
                    props.airlinePreferences[index]["display"] = checked
                }
                if (key == "choiceEFBAdmin") {
                    props.airlinePreferences[index]["choiceEFBAdmin"] = checked
                }
                if (key == "choiceFocal") {
                    props.airlinePreferences[index]["choiceFocal"] = checked
                }
                if (key == "choiceCheckAirman") {
                    props.airlinePreferences[index]["choiceCheckAirman"] = checked
                }
                if (key == "choicePilot") {
                    props.airlinePreferences[index]["choicePilot"] = checked
                }
                if (key == "choiceMaintenance") {
                    props.airlinePreferences[index]["choiceMaintenance"] = checked
                }
                
            }
        })

        props.setAirlinePreferences(props.airlinePreferences);
        console.log(props.airlinePreferences)
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
                                                        {data.preference}
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
                                                            onChange={e => updatePreference(data.airlineKey, e.target.checked, "enabled", data.enabled)}
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
                                                            }                                                            style={{ color: "#0d6efd" }}
                                                            onChange={e => updatePreference(data.airlineKey, e.target.checked, "display", data.display)}
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
                                                            }                                                               style={{ color: "#0d6efd" }}
                                                            onChange={e => updatePreference(data.airlineKey, e.target.checked, "choiceEFBAdmin", data.choiceEFBAdmin)}
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
                                                            }                                                               style={{ color: "#0d6efd" }}
                                                            onChange={e => updatePreference(data.airlineKey, e.target.checked, "choiceFocal", data.choiceFocal)}
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
                                                            }                                                             style={{ color: "#0d6efd" }}
                                                            onChange={e => updatePreference(data.airlineKey, e.target.checked, "choiceCheckAirman", data.choiceCheckAirman)}
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
                                                            }                                                             style={{ color: "#0d6efd" }}
                                                            onChange={e => updatePreference(data.airlineKey, e.target.checked, "choicePilot", data.choicePilot)}
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
                                                            }                                                             style={{ color: "#0d6efd" }}
                                                            onChange={e => updatePreference(data.airlineKey, e.target.checked, "choiceMaintenance", data.choiceMaintenance)}
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

                props.airlinePreferences.map(renderPreferences)

            }
        </>
    );
}