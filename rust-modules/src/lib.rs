mod random;
mod search;
mod utils;

use wasm_bindgen::prelude::*;

/// Takes some text and a list of patterns.
/// If one of the patterns is found in the text, returns the index of the pattern in the list.
/// If multiple patterns are found in the text, returns the longest pattern.
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
/// Returns coordinate of random point within the polygon.
#[wasm_bindgen]
pub fn random_point(coords: JsValue) -> JsValue {
    let coords: Vec<Vec<f64>> = serde_wasm_bindgen::from_value(coords).unwrap();
    let r = random::random_point_impl(&coords[..]);
    serde_wasm_bindgen::to_value(&r).unwrap()
}
