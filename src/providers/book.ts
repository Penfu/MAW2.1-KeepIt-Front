import type Book from '@/models/book';
import axios from 'axios';

export default class BookProvider {
  static async fetchBooks(max: number = 10, offset: number = 0): Promise<Book[]> {
    try {
      const response = await axios.get('/books?max=' + max + '&offset=' + offset);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
