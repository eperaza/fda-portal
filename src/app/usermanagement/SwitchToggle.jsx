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
            props.setCount(rows);
            props.setFilterVal("")
        }
        if (val == "registered") {
            props.gridRef.current.api.setQuickFilter("true");
            let rows = props.gridRef.current.api.getDisplayedRowCount();
            props.setCount(rows);
            props.setFilterVal("")

        }
        if (val == "pending") {
            props.gridRef.current.api.setQuickFilter("false");
            let rows = props.gridRef.current.api.getDisplayedRowCount();
            props.setCount(rows);
            props.setFilterVal("")
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
                <SwitchSelection style={{ left: `${(props.values.indexOf(selected) / 3) * 100}%` }
                } />
            </Switch>
            
        </div>
    )
}