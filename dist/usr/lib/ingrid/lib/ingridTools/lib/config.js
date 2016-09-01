const fs = require("fs");

const SERVER_CONFIG_FILE = "/Users/pablo/Documents/independientes/ingrid/dist/etc/ingrid/server";
const TOOLKIT_CONFIG_FILE = "/Users/pablo/Documents/independientes/ingrid/dist/etc/ingrid/toolkit";

exports.getConfig = getConfig;
exports.checkConfigFile = checkConfigFile;


function getConfig(returnConfig) {
    return checkConfigFile(true);
}

function checkConfigFile(returnConfig) {

    var fileData = fs.readFileSync(SERVER_CONFIG_FILE).toString();

    var config =  {
        gitBareRepo:null,
        appsConfigData:null,
        appsContainersPath:null
    };

    var lines = fileData.split("\n");

    for (var i = 0; i < lines.length; i++){

        // Ignore comments and emptylines
        if (lines[i][0] == "#" || lines[i] == "") continue;

        var lineNumber = i + 1;
        var params = lines[i].split("=");

        if (params.length != 2 && lines[i] != ""){

            var error = new Error("Malformed line");

            error.errorType = "Malformed line";
            error.lineNumber = lineNumber;

            throw (error);

        }else if (lines[i][lines[i].length -1] != ";"){
            var error = new Error("Missing semicolon at line end.");

            error.errorType = "Missing semicolon";
            error.lineNumber = lineNumber;

            throw (error);
        }else{
            var name = params[0].trim();
            var data = params[1].slice(0,-1).trim();

            if (name == "git_bare_repo"){
                config.gitBareRepo = data;
            }else if(name == "apps_config_data"){
                config.appsConfigData = data;
            }else if(name == "apps_containers_path"){
                config.appsContainersPath = data;
            }else if(name == "nginx_config"){
                config.nginx_config = data;
            }
        }
    }

    if (returnConfig)
        return config;

}