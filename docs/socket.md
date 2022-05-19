# WebSocket Server (Control, Set and State)

The WebSocket server to send control commands, set configurations and get the drone status by default uses the address `ws://localhost:3001`.

To send a single command that does not require arguments:
```
<COMMAND>
```

To send commands that require arguments, add the command at the beginning and separate the arguments by `;`:
```
<COMAND>;<ARG1>;<ARG2>;<ARG3>
```

It is also possible to send **raw commands** based on the format used by the SDK. For example to move the drone forward using `rc roll pitch throttle yaw`:
```
rc;0;50;0;0
```

> ⚠️ The use of **raw commands** is subject to the format used by the SDK.

For more details on the communication model: [Communication Model](docs/communication.md)

# List of commands

TODO