const dgram = require('dgram');
const webSocket = require('ws');
const child_process = require('child_process');
const stateDefinition = require('./stateDefinition.json');
const droneConfig = require('../drone.json');

class Tello {
    /**
     * @constructor
     * @param {String} tello_ip Drone IP adress to bind to (control commands).
     * @param {Number} control_port UDP port to send control commands and receive answers
     * @param {Number} state_port UDP port to receive drone state
     */
    constructor() {

        // Control commands UDP Client
        this.controlClient = dgram.createSocket("udp4");

        // Drone State UDP Server
        this.stateServer = dgram.createSocket("udp4");

        // Drone State Object
        this.state = {};
        this.raw_state;
        this.stateDefinition = stateDefinition;

        this.ffmpegProcess;
        this.isStreaming = false;
        this.ffmpegRunnig = false;
        this.frame; // video frame

        this.connected = false;
        this.executing = false;

    }

    /*
     * Initialize callbacks for the UDP control commnads client
     */
    initControlClient() {
        this.controlClient.on("message", (msg, rinfo) => {
            const response = msg.toString();
            console.log(`Drone response: ${response} from ${rinfo.address}:${rinfo.port}`);

            if (response === "ok") {
                this.executing = false;
            }
        });

        this.controlClient.on('error', (error) => {
            if (error) {
                console.log(error);
                this.controlClient.close();
            }
        });

        this.controlClient.on("listening", () => {
            console.log("established connection.");
        });
    }

    /*
     * Initialize callbacks for the UDP drone state server
     */
    initStateServer() {
        this.stateServer.on("message", (msg, rinfo) => {
            const response = msg.toString().trim();// cleanup msg
            this.raw_state = response;
            this.state = this.parseState(response);
        });

        this.stateServer.on('error', (error) => {
            if (error) {
                console.log(error);
            }
        });

        this.stateServer.on("listening", () => {
            console.log("State Server: established connection.");
        });
    }

    /*
     * Initialize callbacks for the WebSocket used for video streaming
     */
    initVideoSocket() {
        this.videoSocket.on('connection', (ws) => {
            console.log('New client connected to video socket.');

            // broadcast video stream to all clients
            ws.on('message', (msg) => {
                this.videoSocket.clients.forEach((client) => {
                    if (client.readyState === webSocket.OPEN) {
                        client.send(this.getFrame());
                    }
                });
            });
        });
        console.log(`Video Socket Server started on ${this.VIDEO_SOCKET_IP}:${this.VIDEO_SOCKET_PORT}`);
    }

