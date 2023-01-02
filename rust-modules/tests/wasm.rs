use rust_modules::{random_point, search_tweet};
use wasm_bindgen::prelude::*;
use wasm_bindgen_test::*;

#[wasm_bindgen_test]
fn search_functionality_works() {
    let area_descs = vec!["apple", "maple", "Snapple"];
    let text = "Nobody likes maple in their apple flavored Snapple.".to_string();

    assert_eq!(
        search_tweet(text, serde_wasm_bindgen::to_value(&area_descs).unwrap()),
        2
    );
}

#[wasm_bindgen_test]
fn only_matches_separate_words_works() {
    let area_descs = vec!["embu", "pangani", "langata"];
    let text = "RT @systembuisnesses your partner of choice.".to_string();

    assert_eq!(
        search_tweet(text, serde_wasm_bindgen::to_value(&area_descs).unwrap()),
        -1
    );
}

#[wasm_bindgen_test]
fn get_random_point_works() {
    let coords = [
        [34.10327911376953, 0.4679007974068897],
        [34.09362316131592, 0.4585884720970073],
        [34.12031650543213, 0.4480316278451816],
        [34.126152992248535, 0.45936092350851426],
        [34.10327911376953, 0.4679007974068897],
    ];
    let point = random_point(serde_wasm_bindgen::to_value(&coords).unwrap());
    let point: Vec<f64> = serde_wasm_bindgen::from_value(point).unwrap();
    assert_eq!(point.len(), 2);
}
