import React, { useState, useEffect } from "react";
import Tooltip from "react-bootstrap/Tooltip";

export const VersionCellRenderer = (props) => {


    const renderTooltip = props => (
        <Tooltip {...props}>Send reminder</Tooltip>
    );

    const renderTSP = () => {

        var tspLastUpdated = new Date(props.data.version);
        var tspLastModified = new Date(props.tspLastModified);

        if (tspLastUpdated.getTime() < tspLastModified.getTime()) {
            let x = <div> {props.data.version} <i className='mdi mdi-alert-circle text-warning'></i></div>
            return x;
        }
        else {
            let x = (<div> {props.data.version} <i className='mdi mdi-new-box text-success'></i></div>)
            return x;
        }

    }

    return (
        <>
            {
                props.data.version
                    ?
                    <>
                        {
                            renderTSP()
                        }
                    </>
                    :
                    <></>
            }
        </>
    );

}