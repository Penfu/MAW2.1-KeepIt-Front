import Movie from '@/models/movie';
import axios from 'axios';


export default class MovieProvider {
    static async fetchMovie(id: string): Promise<Movie> {
        try {
          const movie = (await axios.get('/movies/' + id)).data;
          return Movie.fromJson(movie.data.item);
        } catch (error) {
          console.error(error);
          throw error;
        }
      }
    
      static async fetchMovies(
        title: string = '',
        page: number = 0,
        max: number = 10,
      ): Promise<Movie[]> {
        try {
          const movies =
            title == ''
              ? (await axios.get('/movies/popular?page=' + page + '&max=' + max)).data
              : (
                await axios.get(
                  '/movies/search?q=' + title /*+ '&max=' + max + '&offset=' + offset*/
                )
              ).data;
          return movies.data.results.map((movie: JSON) => Movie.fromJson(movie));
        } catch (error) {
          console.error(error);
          throw error;
        }
      }

      static async upVote(id: string = ''): Promise<void> {
        try {
          await axios.put(`/movies/${id}/upvote`, {});
        } catch (error) {
          console.error(error);
          throw error;
        }
      }
    
      static async downVote(id: string = ''): Promise<void> {
        try {
          await axios.put(`/movies/${id}/downvote`, {});
        } catch (error) {
          console.error(error);
          throw error;
        }
      }
    
      static async unVote(id: string = ''): Promise<void> {
        try {
          await axios.delete(`/movies/${id}/unvote`);
        } catch (error) {
          console.error(error);
          throw error;
        }
      }
    
      static async track(id: string = '', time: number): Promise<void> {
        try {
          await axios.put(`/movies/${id}/track`, { time });
        } catch (error) {
          console.error(error);
          throw error;
        }
      }
    }
    