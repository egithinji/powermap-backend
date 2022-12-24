use delaunator::triangulate;
use delaunator::Point as DelPoint;
use geo::LineString;
use geo::MultiPolygon;
use geo::Point;
use geo::Polygon;
use js_sys::Math;

//First triangulates the polygon using delaunator triangulation.
//Then generates a random point in one of the triangles
pub fn random_point_impl(coords: &[Vec<f64>]) -> Vec<f64> {
    let poly = get_poly_from_coords(coords);

    //get a reference of the exterior linestring of the polygon
    let ls = poly.exterior();

    //get a vector of delaunator points from the linestring
    let del_points: Vec<DelPoint> = linestring_to_delaunator(ls.clone());

    //triangulate the delaunator points
    let result = triangulate(&del_points);

    //turn triangles into a multipolygon
    let multipolygon = get_polygons_from_triangles(result.triangles, ls);

    //Iterate through the multipolygon of triangles and generate a random
    //point within each
    let mut points: Vec<_> = Vec::new();
    for p in multipolygon.into_iter() {
        points.push(generate_random_point_in_triangle(p));
    }

    //select one of the random points and return it
    let num = Math::floor(Math::random() * points.len() as f64);
    let random_point: (f64, f64) = points[num as usize];

    vec![random_point.0, random_point.1]
}

fn get_poly_from_coords(coords: &[Vec<f64>]) -> Polygon {
    let mut points = Vec::new();
    for coord in coords {
        points.push(Point::new(coord[0], coord[1]));
    }

    Polygon::new(LineString::from(points), vec![])
}

fn linestring_to_delaunator(ls: LineString<f64>) -> Vec<DelPoint> {
    let mut del_points: Vec<DelPoint> = Vec::new();
    for point in ls.points_iter() {
        del_points.push(DelPoint {
            x: point.x(),
            y: point.y(),
        });
    }

    del_points
}

fn get_polygons_from_triangles(
    triangles: Vec<usize>,
    linestring: &LineString<f64>,
) -> MultiPolygon<f64> {
    let mut inner_polys: Vec<Polygon<f64>> = Vec::new();
    let mut coord: Vec<_> = Vec::new();
    let mut count = 0;

    for index in triangles.iter() {
        if count == 3 {
            inner_polys.push(Polygon::new(LineString::from(coord.clone()), vec![]));
            count = 0;
            coord.clear();
        }
        coord.push(linestring[*index].x_y());
        count += 1;
    }

    MultiPolygon::<f64>(inner_polys)
}

fn generate_random_point_in_triangle(triangle: Polygon<f64>) -> (f64, f64) {
    //Using formula from section 4.2 in:
    //https://www.cs.princeton.edu/~funk/tog02.pdf
    //See also https://math.stackexchange.com/questions/18686/uniform-random-point-in-triangle

    let r1: f64 = Math::random();
    let r2: f64 = Math::random();

    let ls = triangle.exterior().clone();

    //get the three vertices of the triangle
    let a = ls[0];
    let b = ls[1];
    let c = ls[2];

    let x = (1.0 - r1.sqrt()) * a.x + r1.sqrt() * (1.0 - r2) * b.x + r1.sqrt() * r2 * c.x;

    let y = (1.0 - r1.sqrt()) * a.y + r1.sqrt() * (1.0 - r2) * b.y + r1.sqrt() * r2 * c.y;

    (x, y)
}
