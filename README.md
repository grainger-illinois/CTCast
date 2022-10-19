# CTCast

A tool to broadcast captions and text descriptions.

# License

Source code and is available under the Apache License 2.0 (https://www.apache.org/licenses/LICENSE-2.0.txt), copyright (C) Board of Trustees, University of Illinois 2021-2022.

# Installation
We currently target Node 16 (check the latest build actions). Node Verson Manager (nvm) is useful to select a particular version of Node.
Development of this requires node/npm to work. Install node, and then clone this repo to get started. cd into the directory and run `npm install` to install node dependencies, and run `npm start` to start the application.

# Structure
The app consists of a frontend located in src/renderer.js and components in src/components. These components make up the pages in the app, and they are rendered through a router which switches pages internally in the app.
The backend has the core functionality of the app which sends captions to Zoom/Link Encoder and receives the responses. It uses electrons ipc api to communicate with the frontend (which is defined in preload.js and main.js).
Overall, the frontend takes a caption, and sends it to the backend, which sends it to its destination, receives a response, and sends it back to the frontend.

- LinkEncoder.js : Contains the UI code for the Link Encoder user page
- zoom/zoom.js : Contains the UI code for the Zoom user page
- UploadFiles.js : Contains the UI code for the shortcuts upload user page
- home.js : Contains the UI code for the home page of the app
- Options.js : Contains the routing code to send users to the right page when clicking buttons
- commandReplacer.js : Contains the code that replaces shortcuts with their actual values
- preload.js : Contains the definitions of frontend functions calls to backend events for ipc interface
- main.js : Contains the main process code for electron and handles the incoming events
- renderer.js : Contains the renderer process code and renders the components
- api.js : Contains the backend functionality for sending information to Zoom and Link Encoder

# Usage
To use the app, first decide if you want to send captions to Zoom or Link Encoder. To send captions to Zoom, you need the Zoom API key for the meeting and input it into the UI. Afterwards, typing in captions and hitting send will automatically send them to Zoom to be displayed in the meeting. For Link Encoer the process is simple. Enter the address that the Link Encoder is hosted on, and a port number (either 10001 or 10002), and any captions will be formatted and sent to the Link Encoder to be outputted by it.

In order to pack the app and create an executable, it is necessary to run the comand `npm run make` from the CMD. Then a new folder called out will appear, click it, then click the ctcastwin-... folder and you will find there the executable, called "ctcast.exe".
