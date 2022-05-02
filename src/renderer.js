/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */


import './index.css';
import './app.jsx'
import * as ReactDOM from 'react-dom';
import React from 'react'
import Options from "./components/Options.js"

/*
  2022/04/28: It seems that when the import bug is fixed in this file, 
  the renderer in app.jsx is no longer called.
  Consider removing afterwards.
*/


function render() {
    ReactDOM.render(
        <div>
            <Options window = {window}/>
            
        </div>, 
    document.body);
}

render()
