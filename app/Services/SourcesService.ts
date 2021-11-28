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
		return string_to_clean.toLowerCase()
			.replace("'", "").replace("’", "")
			.replace("/", "").replace('"', "")
			.replace("*", "").replace(':', "")
			.replace("!", "").replace('#', "")
			.replace("%", "").replace('&', "")
			.replace("@", "").replace(';', "")
			.replace("@", "").replace(';', "")
			.replace(",", "").replace('.', "")
			.replace(",", "").replace('.', "")
			.replace("(", "").replace(')', "")
			.replace("=", "").replace('~', "")
			.replace(">", "").replace('<', "");
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
	 * @param title_year
	 * @returns Movie details
	 */
	public async movie_info_imdb(movie_title: string, movie_id: string, movie_year: number, rounds: number = 1) {
		let find_movie_url: string = "https://imdb8.p.rapidapi.com/title/find";

		// Try to get movie details and catch on error
		try {

			if(movie_id.length < 1) {
				// Search for movie
				let query_title = rounds > 1 ? movie_title : movie_title + ' ' + movie_year; 
				const res: any = await this.ping_url(find_movie_url, { q: query_title });

				if (res == false) {
					if(rounds == 1) {
						this.movie_info_imdb(movie_title, movie_id, movie_year, 2);
					}
					else {
						return false;
					}
				}

				for (let el of res.data.results) {

					let title_1 = this.clean_string(el.title);

					let title_2 = this.clean_string(movie_title);

					if (el.titleType == "movie" && title_2.includes(title_1)) {
						movie_id = el.id.replace("title", "").split("/").join("");

						break;
					} else {
						if (res.data.results.indexOf(el) == res.data.results.length - 1) {
							if(rounds == 1) {
								this.movie_info_imdb(movie_title, movie_id, movie_year, 2);
							}
							else {
								return false;
							}
						}
					}
				}
			}

			// Get movie details
			let details_url: string =
				"https://imdb8.p.rapidapi.com/title/get-overview-details";
			const details: any = await this.ping_url(details_url, {
				tconst: movie_id,
				currentCountry: "US",
			});

			if (details == false) return false;

			let rating: number = details.data.ratings.rating;
			let genres: string[] = details.data.genres;
			let plot: string = details.data.plotOutline.text;
			let year: string = details.data.title.year;
			let duration: string = details.data.title.runningTimeInMinutes;

			// Get other details from movie page
			let page_url = "https://www.imdb.com/title/" + movie_id;
			const html: any = await this.ping_url(page_url);
			if (html == false) return false;

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
				genres,
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
		const url: string = 'https://www.thenetnaija.com/videos/movies';//source.moviesUrl;
		const res: any = await this.ping_url(url);

		let movie_list: any = [];

		// Add code to switch source here after testing link 3 times
		if (res == false) return false;

		let $: any = cheerio.load(res.data);
		const movies = $(".file-one");

		for (let i in movies) {
			let movie = movies[i];
			let title = $(movie).find("a").text();

			let db_movie = await (await Movie.query().where('query_title', title)).length;

			if (db_movie < 1) {

				// Process movies that have info on IMDB
				let movie_url = $(movie).find("a").attr("href");

				let movie_info = await this.fetch_movie(movie_url, source, Movie, title);
				
				if(movie_info !== false) {
					movie_info.title		= title.split('(')[0] + '('+movie_info.year+')' + title.split(')')[1];
					movie_info.queryTitle	= title;
					
					movie_list = [movie_info, ...movie_list];
				}
			}
			else {
				break;
			}

			if (parseInt(i) + 1 == movies.length) break;
		}

		return movie_list;
	}

	/**
	 * Fetch and update faulty movies
	 * @param source object
	 * @param Movie model instance
	 * @returns void
	 */
	public async fix_movies(source, Movie) {
		const movies = await Movie.all();
		let j = 0;
		
		for(let i in movies) {
			const movie = movies[i];
			
			if(!movie.title.includes(movie.year)) {
				let movie_details = await this.fetch_movie(movie.sourceUrl, source, Movie, movie.title);
				let year = movie.year
				let title = movie.title;

				if(movie_details == false) {
					await movie.delete();
					console.log(j+' - DELETED: '+title);
				}
				else {
					movie.year 				= movie_details.year;
					movie.duration			= movie_details.duration;
					movie.rating			= movie_details.rating;
					movie.genres			= movie_details.genres;
					movie.description		= movie_details.description;
					movie.bannerUrl			= movie_details.bannerUrl;
					movie.imageUrl			= movie_details.imageUrl;
					movie.downloadUrls		= movie_details.downloadUrls;
					movie.trailerUrl		= movie_details.trailerUrl;
					movie.title				= title.split('(')[0] + '('+movie_details.year+')' + title.split(')')[1];
					movie.queryTitle		= title;

					await movie.save();
					console.log(j+' - UPDATED: '+title);
				}
			}
			j++;
		}
	}

	public async fetch_movie(movie_url, source, Movie, title) {

		// Ping movie url to grab download links
		const res: any = await this.ping_url(movie_url);

		if (res !== false) {
			let $: any = cheerio.load(res.data);

			// Get movie info
			let imdb_url: string = $('.quote-content').find('p').last().find('a').attr('href');
			
			let movie_id: string = imdb_url ? imdb_url.replace("title", "").split("/")[4] : '';
			let movie_info: any = await this.movie_info_imdb(title.split(" (")[0], movie_id, title.split(" (")[1].split(')')[0]);

			if (movie_info !== false) {
				movie_info.sourceUrl = movie_url;
				let sabishare_link = 'https://www.thenetnaija.com' + $(".db-one").first().find("a").first().attr("href");

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

					let movie_slug = this.clean_string(title.split(" (")[0]).split(' ').join('-');

					movie_info.sourceId = source.id;

					let db_movie = await (await Movie.query().where('movie_slug', movie_slug)).length;

					if (db_movie > 0) {
						movie_info.movieSlug = movie_slug + '-1';
					}
					else {
						movie_info.movieSlug = movie_slug;
					}
					
					return movie_info;
				}
			}
		}

		return false;
	}
}
