var net = require('net');
var host = '127.0.0.1';
var servers = [];
const compareMode = process.argv[2] == "-c";
const ports = compareMode ? [10001, 10002, 10003] : [10001, 10002];

// connect to both ports for testing.

var linesFromBothConnection = new Map();
ports.forEach((port) => linesFromBothConnection.set(port, []));

this.rollupcode0 = Buffer.from("1427142D1470", "hex");
this.rollupcode1 = Buffer.from("1427142D1350", "hex");
this.rollupcode2 = Buffer.from("142D1370", "hex");
this.rollupcode3 = Buffer.from("142D1450", "hex");
this.rollupcode4 = Buffer.from("142D1470", "hex");
this.bypass = Buffer.from("01300D01300D", "hex");
this.resetcode = Buffer.from("0F0F", "hex");


const compare = () => {
    console.log("\nComparing input from two ports...")
    const input1 = linesFromBothConnection.get(10003), input2 = linesFromBothConnection.get(10002);

    if (input1.length != input2.length) {
        console.log("Inputs from the two ports differ in length.");
    } else {
        let counter = 0;
        input1.forEach((line, i) => {
            if (line != input2[i]) {
                console.log("Inputs differ at line", i);
                console.log("Input from port 10002:", JSON.stringify(input2[i]));
                console.log("Input from port 10003:", JSON.stringify(line));
                counter++;
            }
        });
        console.log(counter, "differences found");
    }
}

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

            linesFromBothConnection.get(port).push(data.toString());

            // Compare the two recorded inputs and reset the recording variables.

            if (compareMode) {
                compare();

                console.log("Exact input:");
                console.log(linesFromBothConnection);
            }


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

