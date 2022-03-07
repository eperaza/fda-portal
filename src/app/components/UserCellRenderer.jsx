import React from 'react';

export default (props) => (
  <>
    {
      props.data.accountEnabled == "false"
        ?
        <div>
         {props.data.mailNickname + " "} <i className="mdi mdi mdi-alert-circle text-warning"> </i> 

        </div>

        :
        props.data.mailNickname
    }
  </>
);