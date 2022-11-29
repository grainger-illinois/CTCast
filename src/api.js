/* eslint no-constant-condition: 0 */

let axios = require('axios');
let fs = require('fs');
let net = require('net');
let os = require('os');
let path = require('path');

/* This is where we should put the classes that will handle the functionality for communication with zoom and link encoder */
const log_dir = path.join(os.homedir(), 'CTCast', 'logs') // Will eventually be configurable location

/* The basic structure of one of these classes */
export class LoggerWriter {
    constructor() {
        let date = new Date();
        fs.mkdirSync(log_dir,
            {recursive: true}
        )
        const filename =  path.join(log_dir, String(Date.now()) + '.txt');
        this.filename = filename;
        const initial_message = 'Log created at ' + date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate() + '\n';
        console.log(filename);
        fs.writeFile(filename, initial_message, err => {
            if (err) {
                console.error('ERROR: Could not initialize file!');
                console.error(err);
            }
        });
    }

    async sendMessage(message) {
        let date = new Date();
        const modified_message = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + ':\t' + message + '\n';
        fs.appendFile(this.filename, modified_message, err => {
            if (err) {
                console.error('ERROR: Could not log message!');
                console.error(err);
            }
        });
        return 200;
    }
}

export class ShortcutMap {
    constructor() {
        this.shortcuts = new Map();
    }

    async updateShortcutMap(shortcut) {
        
        this.shortcuts = new Map([...this.shortcuts, ...shortcut]);
        return this.shortcuts;
    }

    async getShortcutMap(){
        return this.shortcuts;
    }
}

// Some of these hardcoded values should be passed in as args maybe...
export class ZoomAPI {
    constructor() {
        this.seq = 0;
        this.last_message = null;
    }

    getCurSeq(meetingLink) {
        axios.get(meetingLink + '/seq').then(res => console.log(res)).catch(err => console.log(err));
    }

    async sendMessage(caption, meetingLink) {
        if (this.seq == null) {
            this.getCurSeq(meetingLink);
        }

        const options = {
            method: 'post',
            url:  meetingLink + '&seq=' + this.seq + '&lang=en-US',
            data: caption,
            headers: {
                'Content-Type': 'text/plain'
            }
        }
        await axios(options).then(res => console.log(res)).catch(err => console.log(err));
        this.seq += 1;

        this.last_message = caption;

        return 200;
    }
}

// Eventually most of these hardcoded values should become configurable through the UI
export class LinkEncoderAPI {
    constructor() {
        this.csEncoder = 'sce492.cs.illinois.edu';
        this.encoding = 'latin1';
        this.defaultPort = 10002;
        this.max_character_number = 32;

        this.newswire = null;
        this.fieldinsertmode = null;
        this.omit = true;

        this.rollupcode0 = Buffer.from("1427142D1470", "hex");
        this.rollupcode1 = Buffer.from("1427142D1350", "hex");
        this.rollupcode2 = Buffer.from("142D1370", "hex");
        this.rollupcode3 = Buffer.from("142D1450", "hex");
        this.rollupcode4 = Buffer.from("142D1470", "hex");
        this.bypass = Buffer.from("01300D01300D", "hex");
        this.resetcode = Buffer.from("0F0F", "hex");

        this.row_number_dict = [this.rollupcode1, this.rollupcode2, this.rollupcode3, this.rollupcode4];
        this.row_number = 0;

        this.character_diff_list = ['*', "\\", '\'', '_', '`', '{', '}', '|', '~'];

        this.socket = null;

        this.last_message = null;
    }

    async connecttoserver(port, host) {
        return new Promise(resolve => {
            this.socket = net.createConnection(port, host, () => {
                console.log('Connecting to ' + host + ':' + port);
                resolve();
            });
        });
    }

    replaceAllChars(str, oldStr, newStr) {
        let replacement = "";
        while (replacement != str) {
            replacement = str;
            str = str.replace(oldStr, newStr);
        }
        return str;
    }

