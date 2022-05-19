# Tello Javascript

![Banner](./docs/tello-js-banner.jpg)

Javascript library to program Tello Drones.

# How to install

ℹ️ To use this library you need to install:
- [Node.js](https://nodejs.org/)
- [Ffmpeg](https://ffmpeg.org/download.html)

If you already have both software follow the steps below.

1. Download/clone this repository on your computer.
```
git clone https://github.com/harleylara/tello-js
```

2. In the **root directory** of **this** project execute.
```
npm i
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

TODO

# IP address and ports config

In case the drone is not using the default IP address and ports you can change the parameters in the `drone.json` file in the root directory of this repository.

ℹ️ By default when the drone is initialized it broadcasts frames in BASE64 format to all clients connected to the default address `ws://localhost:3000`. You can change the address and port with the `drone.json` file in the `"videoServer"` section.

# WebSocket Server for control

In case you want to control the drone using WebSocket you can configure the parameters in the `server.json` file in the root directory of this repository.

ℹ️ For more details: [WebSocket Server (Control, Set and State)](docs/socket.md)

# External Resources
- [Tello SDK 2.0 - Official User Guide](https://dl-cdn.ryzerobotics.com/downloads/Tello/Tello%20SDK%202.0%20User%20Guide.pdf)
- [ROBOMASTER TT SDK 3.0 - Official User Guide](https://dl.djicdn.com/downloads/RoboMaster+TT/Tello_SDK_3.0_User_Guide_en.pdf)
- [Tello - User Guide](https://dl.djicdn.com/downloads/RoboMaster+TT/Tello_SDK_3.0_User_Guide_en.pdf)
