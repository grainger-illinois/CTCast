var net = require('net');
const {map} = require("react-bootstrap/ElementChildren");
var host = '127.0.0.1';
var servers = [];
var ports = [10001,10002];

// connect to both ports for testing.

var linesFromBothConnection = new Map();
linesFromBothConnection.set(10001, []);
linesFromBothConnection.set(10002, []);

const footer = Buffer.from("01300d01300d", 'hex');


const compare = () => {
    console.log("\nComparing input from two ports...")
    const input1 = linesFromBothConnection.get(10001), input2 = linesFromBothConnection.get(10002);

    if (input1.length != input2.length) {
        console.log("Inputs from the two ports differ in length.");
    } else {
        let counter = 0;
        linesFromBothConnection.get(10001).forEach((line, i) => {
            if (i > 0 && line != input2[i]) {
                console.log("Inputs differ at line", i);
                console.log("Input from port 10001:", line);
                console.log("Input from port 10002:", input2[i]);
                counter++;
            }
        });
        console.log(counter, "differences found");
    }
}

var times = 0
// Create servers
ports.forEach(function (port) {

    var s = net.createServer(function (sock) {
        // We have a connection - a socket object is assigned to the connection automatically
        console.log('CONNECTED (' + sock.localPort + '): ' + sock.remoteAddress + ':' + sock.remotePort);

        // Add a 'data' event handler to this instance of socket
        sock.on('data', function (data) {
            // post data to a server so it can be saved and stuff
            console.log(port, data.toString());


            // If both ports receive input, for this fake server, we want to compare them
            // This compares the first input sent from each port.

            if (data[0] != 1) {
                linesFromBothConnection.get(port).push(data.toString());
            }



            // Compare the two recorded inputs and reset the recording variables.

            compare();

            console.log("Exact input:");
            console.log(linesFromBothConnection);


        });

        sock.on('error', function (error) {
            console.log('******* ERROR ' + error + ' *******');

            // close connection
            sock.end();
        });
    });

    s.listen(port, host, function () {
        console.log('Server listening on ' + host + ':' + s.address().port);
    });

    servers.push(s);
});

// while(1) {}
