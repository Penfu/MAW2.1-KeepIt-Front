import Book from '@/models/book';
import axios from 'axios';

export default class BookProvider {
  static async fetchBook(id: string): Promise<Book> {
    try {
      const book = (await axios.get('/books/' + id)).data;
      console.log(book);
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
      const response = await axios.put(`/books/${id}/upvote`);
      console.log(response);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async downVote(id: string = ''): Promise<void> {
    try {
      const response = await axios.put(`/books/${id}/downvote`);
      console.log(response);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async unVote(id: string = ''): Promise<void> {
    try {
      const response = await axios.delete(`/books/${id}/unvote`);
      console.log(response);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
