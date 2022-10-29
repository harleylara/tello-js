# Tello Javascript

A minimalist Javascript library for programming Tello drones with a WebSocket interface for control, state and videoframes.

![Banner](./docs/tello-js-banner.jpg)

# How to install

ℹ️ To use this library you need to install:
- [Node.js](https://nodejs.org/)

1. Download/clone this repository on your computer.
```
git clone https://github.com/harleylara/tello-js
```

2. In the **root directory** of **this** project execute.
```
npm install
```

Done. At this point you are ready to have fun with your drone using javascript.

# How to use

Basic usage:
```
const Tello = require('tello.js')

const drone = Tello();

drone.connect(); // without arguments uses default ip and ports
drone.takeoff();
// cool stuff ...
drone.land();
drone.disconnect();
```

# List of functions

- async connect(tello_ip: str, control_port: int, state_port: int, video_port: int) {
- disconnect()
- getState() returns the latest state of the drone
- initFfmpeg() harley's note: this should be replaced with a function like `startVideo` that containt `streamon` and `initFfmpeg()`
- enableStream() for now is just sending the `streamon` command
- async sendCmd(command: str)
- async wait(time_ms: int)

# IP address and ports config

In case the drone is not using the default IP address and ports you can change the parameters in the `drone.json` file in the root directory of this repository.


# WebSocket Server for control

In case you want to control the drone using WebSocket you can configure the parameters in the `server.json` file in the root directory of this repository.

ℹ️ By default when the drone is initialized it broadcasts frames in BASE64 format to all clients connected to the default address `ws://localhost:3000`. You can change the address and port with the `drone.json` file in the `"videoServer"` section.

ℹ️ For more details: [WebSocket Server (Control, Set and State)](docs/socket.md)

# External Resources
- [Tello SDK 2.0 - Official User Guide](https://dl-cdn.ryzerobotics.com/downloads/Tello/Tello%20SDK%202.0%20User%20Guide.pdf)
- [ROBOMASTER TT SDK 3.0 - Official User Guide](https://dl.djicdn.com/downloads/RoboMaster+TT/Tello_SDK_3.0_User_Guide_en.pdf)
- [Tello - User Guide](https://dl.djicdn.com/downloads/RoboMaster+TT/Tello_SDK_3.0_User_Guide_en.pdf)
