const axios = require('axios');
var fs = require('fs');

/* This is where we should put the classes that will handle the functionality for communication with zoom and link encoder */
const log_prefix = './logs/log-' // Will eventually be configurable location

/* The basic structure of one of these classes */
export class LoggerWriter {
    constructor() {
        let date = new Date();
        const filename = log_prefix + String(Date.now()) + '.txt';
        this.filename = filename;
        const initial_message = 'Log created at ' + date.getFullYear + '-' + date.getMonth() + '-' + date.getDate() + '\n';
        console.log(process.cwd());
        fs.writeFile(filename, initial_message, err => {
            if (err) {
                console.error('ERROR: Could not initialize file!');
                console.error(err);
            }
        });
    }

    async sendMessage(message) {
        let date = new Date();
        const modified_message = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + ':\t' + message + '\n';
        fs.appendFile(this.filename, modified_message, err => {
            if (err) {
                console.error('ERROR: Could not log message!');
                console.error(err);
            }
        });
        return 200;
    }
}

export class ZoomAPI {
    constructor() {
        console.log("Initialized Zoom API writer.");
    }

    sendMessage(message, meetingLink) {
        
    }
}

export class LinkEncoderAPI {};