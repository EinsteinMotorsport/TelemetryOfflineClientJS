import React from 'react';

export default (props) => (
    <div>
        Hallo
    {Object.keys(props).map(key => <p key={key}>{key}: {props[key]}</p>)}
    </div>
);
