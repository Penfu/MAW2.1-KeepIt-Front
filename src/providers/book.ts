import Book from '@/models/book';
import axios from 'axios';

export default class BookProvider {
static async searchBooks(query: string, max: number = 10, offset: number = 0): Promise<Book[]> {
    try {
      const response = await axios.get('/books/search?q=' + query + '&max=' + max + '&offset=' + offset);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async fetchBooks(max: number = 10, offset: number = 0): Promise<Book[]> {
    try {
      const books = (await axios.get('/books?max=' + max + '&offset=' + offset)).data;
      return books.data.items.map((book: JSON) => Book.fromJson(book));
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
