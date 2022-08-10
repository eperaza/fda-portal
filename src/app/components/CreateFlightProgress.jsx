import React, { useState, useCallback, useMemo, useEffect } from "react";
import BootstrapSwitchButton from 'bootstrap-switch-button-react'


export const CreateFlightProgress = (props) => {

    useEffect(() => {
    }, []);

    const updatePreference = (userKey, value) => {
        props.rowData.forEach((preference, index) => {
            if (preference.userKey == userKey) {
                if (value == true) {
                    props.rowData[index]["value"] = "1";
                }
                else {
                    props.rowData[index]["value"] = "0";
                }
            }
        });
       props.setFlightProgress(props.rowData);      
    }

    const renderPreferences = (data) => {
        return (
            <>
                {
                    data.userKey == "saveFlightProgressTablesValues"
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