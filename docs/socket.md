# WebSocket Server (Control, Set and State)

The WebSocket server to send control commands, set configurations and get the drone status by default uses the address `ws://localhost:3001`.

To send a single command that does not require arguments:
```
<COMMAND>
```

To send commands that require arguments, add the command at the beginning and separate the arguments by space ` `:
```
<COMAND> <ARG1> <ARG2> <ARG3>
```

It is also possible to send **raw commands** based on the format used by the SDK. For example to move the drone forward using `rc roll pitch throttle yaw`:
```
rc 0 50 0 0
```

> ⚠️ The use of **raw commands** is subject to the format used by the [Tello SDK](https://dl.djicdn.com/downloads/RoboMaster+TT/Tello_SDK_3.0_User_Guide_en.pdf)

For more details on the communication model: [Communication Model](./communication.md)

# List of commands

## Control commands

| Command                                  | Description                                                                                                                        | Possible response |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| `command`                                | Enter SDK command mode. Allows commands to be sent to the drone, otherwise it is not possible to control the drone using commands. |
| `takeoff`                                | Auto take off                                                                                                                      | ok / error        |
| `land`                                   | Auto landing                                                                                                                       | ok/error          |
| `streamon`                               | Turn on the video stream.                                                                                                          | ok/error          |
| `streamoff`                              | Turn off the video stream.                                                                                                         | ok/error          |
| `emergency` | Stop the motor from running. | ok/error                                                                                                                           |                   |
| `up <distance>`                            | Fly upward. <br>- `distance:int` in centimeters from 20 to 500                                                                     | ok/error          |
| `down <distance>`                          | Fly downward. <br>- `distance:int` in centimeters from 20 to 500                                                                   | ok/error          |
| `left <distance>`                          | Fly leftward. <br>- `distance:int` in centimeters from 20 to 500                                                                   | ok/error          |
| `right <distance>`                         | Fly rightward. <br>- `distance:int` in centimeters from 20 to 500                                                                  | ok/error          |
| `forward <distance>`                       | Fly forward. <br>- `distance:int` in centimeters from 20 to 500                                                                    | ok/error          |
| `back <distance>`                          | Fly backward. <br>- `distance:int` in centimeters from from 20 to 500                                                              | ok/error          |
| `cw <angle>`                               | Rotate clockwise. <br>- `angle:int` in degrees from 1 to 360                                                                       | ok/error          |
| `ccw <angle>`                              | Rotate counter-clockwise. <br>- `angle:int` in degrees from 1 to 360                                                               | ok/error          |
| `motoron`                                | Enter Motor-On mode. Spin the motors at low speed (no-fly)                                                                         | ok/error          |
| `motoroff`                               | Exit Motor-On mode. Stops the rotation of the motors                                                                               | ok/error          |
| `throwfly`                               | Throw to launch. <br>Throw the drone horizontally within 5s of sending the command                                                 | ok/error          |
| `flip <direction>` | Roll in the given `direction:char`. <br>- `l` (left) <br>- `r` (right)<br>- `f` (forward) <br>- `b` (back) | ok/error |
| `go <x> <y> <z> <speed>` | Fly to the coordinates in cemtimeters (`x`,`y`,`z`) at the set speed (cm/s). <br> - `x:int` from -500 to 500 <br>- `y:int` from -500 to 500<br>- `z:int` from -500 to 500 <br>- `speed:int` from 10-100 (cm/s) <br> `x`, `y`, and `z` cannot be between -20 and 20 at the same time | ok/error + error |
| `stop` | Stop moving and hover immediately. | ok/error |
| `curve <x1> <y1> <z1> <x2> <y2> <z2> <speed>` | Fly in a curve from (`x1`,`y1`,`z1`) to (`x2`,`y2`,`z2`) at the set `speed` (cm/s). <br>- If the radius of the curve is not within 0.5-10 meters, the corresponding reminder will be returned. <br>- `x1:int`, `x2:int` from -500 to 500<br>- `y1:int`, `y2:int` from -500 to 500<br>- `z1:int`, `z2:int` from -500 to 500 <br>- `speed:int` from 10 to 60<br> `x`, `y`, and `z` cannot be between -20 and 20 at the same time | ok/error + error status |
| `go <x> <y> <z> <speed> <pad number>` | Fly to the coordinate point (`x`, `y`, `z`) in the coordinate system of the mission `pad number` with the specified ID at the set `speed` (m/s).<br>- `x:int` from -500 to 500 <br>- `y:int` from -500 to 500<br>- `z:int` from 0 to 500 <br>- `speed:int` from 10-100 (cm/s) <br> `x`, `y`, and `z` cannot be between -20 and 20 at the same time | ok/error + error status |
| `curve <x1> <y1> <z1> <x2> <y2> <z2> <speed> <pad number>` | Fly in a curve from point (`x1`,`y1`,`z1`) to point (`x2`,`y2`,`z2`) in the coordinate system of the mission pad with the set `pad number` at the set `speed` (cm/s). <br>If the radius of the curve is not within 0.5-10 meters, the corresponding reminder will be returned. <br>- `x1:int`, `x2:int` from -500 to 500<br>- `y1:int`, `y2:int` from -500 to 500<br>- `z1:int`, `z2:int` from 0 to 500<br>- `speed:int` from 10 to 60<br> `x`, `y`, and `z` cannot be between -20 and 20 at the same time | ok/error + error status |
| `jump <x> <y> <z> <speed> <yaw> <mission pad 1> <mission pad 2>` | Tello flies to the point (`x`,`y`,`z`) in the `mission pad 1` coordinate system and hovers. Then, it identifies the mission pad of `mission pad 2` and rotates to the position (0,0,`z`) in the `mission pad 2` coordinate system to set the `yaw` value (`z`>0). | ok/error + error status |
| `reboot` | Reboot the drone. | ok/error |


## Setting Commands

Used to configure drone parameters.

| Command                              | Description                                                        | Possible response |
| ------------------------------------ | ------------------------------------------------------------------ | ----------------- |
| `speed <speed>`                      | Set the current `speed` to cm/s. <br>- `speed:int` from 10  to 100 | ok/error          |
| `rc <roll> <pitch> <throttle> <yaw>` | Remote control signals. <br> - `roll:int` from -100 to 100<br>- `pitch:int` from -100 to 100<br>- `throttle:int` from -100 to 100<br>- `yaw:int` from -100 to 100 | no response       |
| `wifi <ssid> <pass>` | Change the Tello Wi-Fi password.<br>- `ssid:string` The new Wi-Fi name. Do not use spaces in the name<br>- `pass`: The new Wi-Fi password<br> If an open-source controller is connected, ssid automatically adds the `RMTT`- prefix by default. Otherwise, it adds the `TELLO`- prefix. | OK, drone will reboot in 3s |
| `mon` | Enables mission pad. <br>By default, downward detection is enabled. | ok/error |
| `moff` | Disables mission pad detection. | ok/error |
| `mdirection <detection>`| `detection:int`can be `0`, `1` or `2`<br>- `0`: downward detection enabled.<br>- `1`: forward detection enabled.<br>- `2`: both forward and downward detection enabled.<br>*note*: Before use, you must use the `mon` command to enable the detection function. Downward detection is enabled by default.<br>*note:* When either forward-looking or downward-looking detection is enabled alone, the detection frequency is 20Hz. If both enabled, detection will be performed alternatively, with a frequency of 10Hz in each direction | ok/error |
| `ap <ssid> <pass>` | Switch Tello to **Access Point Mode** <br>- `ssid:string` name of the Wi-Fi network to connect to<br>- `pass:string` the Wi-Fi password | OK, drone will reboot in 3s |
| `wifisetchannel <channel>` | Set the -WiFi channel of the open-source controller. `channel` indicates the channel to be set.<br>*Note*: To clear the channel settings, you need to clear the Wi-Fi information. Then, set a channel that complies with local policies and regulations. (Only applies to the open-source controller) | ok / error |
| `port <status port> <streaming port>` | Set the ports for pushing drone's `status` information and video streams.<br> Here, `status port` is the port for pushing status information, and `streaming port` is the port for pushing video information.<br>The range of ports is 1025 to 65535. | ok/error |
| `setfps <fps>` | Set the video stream frame rate. The `fps` parameter specifies the frame rate, whose value can be:<br>- `high` 30fps<br>- `middle` 15fps<br>- `low` 5fps | ok/error |
| `setbitrate <bitrate>` | Set the video stream bit rate. The `bitrate` parameter specifies the bit rate, with a value range from 0 to 5, indicating:<br>- `0` auto<br>- `1` 1Mbps<br>- `2` 2MBps<br>- `3` 3Mbps<br>- `4` 4Mbps<br>- `5` 5Mbps | ok / error |
| `setresolution <resolution>` | Set the video stream resolution. The `resolution` parameter specifies the resolution, whose valuecan be:<br>- `high` 720p<br>- `low` 480p | ok/error |

## Read Commands

Used to get information about the drone and some parameters.

| Command        | Description                                                                                                                     | Possible response                                   |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| `speed?`       | Get the current set speed (cm/s).                                                                                               | `speed:int` from 10 to 100                          |
| `battery?`     | Get the percentage (%) indicating the current battery level.                                                                    | `battery:int` level from 10 to 100                  |
| `time?`        | Get the motor running time (s).                                                                                                 | `time:int`                                          |
| `wifi?`        | Get the Wi-Fi `Signal-to-noise ratio` (SNR).                                                                                    | `SNR`                                               |
| `sdk?`         | Get the Tello SDK version number.                                                                                               | `version`(>=20)                                     |
| `sn?`          | Get the Tello `sertial number` SN.                                                                                              | Production SN                                       |
| `hardware?`    | Get hardware type, whether TT is connected to an open-source controller. If yes, it returns `RMTT`; if not, it returns `TELLO`. | `TELLO`/`RMTT`                                      |
| `wifiversion?` | Query the -WiFi version of the open-source controller. (Only applies to the open-source controller)                             | wifivx.x.x.x                                        |
| `ap?`          | Get the name and password of the current router to be connected. (Only applies to the open-source controller)                   | `name` and `password` of the router to be connected |
| `ssid?` | Get the current SSID of the drone. (Only applies to the open-source controller) | In `Station mode`: factory default SSID; <br>In `Access Point mode`: userdefined SSID and password |
| `multiwifi <ssid> <pass>` | Set the SSID and password of the open-source controller. This feature supports connection to multiple devices as a router. | ok / error |
