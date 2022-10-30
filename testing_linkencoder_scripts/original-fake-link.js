var net = require('net');
var host = '127.0.0.1';
var servers = [];
var ports = [10001,10002];

// Create servers
ports.forEach(function (port) {

var s = net.createServer(function (sock) {
    // We have a connection - a socket object is assigned to the connection automatically
    console.log('CONNECTED (' + sock.localPort + '): ' + sock.remoteAddress + ':' + sock.remotePort);

    // Add a 'data' event handler to this instance of socket
    sock.on('data', function (data) {
        // post data to a server so it can be saved and stuff
        console.log(data.toString());
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