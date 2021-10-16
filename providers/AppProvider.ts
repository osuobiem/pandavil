import { ApplicationContract } from "@ioc:Adonis/Core/Application";
import SourcesService from "App/Services/SourcesService";
import LoggerService from "App/Services/LoggerService";

export default class AppProvider {
  constructor(protected app: ApplicationContract) {}

  public register() {
    // Register your own bindings
    this.app.container.singleton(
      "Pandavil/SourcesService",
      () => new SourcesService()
    );

    this.app.container.singleton(
      "Pandavil/LoggerService",
      () => new LoggerService()
    );
  }

  public async boot() {
    // IoC container is ready
  }

  public async ready() {
    // App is ready
  }

  public async shutdown() {
    // Cleanup, since app is going down
  }
}
