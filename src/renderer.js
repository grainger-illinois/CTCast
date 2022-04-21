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

const zoomLink = 'https://us02wmcc.zoom.us/closedcaption?id=5710184328&ns=VGFlIEluIEd1J3MgUGVyc29uYWwgTWVldGluZyBS&expire=86400&sparams=id%2Cns%2Cexpire&signature=IUbL1cU78qASvg-BJD2TCvfujKNziJW5z4qbVvyCUbc.AG.QggVe2480KHzUeUozjNjtJknjdmjUW8OtZ6UNgslm7j_JNmgz_jeh6HOqJ5oVkIzRAJyeUFewKUDls3NE_ys8ec-xaZTnFdj0YmrdOh9bEXPAW-73JVeQXVfNGrfZtMaHgrVdxOsCp-zmqG7iWi8zcs6psa8PnU.RVQ9cC2rGxP3okSDSCcXWA.H39xnWHTDAlbyaPq'

const getbutton = document.getElementById('get');
getbutton.addEventListener('click', async () => {
    const res = await window.zoomAPI.zoomCaption('Test Caption baby!', zoomLink);
    console.log(res);
})

const postbutton = document.getElementById('post');
postbutton.addEventListener('click', async () => {
    const res = await window.loggerAPI.logMessage('Post button was clicked!');
    console.log(res);
})