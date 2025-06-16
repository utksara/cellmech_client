const objects = require('./Objects');
const { execProm, colorMap } = require('./calc.js');

const _OBJECT = (params = {}, initializer ={})=>{
    Object.keys(initializer).forEach(key => {
        if (params[key]  === undefined){
            params[key] = initializer [key]
        }
    });
    return params;
}

const VISOBJECT = (params = {}) => {    
    const update_vis_element = function(params){
        params._param = params.GEOMETRY(params._param);
    }

    let initializer = {
        "GEOMETRY" : "none",
        "_param": {},
        "REPRESENTS" : "none",
        "minval" : 0,
        "maxval" : 0,
    }

    let new_obj = _OBJECT(params, initializer)

    new_obj.update = () => {update_vis_element(new_obj)}

    return new_obj;
}

function safe_push(object, key, value){
    try{
        object[key].push(value)
    }catch{
        object[key] = [push(value)]
    }
}

function safe_append(object, key, value, default_val){
    try{
        object[key] += value
    }catch{
        object[key] = default_val + value
    }
}

const VISDATA = (params = {}) => {
    initializer = {
        "point" : {},
    }
    return _OBJECT(params, initializer)
}

let list_of_objs = [];
let vis_objs = [];
let sys_by_id = {};
let edge_by_id = {};
let execution_order = [];
let global_id = 0;

const dfsTraverse = function(system, param = "ID") {
    let visited = []
    let traversal = []
    function _dfsTraverse(system){
        traversal.push(system[param])
        visited.push(system.ID)
        system.TO.forEach(subsys_id => {
            let subsys = sys_by_id[subsys_id]
            if (!visited.includes(subsys.ID)){
                _dfsTraverse(subsys)
            }
        });
    }
    _dfsTraverse(system)
    return traversal;
}

const bfsTraverse = function (system, func = (system, accumulator =[]) => {console.log(system.ID)}, accumulator = []){
    traversal_array = [system.ID]
    visited = []
    while(traversal_array.length > 0 ){
        thissys = sys_by_id[traversal_array[0]]
        traversal_array.splice(0,1)
        func(thissys, accumulator)
        thissys.TO.forEach(child_id => {
            let child = sys_by_id[child_id]
            if (!visited.includes(child.ID) ){
                visited.push(child.ID)
                traversal_array.push(child.ID)
            }
        }); 
    }
}


let calculate_vis_objs = async (interm_vis_objs) => {
    let rotation_angle = 0.0; // in radians, 30 degrees
    let data_length = interm_vis_objs.point.center.length
    let processed_vis_objs = {
        "id": [],
        "svg": [],
        "fill": [],
        "stroke": [],
        "width": []
    }
    let cpp_input = `./cpp_bins/main multiline contagious "`

    let max_quant = -100000, min_quant = 100000;
    for (let i = 0; i < data_length; i++) {

        cpp_input += interm_vis_objs.point.center[i]  + ' ' + rotation_angle.toString() + ' ' + interm_vis_objs.point.length[i] + ' '
        if (Number(interm_vis_objs.point.quantity[i]) > max_quant) { max_quant = interm_vis_objs.point.quantity[i] }
        if (Number(interm_vis_objs.point.quantity[i]) < min_quant) { min_quant = interm_vis_objs.point.quantity[i] }
        processed_vis_objs.fill[i] = 'none'
        processed_vis_objs.id[i] = `shape${i}`
        processed_vis_objs.width[i] = '1'
    }

    cpp_input += '"';
    let cpp_output = (await execProm(cpp_input)).stdout.split("  ");
    
    for (let i = 0; i < data_length; i++) {
        let coords = cpp_output[i].split(" ")

        // processed_vis_objs.svg[i] = "M " + coords[0] + ' ' + coords[1] + " Z";
        processed_vis_objs.svg[i] = "M " + (Number(coords[0].split(",")[0]) + 0).toString() + ',' +
        (Number(coords[0].split(",")[1]) + 0).toString() + ' ' +
        (Number(coords[1].split(",")[0]) + 0).toString() + ',' +
        (Number(coords[1].split(",")[1]) + 0).toString() + " Z";
        processed_vis_objs.stroke[i] = colorMap(Number(interm_vis_objs.point.quantity[i]), max_quant, min_quant)
    }

    return objects.TABULAR_OBJECT(processed_vis_objs)
}

const get_vis_object = async (vis_objs) => {
    let interm_vis_objs = objects.NESTED_TABULAR_OBJECT({
        'point': {
            "center": [],
            "length": [],
            "quantity": []
        }
    })
    vis_objs.forEach(vis_obj => {
        interm_vis_objs.add(objects.morph(vis_obj, {
            "shape_type": ["center", "length", "quantity"]
        }))
    });

    // DebugVisObject("DEBUGVISOBJECT : ", interm_vis_objs.point.quantity)
    let svg_data = (await calculate_vis_objs(interm_vis_objs)).enlist()

    return svg_data;
}

module.exports = {
    dfsTraverse,
    safe_push,
    safe_append,
    bfsTraverse,
    list_of_objs,
    vis_objs,
    sys_by_id,
    edge_by_id,
    VISOBJECT,
    execution_order,
    execution_order,
    global_id,
    get_vis_object
}
