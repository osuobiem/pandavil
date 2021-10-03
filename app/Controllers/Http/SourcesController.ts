// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from "@ioc:Adonis/Lucid/Database";

export default class SourcesController {
  public switchSource(activeSource?: number, manualSource?: number): boolean {
    // Handle source switching when active source is supplied
    if (typeof activeSource == undefined) {
      sources = Database;
    }
  }
}
