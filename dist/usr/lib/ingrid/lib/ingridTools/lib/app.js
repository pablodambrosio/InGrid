const fs = require("fs");
const execFile = require('child_process').execFile;

const Config = require("./config.js");

exports.checkArgs = checkArgs;
exports.showHelp = showHelp;

exports.exec = exec;

/** * **/

function checkArgs(argv) {

    switch (argv._[1]) {
        case "create":
            return checkArgsCreate(argv);
    }

    return false;

}

function showHelp() {
    console.log(fs.readFileSync(__dirname + "/../help/app.txt").toString());
};

function checkArgsCreate(argv) {
    if (argv._.length != 3) {
        console.log("Bad number of arguments.\n");
    } else {
        return true;
    }
}

function exec(argv) {
    switch (argv._[1]) {
        case "create":
            return execCreate(argv);
    }
}


function execCreate(argv) {

    try {
        var config = Config.getConfig();

        if (argv._[2].match(/^[a-z0-9\-\_]+$/i)) {
            var appName = argv._[2];
            console.log("Creating repository...");

            try{
                var gitBareDir = config.gitBareRepo + "/" + appName + ".git";
                fs.mkdirSync(gitBareDir);
                fs.chownSync(gitBareDir,config.git_user_id,config.git_group_id);
                execFile("git", ["init", "--bare", "--shared"],{
                    cwd: gitBareDir
                },(error, stdout, stderr)=>{
                    if (error != null){
                        console.log("Unknown error.");
                        if (argv.v){
                            console.log(stderr);
                        }
                        process.exit(1);
                    }

                    console.log(stdout,stderr);

                    fs.linkSync(__dirname + "/../../../scripts/git/post-receive", gitBareDir + "/hooks/post-receive");

                    // Next

                });
                console.log("7");
            }catch(e){
                if (e.code=="EEXIST")
                    console.log("App exists, use different app name");
                else
                    console.log("Unknown error. Check if bare repositories dir exists.");

                if (argv.v){
                    console.log(e);
                }

                process.exit(1);
            }

        } else {
            console.log("App name should contain only Alphanumeric Characters, '-' or '_' -");
            process.exit(1);
        }
    } catch (e) {
        if (e.lineNumber) {
            console.log("Server config file error on line " + e.lineNumber);
        }else{
            console.log("Unkown error");
            if (argv.v){
                console.log(e);
            }
            process.exit(1);
        }

    }

}





