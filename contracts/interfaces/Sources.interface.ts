export default interface SourcesInterface {
	/**
	 * @var CORS server url
	 */
	cors_server: string;

	/**
	 * @var IMDB API Key
	 */
	imdb_api_key: string;

	/**
	 * Clean String
	 * @param string_to_clean 
	 */
	clean_string(string_to_clean: string): string;

	/**
	 * Get movie info for IMDB
	 * @param movie_title Movie title
	 * @param movie_id IMDB Movie ID
	 * @param title_year Year extracted from movie title
	 * @param rounds Number of times function has been run
	 */
	movie_info_imdb(movie_title: string, movie_id: string, movie_year: number, rounds: number): object;

	/**
	 * Ping supplied URL and return response
	 * @param url URL to ping
	 * @param params URL parameters (query strings)
	 */
	ping_url(url: string, params?: object): any;

	/**
	 * Get latest movies from Netnaija
	 * @returns array
	 */
	netnaija(source: any, Movie: any): any;

	/**
	 * Fetch and update faulty movies
	 * @returns void
	 */
	 fix_movies(source: any, Movie: any): any;

	 /**
	  * Fetch movie details
	  * @returns object
	  */
	 fetch_movie(movie_url: string, source: any, Movie: any, title: string): any;
}
