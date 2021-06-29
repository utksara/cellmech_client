import * as shapes from './shapes.js';
const ws = new WebSocket("ws://localhost:8082");

class item {
    constructor( id ,shape){
        this.id = id;
        this.shape = shape;
        this.position = shape.center; 
    }
    render() {
        document.getElementById(this.id).setAttribute('points', this.shape.get_points());
        if(this.id == 'cntr1'){
            console.log(document.getElementById(this.id).getAttribute('points'));
        }
    }
}

var list_of_items  = [
    new item('cell', new shapes.jelly(100, [600,250], 5)), 
    new item('nucleus', new shapes.circle(20, [600,250]))
];

function get_item_by_id(id){
    for (var i = 0; i< list_of_items.length ; i++){
        let elem = list_of_items[i];
        if (elem.id == id){
            return elem;
        }
    }
}

function init_setup(){
    // console.log(startime_time);
    document.getElementById("canvas").setAttribute('height',screen.height);
    document.getElementById("canvas").setAttribute('width',screen.width);
    for (let i = 0; i<list_of_items.length; i++){
        let an_item = list_of_items[i];
        an_item.render();
    }
}

let break_sim = true;

function simulate(){
    if (!break_sim){
        for (let i = 0; i<list_of_items.length; i++){
            let an_item = list_of_items[i];
            an_item.render();
        }
    }
}
setInterval(simulate, 10);

init_setup();
document.getElementById("wobble").onclick = function() {break_sim = false;}
document.getElementById("stop").onclick = function() {break_sim = true;}

ws.addEventListener("open", () => {
    console.log("Connection established with server");
});

const xmlns = "http://www.w3.org/2000/svg";

ws.onmessage = function (event) {
    var g = document.createElementNS(xmlns, "g");
    var cntr1 = document.createElementNS(xmlns, "path");
    cntr1.setAttributeNS(null, 'id', "cntr1");
    cntr1.setAttribute(null, 'fill');
    cntr1.setAttributeNS(null, 'd', event.data);
    g.appendChild(cntr1);
    var svgContainer = document.getElementById("canvas");
    svgContainer.appendChild(g);

    list_of_items.push(new item('cntr1', new shapes.anything(event.data)));
}

document.getElementById("contourmesh").onclick = function() {
    // ws.send("cell_membrane ")
    let values = get_item_by_id('cell').shape.center.toString();
    var msg = {
        "functname" : "contourmesh",
        "values" : values
    };
    ws.send(JSON.stringify(msg));
    // ws.send(get_item_by_id('cell').shape.get_points());
}
