use regex::Regex;

pub fn search_impl(text: &str, patterns: &[String]) -> Option<usize> {
    let mut matches = vec![];
    for (index, pattern) in patterns.iter().enumerate() {
        // Match when the pattern when it appears in the text of the tweet
        // preceded or followed by punctuation or when it is at
        // the beginning of the text.
        let p = format!("(^|[ ,.?]){}($|[ ,.!?])", pattern);
        let re = Regex::new(&p).unwrap();
        if re.is_match(text) {
            matches.push(index);
        }
    }

    if matches.is_empty() {
        return None;
    }
    if matches.len() > 1 {
        let mut longest = 0;
        for i in matches {
            if patterns[i].len() > longest {
                longest = i;
            }
        }
        return Some(longest);
    }
    Some(matches[0])
}
