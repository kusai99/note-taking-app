const fs = require("fs");
const path = require("path");

//Log files creation and log management. separates the files by 1 hour
class Logger {
  //create /logs folder in the root directory of the project
  constructor() {
    this.logDirectory = path.join(__dirname, "../logs");
    this.ensureLogDirectoryExists();
  }

  //create a /logs directory if it doesn't already exist
  ensureLogDirectoryExists() {
    try {
      if (!fs.existsSync(this.logDirectory)) {
        fs.mkdirSync(this.logDirectory);
        console.log("[LOG] Logs directory created.");
      }
    } catch (err) {
      console.error("[ERROR] Failed to create logs directory:", err);
    }
  }

  /*Return a file with the name with the format log_YYYY-MM-DD_HH. if the file already exists, it returns it,
  otherwise (1 hour after the previous file's creation), it returns a new file*/
  getLogFileName() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    const hour = String(currentDate.getHours()).padStart(2, "0");
    return path.join(
      this.logDirectory,
      `log_${year}-${month}-${day}_${hour}.log`
    );
  }

  /*logs the passed message with the timestamp  inside the current log file*/
  log(message) {
    const timestamp = new Date();
    const formattedDate = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Singapore", // Replace with your desired timezone
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(timestamp);

    const milliseconds = String(timestamp.getMilliseconds()).padStart(3, "0");
    const formattedTimestamp = `${formattedDate}.${milliseconds}`;

    const logMessage = `[${formattedTimestamp}] ${message}\n`;

    const logFile = this.getLogFileName();

    try {
      fs.appendFile(logFile, logMessage, (err) => {
        if (err) {
          console.error("[ERROR] Failed to write to log file:", err);
        }
      });
    } catch (err) {
      console.error("[ERROR] Unexpected error when writing log:", err);
    }
  }
}

const instance = new Logger();
Object.freeze(instance);
module.exports = instance;
