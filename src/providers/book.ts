import Book from '@/models/book';
import axios from 'axios';

export default class BookProvider {
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
}
