import Log from "App/Models/Log";

export default interface LoggerInterface {
  error(title: string, error: any, database: Log): void;
}
