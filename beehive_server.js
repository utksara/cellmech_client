const fs = require("fs");
const util = require("util");
const exec = require('child_process').exec;
const { reset, createlog } = require('./lib/dev.js');
const { loggerCreator } = require('./loggerConfig.js');

const exec_promise = util.promisify(exec);

const message_prefix = "server data exchange : ";
const logger = loggerCreator(message_prefix);

function startup_windows() {
    exec(`py ./scripts/startup.py`, (error, stdout, stderr) => {
        if (error !== null) {
            console.log('exec error: ' + error);
        }
        console.log(stderr);
        console.log(stdout);
    });
}

function startup_linux() {
    exec(`python3 ./scripts/startup.py`, (error, stdout, stderr) => {
        if (error !== null) {
            console.log('exec error: ' + error);
        }
        console.log(stderr);
        console.log(stdout);
    });
}

const startup_scripts = () => {
    if (process.platform.includes("win")) {
        startup_windows();
    }
    if (process.platform.includes("linux")) {
        startup_linux();
    }
};

startup_scripts();

const mode = "js"

const run_simulation_async = async (mode) => {
    if (mode === "js") {
        const { RUNSIMULATION } = require('./lib/beehive.js');
        const simulation_file_name = require('./config.json').simulation;
        const simulation_to_run = require(`./lib/simulations/${simulation_file_name}`);
        let svg_data = await RUNSIMULATION(simulation_to_run);
        fs.writeFileSync('inputoutput/output_data.json', JSON.stringify(svg_data), (err) => {
            if (err) throw err;
        });
        console.log("Simulation run complete");
    }
    if (mode === "py") {
        await exec_promise(`python3 ${process.cwd()}/runSimulation.py`);
    }
};

const send_data = async (json_obj, ws, key_string) => {
    const data_to_be_sent = {};
    data_to_be_sent[`${key_string}`] = json_obj;
    createlog(logger, "Sending data to client", "info");
    ws.send(JSON.stringify(data_to_be_sent));
    console.log("Sending data to client");
};

const update_simulation = async (websocket) => {
    createlog(logger, "updated simulation", "info");
    console.log("updating");

    reset();
    try {
        await run_simulation_async(mode);
        let array_of_items = JSON.parse(fs.readFileSync('inputoutput/output_data.json', 'utf8'));
        await send_data(array_of_items, websocket, "vis");
    } catch (error) {
        console.log(error);
        const error_message = "There are errors in the code";
        await send_data(error_message, websocket, "err");
    }
};

const update_text_area = async (websocket, data) => {
    var fileName = data.simulation_request;
    let array_of_items = JSON.parse(fs.readFileSync(`simulations/${fileName}.js`, 'utf8'));
    await send_data(array_of_items, websocket, "text_area");
};

const execute_data_cell_processing = async (websocket) => {
    exec(`./cpp_bins/main`, (error, stdout, stderr) => {
        if (error !== null) {
            console.log('exec error: ' + error);
        }
        console.log(stdout);
        try {
            const output_data = JSON.parse(fs.readFileSync('inputoutput/output_data.json', 'utf8'));
            websocket.send(output_data.data);
        } catch (err) {
            console.error(err);
        }
    });
};

const initiate_simulation = async (websocket) => {
    await update_simulation(websocket);
    console.log("New client connected");
    websocket.on("close", () => {
        console.log("Client has disconnected");
    });
};

const register_data = data => {
    var msg = data.vis;
    fs.writeFileSync('inputoutput/input_data.json', msg, (err) => {
        if (err) throw err;
        console.log('Data written to file');
    });
};

const accept_simulation_from_client = async data => {
    var msg = data.simulation_data;
    fs.writeFileSync('./lib/simulations/livebeehive.js', msg, (err) => {
        if (err) throw err;
        console.log('Data written to file');
    });
};

const accept_simulation_request = async data => {
    var fileName = data.simulation_request;
    fs.copyFile(`simulations/${fileName}.js`, './lib/simulations/livebeehive.js', (err) => {
        if (err) throw err;
        console.log('Data written to file');
    });
};

const WebSocketServer = require('ws').Server;
const wss = new WebSocketServer({ port: 8082 });

wss.on("connection" , async ws => {
    initiate_simulation(ws);
    ws.onmessage =(async blobdata => {
        const data = JSON.parse(blobdata.data);
        const message = "received data from client as " + JSON.stringify(data)
        createlog(logger, message, "info");
        if ("simulation_data" in data){
            console.log("received simulation data from cleint");
            const message = "received simulation data from cleint ";
            createlog(logger, message, "info");

            await accept_simulation_from_client(data);
            await update_simulation(ws);
        }
        if ("cellmech_data" in data){
            console.log("received cell data from cleint");
            const message = "received cell data from cleint ";
            createlog(logger, message, "info");

            register_data(data);
            await execute_data_cell_processing(ws);
        }
        if ("simulation_request" in data){

            console.log("received simulation request from cleint");
            const message = "received simulation request from cleint ";
            createlog(logger, message, "info");

            await accept_simulation_request(data);
            await update_simulation(ws);
            await update_text_area(ws, data);

        }
    });
});