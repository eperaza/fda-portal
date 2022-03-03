import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Accordion, Card } from "react-bootstrap";
import Button from "react-bootstrap/Button";

export const AccordionFDR = (props) => {

    useEffect(() => {
        console.log("data es" + props.rowData)
    }, []);

    const downloadFDR = () =>{}

    const renderAccordion = (data) => {
        return (
            <Accordion >
                <Card>
                    <Card.Header style={{ backgroundColor: "#111" }}>
                        <Accordion.Toggle as={Button}
                            variant="link" eventKey="0" >
                            <i className="mdi mdi-chevron-double-down icon-md"></i>
                            {data.Key.toUpperCase()}
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
            </Accordion>
        );
    };

    return (
        <>
            {props.rowData.map(renderAccordion)
            }
        </>
    );
}