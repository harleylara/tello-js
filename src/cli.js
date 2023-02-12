const wsServer = require('./server.js');
const Tello = require('./tello.js');
const package = require('../package.json');
const readline = require('readline');

const drone = new Tello();

/*
* Default settings
*/
const SSID = 'WIFI'; // station mode
const PASSWORD = '123456789'; // station

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'cmd >> ',
    terminal: true
});

const { Command } = require('commander');
const { connected } = require('process');
const program = new Command();

/*
* Utility function to show information about the cli
* TODO?: info about the OS, node version??
*/
function showInfo(){
    console.log("-----------------------------------")
    console.log("Tello interactive CLI started");
    console.log(`tello-js version: ${package.version}`);
    console.log("-----------------------------------")
}

/*
* Utility function for interactive mode
* @param {String} question text
*/
function ask(questionText) {
    return new Promise((resolve, reject) => {
        rl.question(questionText, (input) => resolve(input) );
    });
}

async function start() {
    const options = this.opts();

    showInfo();

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
    // rl.prompt();
}


async function setWifi(){
    const options = this.opts();

    let ssid = options.ssid;
    let password = options.password;

    showInfo();

    await drone.connect();

    if (drone.connected){

        if (options.interactive === undefined){
            console.log("Set WiFi started in non-interactive")
        } else {
            console.log("Set WiFi started in interactive mode")
            ssid = await ask('Set WiFi SSID: ');
            password = await ask('Set password: ');
        }

        console.log(`WiFi SSID: ${ssid}`);
        console.log(`WiFi password: ${password}`);

        await drone.sendCmd(`wifi ${ssid} ${password}`);
        console.log("The drone will automatically reboot in 3s");
        process.exit(0);

    } else {
        console.log("FAIL to connected");
        process.exit(1);
    }
}

async function setAP(){
    const options = this.opts();

    let ssid = options.ssid;
    let password = options.password;

    showInfo();

    // await drone.connect();

    if (drone.connected){

        if (options.interactive === undefined){
            console.log("Set station-mode started in non-interactive")
        } else {
            console.log("Set station-mode started in interactive mode")
            ssid = await ask('Set Access Point SSID: ');
            password = await ask('Set Access Point password: ');
        }

        console.log(`Access Point SSID: ${ssid}`);
        console.log(`Access Point password: ${password}`);

        await drone.sendCmd(`ap ${ssid} ${password}`);
        console.log("The drone will automatically reboot in 3 seconds");
        process.exit(0);

    } else {
        console.log("FAIL to connected");
        process.exit(1);
    }

}

async function main() {
  program
    program
        .name('tello-core')
        .description('CLI to manage Tello drone')
        .version(package.version);

    program
        .command('start')
        .description('Start communication with the tello drone')
        .option('--drone-ip <type>', 'tello drone IP address', '192.168.10.1')
        .option('--control-port <type>', 'port to send control commands', 8889)
        .option('--state-port <type>', 'port to get drone internal state', 8890)
        .option('--video-port <type>', 'port to get video frames from drone', 11111)
        .option('--video-socket-ip <type>', 'IP address serving video frames over websocket', '0.0.0.0')
        .option('--video-socket-port <type>',  'port to get video frames over websocket', 3001)
        .option('--control-socket-port <type>', 'port to send control commands over websocket', 3000)
        .action(start)

    program
        .command('set-wifi')
        .description("Set Tello's WiFi network")
        .option('-s, --ssid <name>', `name of the drone's wifi network.
                            A prefix is always added, TELO-<your ssid>
                            Default 'TELLO-${SSID}'`, SSID)
        .option('-p, --password <pass>', `set password to connect drone's wifi. Default ${PASSWORD}`, PASSWORD)
        .option('-i, --interactive', "set wifi in interactive mode")
        .action(setWifi)

    program
        .command('set-ap')
        .description("Switch Tello to 'station-mode' and connect to the Access Point (AP)")
        .option('-s, --ssid <name>', `Access Point name`)
        .option('-p, --password <pass>', `Access Point password`)
        .option('-i, --interactive', "set station-mode in interactive mode")
        .action(setAP)

    await program.parseAsync(process.argv);
}

main();
