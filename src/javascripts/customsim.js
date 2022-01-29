// const ws = new WebSocket("ws://localhost:8082");

const loc = location;  
const new_uri = "ws:" + "//" + loc.hostname + ":" + "8082";
const ws = new WebSocket(new_uri);

// class item {
//     constructor( id ,shape){
//         this.id = id;
//         this.shape = shape;
//         this.position = shape.center; 
//     }
//     render() {
//         document.getElementById(this.id).setAttribute('points', this.shape.get_points());
//         if(this.id == 'cntr1'){
//             console.log(document.getElementById(this.id).getAttribute('points'));
//         }
//     }
// }

let list_of_items =[];

let render = function(elem) {
    // document.getElementById(elem.id).setAttribute('points', elem.svg);
}

let break_sim = false;

function simulate(){
    if (!break_sim){
        for (let i = 0; i<list_of_items.length; i++){
            let an_item = list_of_items[i];
            render(an_item);
        }
    }
}

ws.addEventListener("open", () => {
    console.log("Connection established with server");
});

const xmlns = "http://www.w3.org/2000/svg";
var g = document.createElementNS(xmlns, "g");

ws.onmessage = function (event) {
    const vis_array = JSON.parse(event.data).vis;
    vis_array.forEach(parsed_data => {
        // let parsed_data = JSON.parse(event.data);
        list_of_items.push(parsed_data);
        var line1 = document.createElementNS(xmlns, "path");
        line1.setAttributeNS(null, 'id', parsed_data.id);
        // line1.setAttributeNS(null, 'class', "shapes");
        line1.setAttributeNS(null, 'stroke', parsed_data.stroke);
        line1.setAttributeNS(null, 'stroke-width', parsed_data.width);
        line1.setAttributeNS(null, 'fill', parsed_data.fill);
        line1.setAttributeNS(null, 'fill', 'none');
        line1.setAttributeNS(null, 'd', parsed_data.svg);
        g.appendChild(line1);
        var svgContainer = document.getElementById("canvas");
        svgContainer.appendChild(g);    
    });
    setInterval(simulate, 10);
}