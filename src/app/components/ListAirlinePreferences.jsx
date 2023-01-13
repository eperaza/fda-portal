import React, { useState, useCallback, useMemo } from "react";
import { useEffect, useRef } from 'react';
import { Tails } from "./Tails"
import 'ag-grid-community/dist/styles/ag-grid.css';
import "../aggrid.css";
import { Preferences } from "./Preferences";
import { Triggers } from "./Triggers";
import { AirlinePreferences } from "./AirlinePreferences";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { FeatureManagement } from "./FeatureManagement";

const axios = require('axios');

const StyledTabs = styled((props) => (
    <Tabs
        {...props}
        TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
    />
))({
    '& .MuiTabs-indicator': {
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    '& .MuiTabs-indicatorSpan': {
        maxWidth: 120,
        width: '100%',
        backgroundColor: '#0d6efd',
    },
});


const StyledTab = styled((props) => (
    <Tab disableRipple {...props} />
))(({ theme }) => ({
    textTransform: 'none',
    fontFamily: "Rubik, sans-serif",
    fontWeight: '500',
    fontSize: theme.typography.pxToRem(17.5),
    letterSpacing: 0,
    marginRight: theme.spacing(0),
    color: 'rgba(255, 255, 255, 0.7)',
    '&.Mui-selected': {
        color: '#fff',
    },
    '&.Mui-focusVisible': {
        backgroundColor: 'rgba(100, 95, 228, 0.32)',
    },
}));

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <span>{children}</span>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export const ListAirlinePreferences = (props) => {
    const [rowData, setRowData] = useState([]);
    const [value, setValue] = React.useState(0);
    const [featureManagement, setFeatureManagement] = useState([]);

    const handleChange = (e, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        getPreferences();
        getFeatureManagement();
    }, [])


    const getPreferences = async () => {

        const headers = new Headers();

        const options = {
            method: "GET",
            headers: headers
        };

        console.log(props.airline.toUpperCase())
        const code = process.env.REACT_APP_FUNCTION_AIRLINE_PREFERENCES_GET_CODE;
        fetch(`${process.env.REACT_APP_FUNCTION_AIRLINE_PREFERENCES_GET_URI}?code=${code}&airline=airline-${props.airline}`, options)
            .then(response => response.json())
            .then(data => {
                setRowData(data);
            }
            )
            .catch(error => console.log('error', error));
    }

    const getFeatureManagement = async () => {
        const headers = new Headers();

        const options = {
            method: "GET",
            headers: headers
        };

        const code = process.env.REACT_APP_FUNCTION_FEATURE_MANAGEMENT_GET_CODE;
        fetch(`${process.env.REACT_APP_FUNCTION_FEATURE_MANAGEMENT_GET_URI}?code=${code}&airline=airline-${props.airline}`, options)
            .then(response => response.json())
            .then(data => {
                setFeatureManagement(data);
                console.log(data)
            }
            )
            .catch(error => console.log('error', error));
    }

    return (
        <div>
            <br></br>
            <StyledTabs value={value} onChange={handleChange} aria-label="basic tabs example" textColor="" indicatorColor="primary">

                <StyledTab label="Airline Preferences" {...a11yProps(0)} />

                <StyledTab label="Feature Management" {...a11yProps(1)} />
            </StyledTabs>
            <TabPanel value={value} index={0}>
                {
                    rowData
                        ?
                        <AirlinePreferences rowData={rowData} airline={props.airline} />
                        :
                        <></>
                }
            </TabPanel>
            <TabPanel value={value} index={1}>
                {
                    featureManagement
                        ?
                        <FeatureManagement featureManagement={featureManagement} airline={props.airline} />
                        :
                        <></>
                }
            </TabPanel>
        </div>
    );
};


