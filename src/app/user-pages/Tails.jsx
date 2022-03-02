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
                                            data.Key
                                        }
                                    </h6>
                                    <p className="text-muted mb-0">
                                        {

                                            (data.Value != "")
                                                ?
                                                `${data.Value.length} FDR files`
                                                :
                                                <>No FDR files</>

                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            /*
            <Accordion>
                <Card>
                    <Card.Header style={{ backgroundColor: "#111" }}>
                        <Accordion.Toggle as={Button}
                            variant="link" eventKey="0" >
                            <i className="mdi mdi-chevron-double-down icon-md"></i>
                            {data.Key}
                        </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey="0">
                        <Card.Body style={{ backgroundColor: "#111" }}>
                            {<ul>
                                {   
                                    (data.Value != "")
                                    ?
                                    data.Value.map((item) => {
                                        
                                        return <li className=""><i className="" key={item}><a href={`https://functionfdatspdev.azurewebsites.net/api/FlightDataRecordingDownload?code=CQuWinh1G8jFhEHaCgXGMQ9v1aNafxrZEmlrLeMHebjrga4ogDouPw==&airlineId=TAV&sourceFilePath=${item}`}>{item}</a></i></li>
                                    })
                                    :
                                    <>No FDR files to show.</>
                                   
                                }

                            </ul>}
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
            </Accordion>*/
        );
    };

    return (
        <>
            {props.rowData.map(renderTails)
            }
        </>
    );
}