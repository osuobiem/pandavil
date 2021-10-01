/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from "@ioc:Adonis/Core/Route";
import Bull from "@ioc:Rocketseat/Bull";
import Job from "App/Jobs/CreateYear";
import Logger from "@ioc:Adonis/Core/Logger";

Route.get("/", async ({ view }) => {
  // Dispatch Job to enter data in movie_dates table (For test purposes)
  Bull.schedule(new Job().key, { year: "2021" }, 60 * 1000);
  Logger.info("Job dispatched!");

  // Render view to user
  return view.render("welcome");
});
