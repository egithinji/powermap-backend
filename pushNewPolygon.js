// Called when a new polygon is entered via the form in the front end
// Creates a PR containing the new polygon

const { exec } = require('child_process');
require('dotenv').config();

const pushNewPolygon = () => {
    try {
        exec('git checkout -b newpolygon');
        exec('git add newPolygon.json');
        exec('git commit -m "From script: New polygon."');
        exec('git push origin newpolygon');
        console.log('finished git commands');
    } catch (err) {
        console.error(`Error pushing new polygon: ${err}`);
    }
}

module.exports = pushNewPolygon;