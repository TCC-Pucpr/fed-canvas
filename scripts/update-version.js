const fs = require('fs');
const { dirname } = require('path');
const tauriConfigFile = '../src-tauri/tauri.conf.json';

run();

function run() {

    let tauriConfig = require(tauriConfigFile);
    
    let operation = "";
    switch(process.argv[2]) {
        case "p":
        case "patch":
            operation = "patch"
            break;
        case "m":
        case "minor":
            operation = "minor"
            break;
        case "M":
        case "major":
            operation = "major"
            break;
        case "s":
        case "set":
            if(process.argv<4){
                help();
                return;
            } else {
                operation = process.argv[3].replace('/\D/', '');
            }
            break;
        case "h":
        case "help":
            help();
            return;
        default:
            help();
            return;
    }

    const appDir = dirname(require.main.filename);

    const exec = require('child_process').exec;
    
    exec(`npm version ${operation} --no-git-tag-version`, (err, stdout) => {
        try{
            const currentVer = stdout.split(/\n/)[4].slice(1);
            tauriConfig.package.version = currentVer;
            fs.writeFileSync(`${appDir}/${tauriConfigFile}`, JSON.stringify(tauriConfig, null, 2));
        } catch (error) {
            if(process.argv[2] === "set" || process.argv[2] === "s"){
                console.error('invalid version number, please change it and try again');
            } else {
                console.error('something went wrong!');
            }
        }
    });

}
        
function help(){
    console.log("this script auto updates tauri to match the npm project version");
    console.log("");
    console.log("p patch         ups patch version");
    console.log("m minor         ups minor version");
    console.log("M major         ups major version");
    console.log("");
}