const path = require('path');
const fs = require('fs');

exports.getPolygon = function(filepath) {
    const file = path.parse(filepath);
    try {
        let data = fs.readFileSync(filepath, 'utf-8');
        data = `[${data}]`;
        let coord = JSON.parse(data);
        const polygon = {
            area: file.name,
            coordinates: coord
        }
        return polygon;
    } catch(err) {
        console.error(err);
    }
}