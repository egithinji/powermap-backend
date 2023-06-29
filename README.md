# power-map.io

The front end repo can be found [here](https://github.com/egithinji/powermap-frontend).

power-map.io was a passion project of mine that displayed a real-time heat map of power outage complaints in Kenya.

It used the Twitter filtered streams API to track public tweets directed at the official Kenya Power Twitter handle (@KenyaPower_Care).

Unfortunately due to the recent changes in Twitter's API pricing, I'm unable to continue pulling this realtime data.  In the meantime, the site is displaying complaints captured on May 28th 2023, just a couple days before it lost access to the Twitter Filtered Streams API.

## Motivation

I once lived in a neighbourhood with very frequent power outages, but there was no way of reliably determining whether the outages were worse in my neighbourhood than others.

Whenever the power would go out, I would often go to Twitter and check for power outage complaints directed at @KenyaPower_Care to get a sense of whether other people were also experiencing power outages.

That's what gave birth to the idea of fetching this data via Twitter's Filtered Streams API, and I thought "Wouldn't it be cool if we could see the complaints pop up in realtime on a heat map?"

## How it worked

Twitter doesn't provide geodata pertaining to a tweet, so how was I able to know where on the heat map to generate a point?

I first manually created about 200 geojson polygons of neighborhoods/areas in Kenya using [https://geojson.io/](). I then associated each polygon with colloquial words that Kenyans typically use when referring to the area. For example the polygon for Westlands would be associated not just with "westlands", but also "westie".

I connected to Twitter's Filtered Streams API to capture all tweets directed at @KenyaPower_Care. As expected, nearly all tweets directed at their Twitter handle were people reporting a power outage and mentioning the area affected.

I did some simple parsing of each tweet to see whether it mentioned an area description in my database. If it did, I then generated a random point within that area's polygon.

It turned out that generating a random point within a polygon wasn't as straightforward as I had thought. The method I settled on involved three steps:
- Breaking up the polygon into triangles using a technique called [Delaunay Triangulation](https://en.wikipedia.org/wiki/Delaunay_triangulation). I found a nice [Rust crate](https://crates.io/crates/delaunator) for this
- Selecting a random triangle from the previous step
- Generating a random point in the selected triangle. There are established techniques for generating random points in a triangle:
    - https://www.cs.princeton.edu/~funk/tog02.pdf (the formula in section 4.2)
    - https://math.stackexchange.com/questions/18686/uniform-random-point-in-triangle

For the actual heat map, I used [Mapbox](https://www.mapbox.com/). I really liked their dark mode heat map design and they have a free tier that was generous enough for my use case.

## Next steps

This was a really fun project to work on. It was really satisfying seeing everything come together and seeing the dots pop up on the heat map in realtime, and actually being able to compare the severity of power outages per neighborhood. 

My goal was to collect power outage complaint data over a significant period of time, and then develop a tool for doing rich analysis on this data.

Now that power-map.io has been cut off from its main source of data, I'm thinking of either pivoting the site to something slightly different, or finding other ways of capturing the same information.

Let me know in the issues if you have any ideas!