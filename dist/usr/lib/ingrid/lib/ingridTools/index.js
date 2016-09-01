const connector = require("./lib/connector.js");
const app = require("./lib/app.js");
const config = require("./lib/config.js");

exports.getStatus = getStatus;
exports.checkConfigFile = config.checkConfigFile;
exports.getConfig = config.getConfig;

exports.app = app;

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
