mod random;
mod search;
mod utils;

use wasm_bindgen::prelude::*;

/// Takes text from a tweet and a list of patterns.
/// If one of the patterns is contained in the text, returns the index of the pattern in the list.
/// Returns -1 if none of the patterns are in the text.
#[wasm_bindgen]
pub fn search_tweet(text: String, patterns: JsValue) -> i32 {
    let patterns: Vec<String> = serde_wasm_bindgen::from_value(patterns).unwrap();
    if let Some(index) = search::search_impl(&text, &patterns[..]) {
        index as i32
    } else {
        -1
    }
}

/// Takes a list of coordinates describing a polygon.
/// Returns a random coordinate within the polygon.
#[wasm_bindgen]
pub fn random_point(coords: JsValue) -> JsValue {
    let coords: Vec<Vec<f64>> = serde_wasm_bindgen::from_value(coords).unwrap();
    let r = random::random_point_impl(&coords[..]);
    serde_wasm_bindgen::to_value(&r).unwrap()
}

#[cfg(test)]
mod tests {
    use crate::random_point;
    use crate::search_tweet;

    /*#[test]
    fn search_tweet_works() {
        assert_eq!(search_tweet(), "Snapple".to_string());
    }*/

    /*#[test]
    fn get_random_point_works() {
        /*let coords = [
            [34.10327911376953, 0.4679007974068897],
            [34.09362316131592, 0.4585884720970073],
            [34.12031650543213, 0.4480316278451816],
            [34.126152992248535, 0.45936092350851426],
            [34.10327911376953, 0.4679007974068897],
        ];*/
        random_point();
        //println!("{:?}", random);
        assert_eq!(true, false);
    }*/
}
