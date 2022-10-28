const WebSocket = require('ws');
const serverConfig = require('../server.json');

class wsServer {

    constructor(DroneObj) {
        this.CONTROL_SERVER_IP = serverConfig["controlServer"]["ip"] || "0.0.0.0";
        this.CONTROL_SERVER_PORT = serverConfig["controlServer"]["port"] || 3000;

        // TODO: Check if the default port is in use and change to port++
        this.wss = new WebSocket.Server({ host: this.CONTROL_SERVER_IP, port: this.CONTROL_SERVER_PORT });
        this.drone = DroneObj;
        this.initWsServer();
    }

    initWsServer() {

        this.wss.on("connection", (ws) => {
            // TODO: create a list of clients ????
            // TODO: Allow only one client for connection ??
            console.log("New client connected to control socket");

            ws.on("message", (msg) => {
                console.log(`Client sent: ${msg}`);
                const fullMsg = msg.toString().trim().replaceAll(';', ' ');
                const command = fullMsg.split(' ')[0];
                console.log(`Full message: ${fullMsg}`)
                console.log(`Type of command: ${command}`);
                switch (command) {
                    case "takeoff":
                        ws.send("taking off");
                        this.drone.sendCmd("takeoff");
                        break;
                    case "land":
                        ws.send("landing");
                        this.drone.sendCmd("land");
                        break;
                    case "emergency":
                        ws.send("EMERGENCY something went wrong!!");
                        this.drone.sendCmd("emergency");
                        break;
                    case "state":
                        ws.send(JSON.stringify(this.drone.getState()));
                        break;
                    default:
                        // assume you are sending raw commands
                        // from the SDK
                        ws.send(`sending command: ${fullMsg}`)
                        this.drone.sendCmd(fullMsg);
                }
            })

            ws.on("close", () => {
                console.log("Client disconnected.")
            })
        })
    }
}

module.exports = wsServer;
