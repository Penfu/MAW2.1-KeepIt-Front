import Book from '@/models/book';
import axios from 'axios';
import Provider from './provider';

export default class BookProvider extends Provider {
  static async fetchBook(id: string): Promise<Book> {
    try {
      const book = (await axios.get('/books/' + id)).data;
      return Book.fromJson(book.data.item);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async fetchBooks(
    title: string = '',
    max: number = 10,
    offset: number = 0
  ): Promise<Book[]> {
    try {
      const books =
        title == ''
          ? (await axios.get('/books?max=' + max + '&offset=' + offset)).data
          : (
            await axios.get(
              '/books/search?q=' + title + '&max=' + max + '&offset=' + offset
            )
          ).data;

      return books.data.items.map((book: JSON) => Book.fromJson(book));
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async upVote(id: string = ''): Promise<void> {
    try {
      await axios.put(`/books/${id}/upvote`, {}, Provider.config());
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async downVote(id: string = ''): Promise<void> {
    try {
      await axios.put(`/books/${id}/downvote`, {}, Provider.config());
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async unVote(id: string = ''): Promise<void> {
    try {
      await axios.delete(`/books/${id}/unvote`, Provider.config());
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async track(id: string = '', page: number): Promise<void> {
    try {
      await axios.put(`/books/${id}/track`, { page }, Provider.config());
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
