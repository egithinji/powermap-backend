// Called when a new polygon is entered via the form in the front end
// Creates a PR containing the new polygon

const { exec } = require('child_process');
require('dotenv').config();

const pushNewPolygon = () => {
    try {
        exec('git checkout -b newpolygon');
        exec('git add newPolygon.json');
        exec('git commit -m "From script: New polygon."');
        exec(`git remote add origin https://${process.env.GITHUB_TOKEN}@github.com/egithinji/powermap-backend`)
        exec('git push');
        console.log('finished git commands');
    } catch (err) {
        console.error(`Error pushing new polygon: ${err}`);
    }
}

module.exports = pushNewPolygon;