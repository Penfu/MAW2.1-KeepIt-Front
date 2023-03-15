import Movie from '@/models/movie';
import axios from 'axios';


export default class MovieProvider {
    static async fetchMovie(id: string): Promise<Movie> {
        try {
          const movie = (await axios.get('/movies/' + id)).data;
          console.log(movie);
          return Movie.fromJson(movie.data.item);
        } catch (error) {
          console.error(error);
          throw error;
        }
      }
    
      static async fetchMovies(
        title: string = '',
        offset: number = 0
      ): Promise<Movie[]> {
        try {
          const movies =
            title == ''
              ? (await axios.get('/movies/popular?page=' + offset)).data
              : (
                await axios.get(
                  '/movies/search?q=' + title /*+ '&max=' + max + '&offset=' + offset*/
                )
              ).data;
          console.log(movies);
          return movies.data.results.map((movie: JSON) => Movie.fromJson(movie));
        } catch (error) {
          console.error(error);
          throw error;
        }
      }
    }
    