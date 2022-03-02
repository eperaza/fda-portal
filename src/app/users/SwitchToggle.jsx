import React, { useEffect, useState, useRef } from 'react';
import { Switch, SwitchLabel, SwitchRadio, SwitchSelection } from "../toggle.js";

export const SwitchToggle = (props) => {
    const [selected, setSelected] = useState(props.selected);
    const [count, setCount] = useState();


    const handleChange = (val) => {
        setSelected(val);
        console.log(val);
        if (val == "all") {
            props.gridRef.current.api.setQuickFilter();
            let rows = props.gridRef.current.api.getDisplayedRowCount();
            setCount(rows);
        }
        if (val == "activated") {
            props.gridRef.current.api.setQuickFilter("activated");
            let rows = props.gridRef.current.api.getDisplayedRowCount();
            setCount(rows);
        }
        if (val == "pending") {
            props.gridRef.current.api.setQuickFilter("pending");
            let rows = props.gridRef.current.api.getDisplayedRowCount();
            setCount(rows);
        }


    };

    const ClickableLabel = ({ title, onChange, id }) => (
        <SwitchLabel onClick={() => onChange(title)} className="text-white">
            {titleCase(title)}
        </SwitchLabel>
    );

    const ConcealedRadio = ({ value, selected }) => (
        <SwitchRadio type="radio" name="switch" checked={selected === value} />
    );

    const titleCase = (str) =>
        str
            .split(/\s+/)
            .map((w) => w[0].toUpperCase() + w.slice(1))
            .join(" ");

    return (
        <div>
            <Switch>
                {

                    props.values.map((val) => {
                        return (
                            <span>
                                <ConcealedRadio value={val} selected={props.selected} />
                                <ClickableLabel title={val} onChange={handleChange} />
                            </span>
                        );
                    })}
                <SwitchSelection style={{left: `${(props.values.indexOf(selected) / 3) * 100}%`}
            } />
            </Switch>
            <div className="col-12 grid-margin">
                                <div className="row">
                                    <div className="col-md-4">
                                        
                                    </div>
                                    <div className="col-md-4 align-self-center d-flex align-items-center justify-content-center">
                                        <div className="row">
                                        <h4><i className='text-primary'>{count}</i></h4>
                                        </div>
                                    </div>
                                    <div className="col-md-4">

                                    </div>
                                </div>
                            </div>
        </div>
    )
}