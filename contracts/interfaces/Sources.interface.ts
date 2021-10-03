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
}
  