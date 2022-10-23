const util = require("util");

class Logger {

    static stringify(...message) {
        const messages = [];
        if (message) {
            message.forEach(m => {
                if (m instanceof Object) {
                    try {
                        messages.push(JSON.stringify(m));
                    }
                    catch (error) {
                        messages.push(util.inspect(m, { color: true }));
                    }
                }
                else {
                    messages.push(m);
                }
            });
        }
        return messages;
    }

    static formating(log_type, ...message) {
        let now = new Date();
        let type = `[${log_type}]`
        return `${type.padEnd(10)},[${now.toUTCString()}],${this.stringify(message).join(' ')}`;
    }

    static fatal(...message) {
        // TODO add URL host:port to logs
        console.error(this.formating("FATAL", message));
        // process.exit(1);
    }

    static error(...message) {
        // TODO add URL host:port to logs
        console.error(this.formating("ERROR", message));
    }

    static warning(...message) {
        // TODO add URL host:port to logs
        console.error(this.formating("WARNING", message));
    }

    static info(...message) {
        // TODO add URL host:port to logs
        console.error(this.formating("INFO", message));
    }

    static success(...message) {
        // TODO add URL host:port to logs
        console.error(this.formating("SUCCESS", message));
    }
}

module.exports = Logger;
