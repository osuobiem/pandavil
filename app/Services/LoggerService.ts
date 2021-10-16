import LoggerInterface from "Contracts/interfaces/Logger.interface";
import Logger from "@ioc:Adonis/Core/Logger";

export default class LoggerService implements LoggerInterface {
  /**
   * Add logged information(error) to the database
   * @param title
   * @param error
   */
  public async error(title, error, logModel) {
    // Update logs table
    const log = logModel;
    log.title = title;
    log.message = error.message;
    log.type = "error";
    await log.save();

    // Output to log file
    Logger.error(error);
  }

  /**
   * Add logged information(info) to the database
   * @param title
   * @param error
   */
  public async info(title, info, logModel) {
    // Update logs table
    const log = logModel;
    log.title = title;
    log.message = info;
    log.type = "info";
    await log.save();

    // Output to log file
    Logger.error(info);
  }
}
