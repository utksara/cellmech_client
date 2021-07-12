import * as index from './index.js';


function get_time(){
    var d = new Date();
    return (d.getTime())/1000;
}

function add_coords(array1, array2){
    let sum = []
    for (var i = 0; i < array1.length; i++)
        sum.push([array1[i][0] + array2[i][0], array1[i][1] + array2[i][1]]);
    return sum;
}

function create_circle(radius, center, no_of_points){
    let coords = [];
    const delta = 2 * Math.PI/(no_of_points-1);
    for (var theta = 0; theta < 2 * Math.PI; theta += delta){
        var point = [center[0] + radius * Math.cos(theta), center[1] + radius * Math.sin(theta)]
        coords.push(point);
    }
    return coords;
}

function create_fluctuations(magnitude, no_of_points, phase = Math.PI/2){
    let random_fluct = 0.1*(Math.random() -0.5)
    const A = 0.33 * magnitude;
    const B = 0.33 * magnitude;
    const C = 0.33 * magnitude;
    const f = 2;
    let points = []
    const delta = 2 * Math.PI/(no_of_points-1);
    for (var theta = 0; theta < 2 * Math.PI; theta += delta){
        var r = (A*Math.sin(f * theta) + B*Math.sin( 2 * theta + phase) + C*Math.sin( 3 * theta));
        points.push([r*Math.cos(theta), r*Math.sin(theta)]);
    }
    return points;
}

class shape{
    constructor(){
        this.array_of_points = [];
        this.string_of_points = '';    
    }
    genereate_string_of_points(){
        this.string_of_points = '';
        for (var i = 0; i < this.array_of_points.length; i++){
            this.string_of_points = this.string_of_points.concat(this.array_of_points[i][0].toString(), ",", this.array_of_points[i][1].toString()," ");
        }
    }
}

class circle extends shape{
    constructor(radius, center){
        super();
        this.radius = radius;
        this.center = center;
        this.array_of_points;
        this.calculate_points();
    }
    calculate_points(){
        let no_of_points = 300;
        this.array_of_points = create_circle(this.radius, this.center, no_of_points);
    }
    get_points(){
        this.calculate_points();
        this.genereate_string_of_points();
        return this.string_of_points;
    }
}

class jelly extends shape{
    constructor (radius, center, speed){
        super();
        this.radius = radius;
        this.center = center;
        this.speed = speed;
        this.isdynamic == true;
        this.calculate_points();
    }
    calculate_points(){
        let time = get_time();
        let no_of_points = 100;
        if (this.speed === undefined){
            this.speed = 1;
        }
        let phase = time*this.speed;
        let points1 = create_circle(this.radius, this.center, no_of_points);
        let points2 = create_fluctuations(this.radius/10, no_of_points, phase);
        this.array_of_points =  add_coords(points1, points2);
    }
    get_points(){
        this.calculate_points();
        this.genereate_string_of_points()
        return this.string_of_points;
    }
}

class anything extends shape{
    constructor (string_of_points){
        super();
        this.isdynamic == false;
        this.string_of_points = string_of_points
        this.calculate_points();
    }
    calculate_points(){
        // this.array_of_points = add_coords(points1, points2);
    }
    get_points(){
        // this.calculate_points();
        // this.genereate_string_of_points()
        return this.string_of_points;
    }
}

export {
    circle,
    jelly,
    anything
}