import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './App.css';
import Options from "./components/Options.js"

function render() {
    ReactDOM.render(
        <div style={{
            position: 'absolute', left: '50%', top: '50%',
            transform: 'translate(-50%, -50%)'
          }}>
            <Options/>
          </div>, 
    document.body);
}

render();