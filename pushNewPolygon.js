// Called when a new polygon is entered via the form in the front end
// Creates a PR containing the new polygon

const { execSync } = require('child_process');
require('dotenv').config();

const pushNewPolygon = () => {
    try {
        //console.log(execSync(`git init`).toString());
        //execSync(`git remote add origin https://${process.env.GITHUB_TOKEN}@github.com/egithinji/powermap-backend`);
        execSync(`git clone https://${process.env.GITHUB_TOKEN}@github.com/egithinji/powermap-backend.git`);
        execSync(`cp newPolygon.json powermap-backend`);
        const command = `
            cd powermap-backend
            git config user.name egithinji
            git config user.email ericgithinji@gmail.com
            git checkout -b newpolygon
            git add newPolygon.json
            git commit -m "New polygon added"
            git push https://${process.env.GITHUB_TOKEN}@github.com/egithinji/powermap-backend
            cd ..
            rm -r powermap-backend 
        `;
        execSync(command, { stdio: "inherit" });
        console.log('finished git commands');
    } catch (err) {
        console.error(`Error pushing new polygon: ${err}`);
    }
}

module.exports = pushNewPolygon;