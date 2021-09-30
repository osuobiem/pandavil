import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import LogErrorService from 'App/Services/LogErrorService'

export default class AppProvider {
  constructor (protected app: ApplicationContract) {
  }

  public register () {
    // Register your own bindings
    this.app.container.singleton('Pandavil/LogErrorService', ()=> new LogErrorService())
  }

  public async boot () {
    // IoC container is ready
  }

  public async ready () {
    // App is ready
  }

  public async shutdown () {
    // Cleanup, since app is going down
  }
}
