const WebSocket = require('ws');
const serverConfig = require('../server.json');

class wsServer {

    constructor(DroneObj) {
        this.CONTROL_SERVER_IP = serverConfig["controlServer"]["ip"] || "0.0.0.0";
        this.CONTROL_SERVER_PORT = serverConfig["controlServer"]["port"] || 3000;
        this.wss = new WebSocket.Server({ host: this.CONTROL_SERVER_IP, port: this.CONTROL_SERVER_PORT });
        this.drone = DroneObj;
        this.initWsServer();
    }

    initWsServer() {

        this.wss.on("connection", (ws) => {
            console.log("New client connected to control socket");

            ws.on("message", (msg) => {
                console.log(`Client sent: ${msg}`);
                const response = msg.toString().trim();
                switch (response) {
                    case "takeoff":
                        ws.send("taking off");
                        this.drone.sendCmd("takeoff");
                        break;
                    case "land":
                        ws.send("landing");
                        this.drone.sendCmd("land");
                        break;
                    case "flip":
                        ws.send("flipping");
                        this.drone.sendCmd("flip f");
                        break;
                    case "state":
                        ws.send(JSON.stringify(this.drone.getState()));
                        break;
                    default:
                        ws.send('default')
                }
            })

            ws.on("close", () => {
                console.log("Client disconnected.")
            })
        })
    }
}

module.exports = wsServer;
