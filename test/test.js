const wsServer = require('../src/server.js')
const Tello = require('../src/tello.js')

const drone = new Tello();
drone.connect("192.168.137.53");
// drone.sendCmd('takeoff');
drone.sendCmd('streamon');
drone.initFfmpeg();

const server = new wsServer(drone);
