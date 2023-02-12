#!/usr/bin/env node
const wsServer = require('./server.js');
const Tello = require('./tello.js');

const drone = new Tello();
drone.connect();
drone.sendCmd('streamon');
drone.initFfmpeg();

const server = new wsServer(drone);
