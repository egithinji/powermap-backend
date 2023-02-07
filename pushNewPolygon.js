// Called when a new polygon is entered via the form in the front end
// Creates a PR containing the new polygon

const { execSync } = require('child_process');
require('dotenv').config();

const pushNewPolygon = () => {
    try {
        //console.log(execSync(`git init`).toString());
        execSync('git config user.name egithinji');
        execSync('git config user.email ericgithinji@gmail.com');
        //execSync(`git remote add origin https://${process.env.GITHUB_TOKEN}@github.com/egithinji/powermap-backend`);
        execSync(`git clone https://${process.env.GITHUB_TOKEN}@github.com/egithinji/powermap-backend.git`);
        execSync(`cp newPolygon.json powermap-backend`);
        execSync(`cd powermap-backend`);
        execSync(`git checkout -b newpolygon`);
        execSync(`git add newPolygon.json`);
        execSync(`git commit -m 'New polygon added'`);
        console.log(execSync(`git push https://${process.env.GITHUB_TOKEN}@github.com/egithinji/powermap-backend`).toString());
        execSync(`cd ..`);
        execSync(`rm -r powermap-backend`);
        console.log('finished git commands');
    } catch (err) {
        console.error(`Error pushing new polygon: ${err}`);
    }
}

module.exports = pushNewPolygon;