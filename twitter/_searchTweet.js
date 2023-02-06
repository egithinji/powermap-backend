const { search_tweet } = require('../rust-modules/pkg/rust_modules');
const area_descs = ['apple', 'maple', 'Snapple'];
const text = 'Nobody likes maple in their apple flavored Snapple.';
const match = search_tweet(text, area_descs);
if (match === -1) {
    console.log(`no match found`);
} else {
    console.log(`match found: ${area_descs[match]}`);
}