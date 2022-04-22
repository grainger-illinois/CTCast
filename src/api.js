let axios = require('axios');
let fs = require('fs');
let net = require('net');

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

// Some of these hardcoded values should be passed in as args maybe...
export class ZoomAPI {
    constructor() {
        this.seq = 1;
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
    }
}

// Eventually most of these hardcoded values should become configurable through the UI
export class LinkEncoderAPI {
    constructor() {
        this.csEncoder = 'sce492.cs.illinois.edu';
        this.encoding = 'latin1';
        this.port = 10002;
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
            //console.log(str.substr(0, n));
            //console.log(str.substr(n, str.length - n));

            return [str.substr(0, n)].concat(chunkstring(str.substr(n, str.length - n), str.length - n));
        }
    }

    async sendMessage(caption, port) {
        if (this.port == 10001) {
            this.fieldinsertmode = Buffer.from("01330D01330D", "hex");
            this.newswire = Buffer.from("014E36014E36", "hex");
        } else if (this.port == 10002) {
            this.fieldinsertmode = Buffer.from("01340D01340D", "hex");
            this.newswire = Buffer.from("015046015046", "hex");
        } else {
            console.error("Invalid port given, Should only be 10001 or 10002");
            return 400;
        }
        console.log('Attempting connection');
        await this.connecttoserver(this.port, this.csEncoder);
        console.log('Connected to ' + this.csEncoder + ':' + this.port);

        this.socket.write(this.newswire, this.encoding);
        if (this.omit) {
            for (const invalid_char of this.character_diff_list) {
                caption = this.replaceAllChars(caption, invalid_char, "");
            }
        }
        caption = this.replaceAllChars(caption, '\n', ' ');
        caption = this.replaceAllChars(caption, '\t', ' ');

        let list_of_words = caption.split(' ');
        list_of_words = list_of_words.filter((x) => x != '');

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

            while (true) {
                // if the current and next word combined (including the space between them) is 32 characters or less, combine them together to make a sentence
                if (list_of_words_32.length > 0 && word.length + 1 + (list_of_words_32[0]).length <= this.max_character_number) {
                    let next_word = list_of_words_32.shift();
                    word = word + ' ' + next_word;
                }
                else { // send the word(s)
                    //sendControlCodes(s, row_number_dict[row_number], fieldinsertmode)
                    let newswire_word = word + "\r";
                    this.socket.write(newswire_word, this.encoding);

                    break;
                }
            }

        }
        return 200;
    }
};