    /*
     * Delay helper in ms
     * @param {Number} time delay time in milliseconds
     */
    wait(time) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(this);
            }, time);
        });
    }

    /**
     * Send a raw command (following the SDK format)
     * @param {String} command Command to send
     */
    sendCmd(cmd) {
        return new Promise((resolve, reject) => {
            const msg = Buffer.from(cmd);

            this.controlClient.send(msg, 0, msg.length, this.CONTROL_PORT, this.TELLO_IP, (error) => {
                if (error) {
                    console.log("Error sending comand...");
                } else {
                    console.log(`Command "${cmd}" sent to ${this.TELLO_IP}:${this.CONTROL_PORT}`);
                    resolve(this);
                }
            })
        })
    }


    connect(tello_ip, control_port, state_port, video_port) {
        this.HOST = droneConfig["host"] || "0.0.0.0";
        this.TELLO_IP = tello_ip || droneConfig["drone"]["ip"] || "192.168.10.1";
        this.CONTROL_PORT = control_port ||  droneConfig["drone"]["controlPort"] || 8889;
        this.STATE_PORT = state_port || droneConfig["drone"]["statePort"] || 8890;
        this.VIDEO_PORT = video_port || droneConfig["drone"]["videoPort"] || 11111;

        this.controlClient.bind(this.CONTROL_PORT);
        this.initControlClient();

        this.stateServer.bind(this.STATE_PORT);
        this.initStateServer();

        // Video Socket
        this.VIDEO_SOCKET_IP = droneConfig["videoServer"]["ip"] || "0.0.0.0"
        this.VIDEO_SOCKET_PORT = droneConfig["videoServer"]["port"] || 3001
        this.videoSocket = new webSocket.Server({host: this.VIDEO_SOCKET_IP, port:this.VIDEO_SOCKET_PORT});
        this.initVideoSocket();

        this.executing = true;
        const msg = Buffer.from('command');
        console.log(`Connecting to ${this.TELLO_IP} on port ${this.CONTROL_PORT}`);
        this.controlClient.send(msg, 0, msg.length, this.CONTROL_PORT, this.TELLO_IP, (error) => {
            if (error) {
                console.error(`Failed to send message "${msg}" to ${this.TELLO_IP} on port ${this.CONTROL_PORT}: ${error}`);
            } else {
                console.log("'command' sent");
            }
        })
    }

    /**
     * Closes all sockets
     */
    disconnect() {
        this.controlClient.close();
        this.stateServer.close();
        this.ffmpegProcess.kill();
        this.connected = false;
    }

    /**
     * Parse raw state format into JSON object
     * @param {String} raw response from drone
     * @return JSON Objet with processed Drone State
     */
    parseState(raw_state) {
        // let test = "mid:-1;x:-100;y:-100;z:-100;mpry:0,0,0;pitch:8;roll:-2;yaw:69;vgx:0;vgy:0;vgz:-1;templ:75;temph:79;tof:10;h:0;bat:87;baro:-18.06;time:0;agx:116.00;agy:-4.00;agz:-1060.00;";
        let state = {}
        if (!!raw_state) {
            // NOTE: raw state end with ";" creating a empty element on split
            // spliting parameters and removing empty elements
            let state_parameters = raw_state.split(';').filter(param => !!param);

            // Processing parameters
            for (const param of state_parameters) {
                let key_value = param.split(':');
                if (key_value[0] !== "mpry") {
                    // replaces the original key with the "mapTo" key from stateDefinition file.
                    state[this.stateDefinition[key_value[0]]["mapTo"]] = { "value": parseFloat(key_value[1]), "unit": this.stateDefinition[key_value[0]]["unit"] };
                } else {
                    // Special condition for 'mpry' (mission pad orientation: roll pitch yaw)
                    // Split values and return array of float
                    let padOrientation = key_value[1].split(',').map(parseFloat);
                    state[this.stateDefinition[key_value[0]]["mapTo"]] = { "roll": padOrientation[0], "pitch": padOrientation[1], "yaw": padOrientation[2], "unit": this.stateDefinition[key_value[0]]["unit"] };
                }
            }
        }
        return state;
    }

    /*
     * @return JSON Object with Drone State
     */
    getState() {
        return this.state;
    }

    /*
     * Initialize Ffmpeg process to read UDP video stream from drone
     */
    initFfmpeg() {
        let videoPipe = {
            "command": "ffmpeg",
            "args": [
                '-re',
                '-y',
                '-i', `udp://${this.TELLO_IP}:${this.VIDEO_PORT}`,
                '-r', '30',
                '-s', '960x720',
                '-b', '800k',
                '-preset', 'ultrafast',
                '-f', 'mjpeg',
                'pipe:1'
            ]
        }

        this.ffmpegProcess = child_process.spawn(videoPipe['command'], videoPipe['args']);

        this.ffmpegProcess.on('error', (error) => {
            throw `Fail to spawn ffmpeg: ${error}`;
        });

        this.ffmpegProcess.on('close', (code) => {
            console.log(`ffmpeg exited with code ${code}`);
        });

        this.ffmpegProcess.on('spawn', () => {
            this.ffmpegRunning = true;
            console.log(`Ffmpeg spawned succesfully`);
        });

        this.ffmpegProcess.stderr.on('data', (data) => {
            // console.log(`stderr : ${data}`);
        });

        this.ffmpegProcess.stdout.on('data', (data) => {
            this.frame = `data:image/jpeg;base64,${Buffer.from(data).toString('base64')}`;
        });

    }

    getFrame(){
        return this.frame;
    }

    enableStream() {
        this.sendCmd('streamon');
    }
}

module.exports = Tello;
