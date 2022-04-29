import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './App.css';
import Options from "./components/Options.js"

function render() {
    ReactDOM.render(
        <div >
            <Options/>
          </div>, 
    document.body);
}

render();