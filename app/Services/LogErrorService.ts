import LogErrorInterface from "Contracts/interfaces/LogError.interface";
import Logger from "@ioc:Adonis/Core/Logger";

export default class LogErrorService implements LogErrorInterface {
  /**
   * Logs the movie source error to the console
   */
  public source(source: string) {
    Logger.error(`The source, ${source} is unavailable.`);
  }

  /**
   * Logs the movie/content error to the console
   */
  public content(content: string) {
    Logger.error(`The content, ${content} was not found.`);
  }
}
