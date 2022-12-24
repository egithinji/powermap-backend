/* tslint:disable */
/* eslint-disable */
/**
* Takes text from a tweet and a list of patterns.
* If one of the patterns is contained in the text, returns the index of the pattern in the list.
* Returns -1 if none of the patterns are in the text.
* @param {string} text
* @param {any} patterns
* @returns {number}
*/
export function search_tweet(text: string, patterns: any): number;
/**
* Takes a list of coordinates describing a polygon.
* Returns a random coordinate within the polygon.
* @param {any} coords
* @returns {any}
*/
export function random_point(coords: any): any;
