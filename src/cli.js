const wsServer = require('./server.js');
const Tello = require('./tello.js');
const package = require('../package.json');
const readline = require('readline');

const drone = new Tello();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'cmd > ',
    terminal: true
});

/**
* Tello Connection arguments
* Initialize UDP connection with the Tello drone
* @param {tello_ip} drone IP (INPUT)
* @param {control_port} port used to send control cmds (INPUT)
* @param {state_port} port used to pull drone state variables (INPUT)
* @param {video_port} video streaming port from Tello drone (INPUT)
* @param {video_socket_ip} ip used to expose video frames (OUPUT)
* @param {video_socket_port} port used to provide video frame from drone (OUPUT)
*/

/**
* Initialize WebSocket server for send control commands
* @param {control_port} port used to send control cmds TO the WebSocket Server
*                       NOT to be confused with drone UDP socket port control. (OUPUT)
*/

// TODO

// CLI commands:
// command
// config

const { Command } = require('commander');
const program = new Command();

async function start() {
    const options = this.opts();

    console.log("-----------------------------------")
    console.log("Tello interactive CLI started");
    console.log(`tello-js version: ${package.version}`);
    console.log("-----------------------------------")
    console.log(`Drone IP: ${options.droneIp}`);
    console.log(`Control port: ${options.controlPort}`)
    console.log(`State port: ${options.statePort}`)
    console.log(`Video port: ${options.videoPort}`)
    console.log(`Video socket ip: ${options.videoSocketIp}`);
    console.log(`Video socket port: ${options.videoSocketPort}`);
    console.log(`Control socket port: ${options.controlSocketPort}`)
    console.log("-----------------------------------")

    await drone.connect(
        tello_ip        = options.telloIp,
        control_port    = options.controlPort,
        state_port      = options.statePort,
        video_port      = options.videoPort,
        video_socket_ip = options.videoSocketIp,
        video_socket_port = options.videoSocketPort

    )

    if (drone.connected){

        const server = new wsServer(drone, 
            control_port = options.controlSocketPort
        );

        // drone.sendCmd('streamon');
        // drone.initFfmpeg();

        rl.on("line", cliInput);

    } else {
        console.log("FAIL to connect");
    }
}


async function cliInput(input){
    if (input === "exit"){
        rl.close();
    }
    await drone.sendCmd(input);
    rl.prompt();
}

async function main() {
  program
    program
        .name('tello-core')
        .description('CLI to manage Tello drone')
        .version(package.version);

    program
        .command('start')
        .option('--drone-ip <type>', 'Tello drone IP address', '192.168.10.1')
        .option('--control-port <type>', 'Port to send control commands', 8889)
        .option('--state-port <type>', 'Port to get drone internal state', 8890)
        .option('--video-port <type>', 'Port to get video frames from drone', 11111)
        .option('--video-socket-ip <type>', 'IP address serving video frames over websocket', '0.0.0.0')
        .option('--video-socket-port <type>',  'Port to get video frames over websocket', 3001)
        .option('--control-socket-port <type>', 'Port to send control commands over websocket', 3000)
        .action(start)
  await program.parseAsync(process.argv);
}

main();
