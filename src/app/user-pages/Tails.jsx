import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Accordion, Card } from "react-bootstrap";
import Button from "react-bootstrap/Button";

export const Tails = (props) => {

    useEffect(() => {
        console.log("data es" + props.rowData)
    }, []);

    const renderTails = (data) => {
        return (
            <div className="row">
                <div className="col-12">
                    <div className="preview-list">
                        <div className="preview-item border-bottom">
                            <div className="">
                                <div className="preview-icon bg-primary">
                                    <i className=""></i>
                                </div>
                            </div>
                            <div className="preview-item-content d-sm-flex flex-grow">
                                <div className="flex-grow">
                                    <h6 className="preview-subject">
                                        <i className="mdi mdi-airplane icon-item text-primary"> </i>

                                        {
                                            data.Key.toUpperCase()
                                        }
                                    </h6>
                                    <p className="text-muted mb-0">
                                        <a href="/user-pages/FDR">
                                        {

                                            (data.Value != "")
                                                ?
                                                `${data.Value.length} FDR files`
                                                :
                                                <>No FDR files</>

                                        }
                                        </a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            {props.rowData.map(renderTails)
            }
        </>
    );
}