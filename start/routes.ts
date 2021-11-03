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
import Sources from "@ioc:Pandavil/SourcesService";
import Source from "App/Models/Source";

// Home Page
Route.get("/", "ViewController.home");

// Search Movie
Route.get("/search", "MoviesController.search");

// Single Movie Page
Route.get("/movie/:slug", "ViewController.movie");

// Get download URL from Sabishare API
Route.get("/get-download-url", "MoviesController.get_download_link");

// Fetch movies by category (Genre or Year)
Route.get("/filter", "MoviesController.filter");

// Handle movie genre
Route.get("manage-genre", "SourcesController.manageGenres");

Route.get("/job", "SourcesController.index");

Route.get("/movie-update", "SourcesController.dispatchMovieUpdate");
