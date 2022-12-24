use aho_corasick::AhoCorasick;

pub fn search_impl(text: &str, patterns: &[String]) -> Option<usize> {
    let ac = AhoCorasick::new(patterns);
    let mut matches = vec![];
    for mat in ac.find_iter(text) {
        matches.push((mat.pattern(), mat.start(), mat.end()));
    }

    if matches.is_empty() {
        return None;
    }
    if matches.len() > 1 {
        let mut longest = 0;
        for m in matches {
            if patterns[m.0].len() > longest {
                longest = m.0;
            }
        }
        return Some(longest);
    }
    Some(matches[0].0)
}
