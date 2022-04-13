import * as React from 'react';
import * as ReactDOM from 'react-dom';

function render() {
    ReactDOM.render(<div>
        <h2>Make an http request</h2>
        <button id="get">Make get request</button>
        <br></br>
        <button id="post">Make post request</button></div>, document.body);
}

render();