var connector = require("./lib/connector.js");

exports.getStatus = getStatus;

function getStatus() {
    connector.sendMessage({
        action: "check"
    },function (error,data) {
        if (error == null){
            console.log("server".blue, "[ok]".green);
        }else{
            console.log("server".blue, "[error]".red);
        }
    });
}