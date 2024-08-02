const tauriConfigFile = '../src-tauri/tauri.conf.json';

run();

function run() {
    let tauriConfig = require(tauriConfigFile);
    const tauriVersion = tauriConfig.package.version;     
    const currentTagVersion = process.argv[2].split('v')[1];
    const exec = require('child_process').exec;
    if(!currentTagVersion){
        throw (`Something went very very VERY wrong, and we got no versions from the latest release. Got [${process.argv[2]}], version [${currentTagVersion}]`)
    }
    exec(`npm version`, (err, stdout) => {
        const packageVersion = stdout.split('\n')[1].split('\'')[3];
        if(packageVersion !== tauriVersion){
            throw ('tauri and package version mismatch!\nPlease run \'npm run ver p\' to fix this problem')
        }
        if(tauriVersion === currentTagVersion){
            throw ('The new release must have a different version number than the last one!\nPlease run \'npm run ver p\' to fix this problem')
        }
    });
}