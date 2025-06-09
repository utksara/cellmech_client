const {SYSTEM, RUNSIMULATION, SIMPLECONNECT, BICONNECT, CHAIN, STACK, MESH, CONNECT, COPY, PATTERN, PROCESS, CONNECTIONS} = require('./beehive.js');
const {bfsTraverse, VISOBJECT} = require('./beehiveUtils.js')
const beehiveUtils = require('./beehiveUtils.js')
const config = require('./../config.json');

const createlog = (logger, message, level) =>{
    if (config.LOGGING){
        if (level === "info"){
            logger.info(message)
            console.log("info log created")
        }
        if (level === "error"){
            logger.error(message)
        }
    }
}

module.exports.calc =require('./calc.js');
module.exports.SYSTEM = SYSTEM;
module.exports.RUNSIMULATION = RUNSIMULATION;
module.exports.CHAIN = CHAIN;
module.exports.STACK = STACK;
module.exports.MESH = MESH;
module.exports.SIMPLECONNECT = SIMPLECONNECT;
module.exports.BICONNECT = BICONNECT;
module.exports.COPY = COPY;
module.exports.PATTERN = PATTERN;
module.exports.bfsTraverse = bfsTraverse;
module.exports.CONNECT = CONNECT;
module.exports.PROCESS = PROCESS;
module.exports.VISOBJECT = VISOBJECT;
module.exports.CONNECTIONS = CONNECTIONS;
module.exports.createlog = createlog;


module.exports.shapes = require('./shapes.js');
const {_reset} = require('./shapes.js');
;
module.exports.reset = ()=>{
    _reset();
    beehiveUtils.list_of_objs = [];
    beehiveUtils.vis_objs = [];
    beehiveUtils.sys_by_id = {};
    beehiveUtils.edge_by_id = {};
    beehiveUtils.execution_order = [];
    beehiveUtils.global_id = 0;
}