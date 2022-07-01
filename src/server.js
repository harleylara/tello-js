const WebSocket = require('ws');
const serverConfig = require('../server.json');

class wsServer {

    constructor(DroneObj) {
        this.CONTROL_SERVER_IP = serverConfig["controlServer"]["ip"] || "0.0.0.0";
        this.CONTROL_SERVER_PORT = serverConfig["controlServer"]["port"] || 3000;
        this.wss = new WebSocket.Server({ host: this.CONTROL_SERVER_IP, port: this.CONTROL_SERVER_PORT });
        this.drone = DroneObj;
        this.command_dict={
            "takeoff":"takeoff",
            "land":"land",
            "flip f":"flip f",
            "flip b":"flip b",
            "flip l":"flip l",
            "flip r":"flip r",
            "move left":"left 20",
            "move right":"right 20",
            "move forward":"forward 20",
            "move backward":"back 20",
            "move up":"up 20",
            "move down":"down 20",
            "rotate left":"ccw 20",
            "rotate right":"cw 20",
        }
        this.initWsServer();
    }



    initWsServer() {

        this.wss.on("connection", (ws) => {
            console.log("New client connected to control socket");

            ws.on("message", (msg) => {
                console.log(`Client sent: ${msg}`);
                const message = msg.toString().trim();
                if (message.startsWith("control")){
                    ws.send(message.substring(8));
                    this.drone.sendCmd(this.command_dict[message.substring(8)]);
                }
                else

                switch (message) {
                    // case "takeoff":
                    //     ws.send("taking off");
                    //     this.drone.sendCmd("takeoff");
                    //     break;
                    // case "land":
                    //     ws.send("landing");
                    //     this.drone.sendCmd("land");
                        // break;
                    case "streamon":
                        this.drone.initFfmpeg();
                        break;
                    // case "flip":
                    //         ws.send("flipping");
                    //         this.drone.sendCmd("flip f");
                    //         break;
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
