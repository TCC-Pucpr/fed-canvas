const fs = require('fs');
const { dirname } = require('path');
const tauriConfigFile = '../src-tauri/tauri.conf.json';
let tauriConfig = require(tauriConfigFile);

for(let i = 2; i < process.argv.length; i++){
    let operation = "";
    switch(process.argv[i]) {
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
        const currentVer = stdout.split(/\n/)[4].slice(1);
        tauriConfig.package.version = currentVer;
        fs.writeFileSync(`${appDir}/${tauriConfigFile}`, JSON.stringify(tauriConfig, null, 2));
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