    chunkstring(str, n) {
        if (str.length <= n)
            return [str];
        else {
            return str.match(new RegExp('.{1,' + n + '}', 'g')); //split the strings chunks of strings of length 32
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async connectAndDisconnect(host, port) {
        if (host == "") {
            host = this.csEncoder;
        }
        if (port == "") {
            port = this.defaultPort;
        }

        if (port == 10001) {
            this.fieldinsertmode = Buffer.from("01330D01330D", "hex");
            this.newswire = Buffer.from("014E36014E36", "hex");
        } else if (port == 10002) {
            this.fieldinsertmode = Buffer.from("01340D01340D", "hex");
            this.newswire = Buffer.from("015046015046", "hex");
        } else {
            console.error("Invalid port given, Should only be 10001 or 10002");
            return 400;
        }
        
        // reconnecting trigger. Not sure if this works as expected when disconnected
        if (this.socket == null || this.socket.readyState == 'closed') {
            console.log('Attempting connection');
            await this.connecttoserver(port, host);
            console.log('Connected to ' + host + ':' + port);
        }
        else {
            this.socket.destroy();
            this.newswire = null;
            this.fieldinsertmode = null;
            console.log('Disconnected from ' + host + ':' + port);
        }

        return 200;
    }

    async checkConnection() {
        if (this.socket == null || this.socket.readyState == 'closed'){
            return 400;
        }
        else {
            return 200;
        }
    }

    async sendMessage(caption, host, port) {
        if (this.socket == null || this.socket.readyState == 'closed') {
            console.log('Reconnecting');
            if (port == 10001) {
                this.fieldinsertmode = Buffer.from("01330D01330D", "hex");
                this.newswire = Buffer.from("014E36014E36", "hex");
            } else if (port == 10002) {
                this.fieldinsertmode = Buffer.from("01340D01340D", "hex");
                this.newswire = Buffer.from("015046015046", "hex");
            } else {
                console.error("Invalid port given, Should only be 10001 or 10002");
                return 400;
            }
            await this.connecttoserver(port, host);
            console.log('Connected to ' + host + ':' + port);
        }
        
        this.socket.write(this.newswire, this.encoding);
        if (this.omit) {
            for (const invalid_char of this.character_diff_list) {
                caption = this.replaceAllChars(caption, invalid_char, "");
            }
        }
        
        caption = this.replaceAllChars(caption, '\n', ' ');
        caption = this.replaceAllChars(caption, '\t', ' ');
        
        let list_of_words = caption.split(' '); //split the user submitted input on whitespace
        list_of_words = list_of_words.filter((x) => x != ''); //remove empty string elements
        
        if (list_of_words.length == 0) {
            console.log('Caption was empty!');
            return 200;
        }

        let list_of_words_32 = []
        for (let i = 0; i < list_of_words.length; i++) {
            let chunks = this.chunkstring(list_of_words[i], this.max_character_number);
            for (let j = 0; j < chunks.length; j++) {
                list_of_words_32.push(chunks[j]);
            }
        }

        while (list_of_words_32.length > 0) {
            let word = list_of_words_32.shift(); // current word
            // if the current and next word combined (including the space between them) is 32 characters or less, combine them together to make a sentence
            while (true) { 
                // if the current and next word combined (including the space between them) is 32 characters or less, combine them together to make a sentence
                if (list_of_words_32.length > 0 && (word.length + 1 + (list_of_words_32[0]).length <= this.max_character_number)) {
                    let next_word = list_of_words_32.shift();
                    word = word + ' ' + next_word;
                }
                else { // send the word(s)
                    //sendControlCodes(s, row_number_dict[row_number], fieldinsertmode)
                    let newswire_word = word + "\r";
                    await this.sleep(600);
                    this.socket.write(newswire_word, this.encoding);

                    break;
                }
            }

        }
        await this.sleep(1000);
        this.socket.write(this.bypass, this.encoding)

        this.last_message = caption;
        return 200;
    }
}