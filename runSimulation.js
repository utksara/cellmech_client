const fs = require("fs");
const { RUNSIMULATION } = require('./lib/beehive.js');
const simulation_file_name = require('./config.json').simulation;
const online_simulation = require(`./lib/simulations/${simulation_file_name}`);
const simulation_to_run = online_simulation;

const run_simulation = async () => {
    let svg_data = await RUNSIMULATION(simulation_to_run);
    fs.writeFileSync('inputoutput/output_data.json', JSON.stringify(svg_data), (err) => {
        if (err) throw err;
    });
    console.log("Simulation run complete");
};

(async () => {
    await run_simulation();
})();