import SourcesInterface from "Contracts/interfaces/Sources.interface";
import Env from "@ioc:Adonis/Core/Env";
import Logger from "@ioc:Adonis/Core/Logger";

import axios from "axios";
import * as cheerio from "cheerio";

export default class SourcesService implements SourcesInterface {
	/**
	 * @var CORS server url
	 */
	cors_server: string = Env.get("CORS_SERVER");

	/**
	 * @var IMDB API Key
	 */
	imdb_api_key = Env.get("IMDB_API_KEY");

	/**
	 * Clean String
	 * @param string_to_clean 
	 * @returns string
	 */
	public clean_string(string_to_clean: string) {
		return string_to_clean.toLowerCase().replace("'", "").replace("’", "").replace("/", "").replace('"', "");
	}

	/**
	 * Ping supplied URL and return response
	 * @param url URL to ping
	 * @param params URL parameters (query strings)
	 * @returns Ping response
	 */
	public async ping_url(url: string, params: object = {}) {
		return await axios
			.get(this.cors_server + "/" + url, {
				headers: {
					"X-Requested-With": "XMLHttpRequest",
					"x-rapidapi-host": "imdb8.p.rapidapi.com",
					useQueryString: "true",
					"x-rapidapi-key": this.imdb_api_key,
				},
				params,
			})
			.then((res) => {
				return res;
			})
			.catch((err) => {
				Logger.error(err);
				return false;
			});
	}

	/**
	 * Get movie info from IMDB
	 * @param movie_title
	 * @returns Movie details
	 */
	public async movie_info_imdb(movie_title: string) {
		let find_movie_url: string = "https://imdb8.p.rapidapi.com/title/find";

		// Try to get movie details and catch on error
		try {
			// Search for movie
			const res: any = await this.ping_url(find_movie_url, { q: movie_title });
			if (res === false) return false;

			let details_url: string =
				"https://imdb8.p.rapidapi.com/title/get-overview-details";
			let movie_id: string = "";
			let year: string = "";
			let duration: string = "";

			for (let el of res.data.results) {

				let title_1 = this.clean_string(el.title);

				let title_2 = this.clean_string(movie_title);

				if (el.titleType == "movie" && title_1.includes(title_2)) {
					movie_id = el.id.replace("title", "").split("/").join("");
					year = el.year;
					duration = el.runningTimeInMinutes;

					break;
				} else {
					if (res.data.results.indexOf(el) == res.data.results.length - 1)
						return false;
				}
			}

			// Get movie details
			const details: any = await this.ping_url(details_url, {
				tconst: movie_id,
				currentCountry: "US",
			});

			if (details === false) return false;

			let rating: number = details.data.ratings.rating;
			let genres: string[] = details.data.genres;
			let plot: string = details.data.plotOutline.text;

			// Get other details from movie page
			let page_url = "https://www.imdb.com/title/" + movie_id;
			const html: any = await this.ping_url(page_url);
			if (html === false) return false;

			let $: any = cheerio.load(html.data);

			// Extract banner image
			let banner_img_arr: any = $(".ipc-slate__slate-image")
				.children("img")
				.attr("srcset")
				?.split("750w,");
			let banner: string = banner_img_arr[1].replace("1000w", " ").trim();

			// Extract image
			let image_arr: any = $(".ipc-poster__poster-image")
				.children("img")
				.attr("srcset")
				?.split("285w,");

			let image: any = image_arr[1].replace("380w", " ").trim();

			// Extract Trailer
			let vid_url: string = $(".hero-media__slate-overlay").attr("href");
			let trailer_url: string = vid_url.split("?")[0].replace("/video/", "");
			trailer_url =
				"https://www.imdb.com/video/imdb/" +
				trailer_url +
				"/imdb/embed?autoplay=false&ampwidth=640";
			
			return {
				year,
				duration,
				rating,
				genres: genres.join('|'),
				description: plot,
				bannerUrl: banner,
				imageUrl: image,
				trailerUrl: trailer_url,
			};
		} catch (error) {
			Logger.error(error);
			return false;
		}
	}

	/**
	 * Get latest movies from Netnaija
	 * @param source object
	 * @param Movie model instance
	 * @returns list of movies
	 */
	public async netnaija(source, Movie) {

		const url: string = source.moviesUrl;
		const res: any = await this.ping_url(url);

		let movie_list: any = [];

		// Add code to switch source here after testing link 3 times
		if (res === false) return false;

		let $: any = cheerio.load(res.data);
		const movies = $(".file-one");

		for (let i in movies) {
			let movie = movies[i];
			let title = $(movie).find("a").text();

			let db_movie = await Movie.findBy('title', title);

			if (!db_movie) {
				// Get movie info
				let movie_info: any = await this.movie_info_imdb(title.split(" (")[0]);

				// Process movies that have info on IMDB
				if (movie_info !== false) {
					let movie_url = $(movie).find("a").attr("href");

					movie_info.sourceUrl = movie_url;

					// Ping movie url to grab download links
					const res: any = await this.ping_url(movie_url);

					if (res !== false) {
						let $: any = cheerio.load(res.data);

						let sabishare_link =
							source.url + $(".db-one").find("a").first().attr("href");

						const sabi_res: any = await this.ping_url(sabishare_link);

						if (sabi_res !== false) {
							let $: any = cheerio.load(sabi_res.data);

							let size = $(".size-number").first().text();
							let token = $('[itemprop="url"]')
								.attr("href")
								.split("file/")[1]
								.split("-")[0];

							movie_info.downloadUrls = JSON.stringify({
								"720p": [
									"https://api.sabishare.com/token/download/" + token,
									size,
								],
							});

							movie_info.title = title;

							movie_info.movieSlug = this.clean_string(title.split(" (")[0]).split(' ').join('-');

							movie_info.sourceId = source.id;

							db_movie = await Movie.findBy('movie_slug', movie_info.movieSlug);

							if (!db_movie) {
								movie_list.push(movie_info);
							}
						}
					}
				}

				if (parseInt(i) + 1 == movies.length) break;
			}
		}

		return movie_list;
	}
}
