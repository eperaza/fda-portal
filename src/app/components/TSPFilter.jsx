import React, {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useState,
} from 'react';

export default forwardRef((props, ref) => {
    const [version, setVersion] = useState('All');

    // expose AG Grid Filter Lifecycle callbacks
    useImperativeHandle(ref, () => {
        return {
            doesFilterPass(params) {
                try {
                    var tspLastUpdated = new Date(params.data.version);
                    var tspLastModified = new Date(props.tspLastModified)
                    return tspLastUpdated.getTime() >= tspLastModified.getTime()
                }
                catch (error) {
                    console.log("error")
                }
            },

            isFilterActive() {
                return version === '2010';
            },

            // this example isn't using getModel() and setModel(),
            // so safe to just leave these empty. don't do this in your code!!!
            getModel() { },

            setModel() { },
        };
    });

    const onYearChange = (event) => {
        setVersion(event.target.value);
    };

    useEffect(() => {
        props.filterChangedCallback();
    }, [version]);

    return (
        <div
            style={{ display: 'inline-block', width: '225px' }}
            onChange={onYearChange}
        >
            <div
                style={{
                    padding: '10px',
                    backgroundColor: '#222',
                    textAlign: 'center',
                }}
            >
               TSP version filter
            </div>
            <label
                style={{
                    margin: '10px',
                    padding: '10px',
                    display: 'inline-block',
                    fontSize:'21px'

                }}
            >
                <input type="radio" name="version" value="All" checked={version === 'All'} />{' '}
                All
            </label>
            <label
                style={{
                    margin: '10px',
                    padding: '10px',
                    display: 'inline-block',
                    fontSize:'21px'
                    
                }}
                className=""
            >
                <input type="radio" name="version" value="2010" /> New <i className='mdi mdi-new-box text-success'></i>
            </label>
        </div>
    );
});