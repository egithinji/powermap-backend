// Called when a new polygon is entered via the form in the front end
// Creates a PR containing the new polygon

const { execSync } = require('child_process');
require('dotenv').config();

const pushNewPolygon = () => {
    try {
        console.log(execSync(`git clone https://${process.env.GITHUB_TOKEN}@github.com/egithinji/powermap-backend`).toString());
        console.log(`after cloning, git status output is: ${execSync('git status').toString()}`);
        execSync('git checkout -b newpolygon');
        execSync('git add newPolygon.json');
        execSync('git commit -m "From script: New polygon."');
        execSync(`git remote add origin https://${process.env.GITHUB_TOKEN}@github.com/egithinji/powermap-backend`);
        execSync(`git push https://${process.env.GITHUB_TOKEN}@github.com/egithinji/powermap-backend.git`);
        console.log('finished git commands');
    } catch (err) {
        console.error(`Error pushing new polygon: ${err}`);
    }
}

module.exports = pushNewPolygon;