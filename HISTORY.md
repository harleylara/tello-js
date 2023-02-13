# Tello JS

## In development:

- New Features:

- Notable Changes:

- Notable Fixes:

- Documentation Updates:

### 2023-02-12

- CLI added to the library with the command `tello`

### 2023-02-08

- File to start tello-core and tello-server `server.js` in the root folder was moved to `src` folder an renamed to `tello-server.js`

### 2022-10-29

- The `drone.json` and `server.json` were deleted and their contents combined into `config.json`.

### 2022-10-28

- A more reliable connection mechanism was implemented. Resends the connection command after a time without response.
- **BREAKING CHANGE**: `raw` keyword before a command string ex. `raw flip b` was removed. Now you can send SDK commands without `raw` in the begining of a string command ex. `flip b`

### 2022-10-23

- Logger module added to `tello.js`
- Ffmpeg is now automatically installed when the `npm install` command is executed.

### 2022-05-22

- Init server file for websocket use...

### 2022-05-19

- Logger added: contains 5 log categories (fatal, error, warning, information, success)
