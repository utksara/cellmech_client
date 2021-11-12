const ws = new WebSocket("ws://localhost:8082");

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
    var line1 = document.createElementNS(xmlns, "path");
    line1.setAttributeNS(null, 'id', elem.id);
    line1.setAttributeNS(null, 'stroke', elem.stroke);
    line1.setAttributeNS(null, 'stroke-width', elem.width);
    line1.setAttributeNS(null, 'fill', elem.fill);
    line1.setAttributeNS(null, 'fill', 'none');
    line1.setAttributeNS(null, 'd', elem.svg);

    return line1;
}

let break_sim = false;

function simulate(){
    if (!break_sim){
        // console.log("pushen list_of_items ",list_of_items);
        for (let i = 0; i<list_of_items.length; i++){
            let an_item = list_of_items[i];
            render(an_item);
        }
    }
}

ws.addEventListener("open", () => {
    console.log("Connection established with server");
});

export {ws};

const xmlns = "http://www.w3.org/2000/svg";
const g = document.createElementNS(xmlns, "g");

ws.onmessage = function (event) {
    const vis_array = JSON.parse(event.data).vis;
    vis_array.forEach(parsed_data => {
        // let parsed_data = JSON.parse(event.data);
        console.log("pusheen recieving data");
        list_of_items.push(parsed_data);
        let line1 = render(parsed_data);
        g.appendChild(line1);
        var svgContainer = document.getElementById("canvas");

        console.log("pusheen svgContainer ", svgContainer);
        if (svgContainer != null) {
            svgContainer.appendChild(g);
        }
    });
    setInterval(simulate, 10);
}

