var ipc = require('node-ipc');

exports.sendMessage = sendMessage;

function sendMessage(message, callback) {
    ipc.config.id   = 'toolkit';
    ipc.config.retry= 1500;
    ipc.config.silent = true;

    var ipcs;

    ipc.connectTo(
        'ingrid-server-hj76h',
        function(){
            ipcs = ipc.of['ingrid-server-hj76h'];
            ipcs.on(
                'connect',
                function(){
                    ipcs.emit(
                        'message', message
                    )
                }
            );
            ipcs.on(
                'disconnect',
                function(){
                    if (callback) callback("Unexpected disconnection", null);
                    ipc.disconnect('ingrid-server-hj76h');
                    callback = null;
                }
            );
            ipcs.on(
                'message',  //any event or message type your server listens for
                function(data){
                    if (callback) {
                        callback(null, data);
                        callback = null;
                    }
                    ipc.disconnect('ingrid-server-hj76h');
                }
            );
        }
    );
}



