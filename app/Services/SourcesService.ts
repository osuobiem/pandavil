import SourcesInterface from "Contracts/interfaces/Sources.interface"
import Env from "@ioc:Adonis/Core/Env"
import Logger from "@ioc:Adonis/Core/Logger"

import axios from "axios"
import * as cheerio from "cheerio"

export default class SourcesService implements SourcesInterface {
  /**
   * @var CORS server url
   */
  cors_server: string = Env.get("CORS_SERVER")

  /**
   * Get movie info from IMDB
   * @param movie_title
   * @returns Movie details
   */
  public async movie_info_imdb(movie_title: string) {
    let find_movie_url: string =
      "https://imdb8.p.rapidapi.com/title/find"


    // Try to get movie details and catch on error
      try {
        // Search for movie
        const res: any = await this.ping_url(find_movie_url, {q: movie_title})
        if(res === false) return false;

        let details_url: string = "https://imdb8.p.rapidapi.com/title/get-overview-details"
        let movie_id: string = ''
        let year: string = ''
        let duration: string = ''

        for(let el of res.data.results){
            if(el.titleType == 'movie') {
                movie_id = el.id.replace('title', '').split('/').join('')
                year = el.year
                duration = el.runningTimeInMinutes
                break
            }
            else {
                if(res.data.results.indexOf(el) == res.data.results.length-1) reject(false)
            }
        }

        // Get movie details
        const details: any = await this.ping_url(details_url, {tconst: movie_id, currentCountry: "US"})
        if(details === false) return false;

        let rating: number = details.data.ratings.rating
        let genres: string[] = details.data.genres
        let plot: string = details.data.plotOutline.text


        // Get other details from movie page
        let page_url = 'https://www.imdb.com/title/'+movie_id
        const html: any = await this.ping_url(page_url)
        if(html === false) return false;

        let $: any = cheerio.load(html.data)

        // Extract banner image
        let banner_img_arr: any = $('.ipc-slate__slate-image').children('img').attr('srcset')?.split('750w,')
        let banner: string = banner_img_arr[1].replace('1000w', ' ').trim()

        // Extract image
        let image_arr: any = $('.ipc-poster__poster-image').children('img').attr('srcset')?.split('285w,')
        let image: any = image_arr[1].replace('380w', ' ').trim()

        // Extract Trailer
        let vid_url: string = $('.hero-media__slate-overlay').attr('href')
        let trailer_url: string = vid_url.split('?')[0].replace('/video/', '')
        trailer_url = 'https://www.imdb.com/video/imdb/'+trailer_url+'/imdb/embed?autoplay=false&ampwidth=640'

        return {
            year, duration, rating, genres, plot, banner, image, trailer_url
        }
    }
    catch (error) {
        Logger.error(error)
        return false
    }
  }

  /**
   * Ping supplied URL and return response
   * @param url URL to ping
   * @param params URL parameters (query strings)
   * @returns Ping response
   */
  public async ping_url(url: string, params: object = {}) {
    return await axios.get(this.cors_server +'/'+ url, {
      headers: { "X-Requested-With": "XMLHttpRequest", "x-rapidapi-host": "imdb8.p.rapidapi.com",
      "useQueryString": "true", "x-rapidapi-key": "7823696370mshab993de263d8edap1f191djsnb58ca07fb8c1"},
      params
    }).then(res => {
        return res
    })
    .catch(err => {
        Logger.error(err)
        return false
    })
  }
}
