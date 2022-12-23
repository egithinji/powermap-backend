const path = require('path');
const fs = require('fs');

exports.getAreaDesc = function(text) {
    const strings = text.split('=>');
    const desc = strings[0].trim();
    const p = strings[1].trim();
    const file =  path.parse(p);
    //console.log(`desc: ${desc} polygon name: ${file.name}`);
    return {
        areaDesc: desc,
        polygonName: file.name
    };
}