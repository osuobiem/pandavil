export default interface SourcesInterface {

    /**
     * @var CORS server url
     */
    cors_server: string

    /**
     * Get movie info for IMDB
     * @param movie_title Movie title
     */
    movie_info_imdb(movie_title: string): object;

    /**
     * Ping supplied URL and return response
     * @param url URL to ping
     * @param params URL parameters (query strings)
     */
     ping_url(url: string, params?: object): any;
}
  