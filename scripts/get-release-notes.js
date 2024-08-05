const fs = require('fs');
const changelogFile = 'CHANGELOG.md';
const regex = /(^##\ )/mg;

run();

function run() {
    const regex = /\d*\.\d*\.\d*/;
    const latestVersion = process.argv[2].match(regex)[1];
    fs.readFile(changelogFile, (err, data) => {
        if (err) throw err;
       
        const releases = data.toString().split(regex);
        const notes = releases[1]+releases[2];

        console.log(notes);
      });
}
