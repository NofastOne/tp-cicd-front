import { mount, flushPromises } from '@vue/test-utils';
import { ref } from 'vue';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import BooksView from '@/views/BooksView.vue';

// Mock des services
const books = ref([
  {
    id: 1,
    title: '1984',
    publishYear: 1949,
    isbn: '123456789',
    author: { firstName: 'George', lastName: 'Orwell' },
  },
  {
    id: 2,
    title: 'Les Misérables',
    publishYear: 1862,
    isbn: '987654321',
    author: { firstName: 'Victor', lastName: 'Hugo' },
  },
]);

const authors = ref([
  { id: 1, firstName: 'George', lastName: 'Orwell' },
  { id: 2, firstName: 'Victor', lastName: 'Hugo' },
]);

const getAllBooksMock = vi.fn();
const deleteBookMock = vi.fn();
const getAllAuthorsMock = vi.fn();

vi.mock('@/composables/book/bookService', () => ({
  useBookService: () => ({
    books,
    getAllBooks: getAllBooksMock,
    deleteBook: deleteBookMock,
  }),
}));

vi.mock('@/composables/author/authorService', () => ({
  useAuthorService: () => ({
    authors,
    getAllAuthors: getAllAuthorsMock,
  }),
}));

describe('BooksView.vue', () => {
  let wrapper: ReturnType<typeof mount>;

  beforeEach(async () => {
    wrapper = mount(BooksView, {
      global: {
        stubs: {
          DataTable: true,
          Column: true,
          PButton: true,
          BookDialog: true, // stub le dialogue pour éviter document undefined
        },
      },
    });
    await flushPromises();
  });

  it('doit appeler getAllBooks au montage et pas getAllAuthors car authors est déjà remplie', async () => {
    await flushPromises();
    expect(getAllBooksMock).toHaveBeenCalled();
    expect(getAllAuthorsMock).not.toHaveBeenCalled();
  });

  it('doit appeler getAllBooks et getAllAuthors si authors vide', async () => {
    // authors vide
    authors.value = [];

    mount(BooksView, {
      global: {
        stubs: {
          DataTable: true,
          Column: true,
          PButton: true,
          BookDialog: true,
        },
      },
    });

    await flushPromises();

    expect(getAllBooksMock).toHaveBeenCalled();
    expect(getAllAuthorsMock).toHaveBeenCalled();
  });

  it('doit initialiser form et ouvrir le dialogue avec openNew', async () => {
    wrapper.vm.openNew();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.form).toEqual({
      title: '',
      publishYear: '',
      isbn: '',
      author: { firstName: '', lastName: '' },
    });
    expect(wrapper.vm.dialogVisible).toBe(true);
  });

  it('doit copier les données du livre et ouvrir le dialogue avec openUpdate', async () => {
    const book = books.value[0];
    wrapper.vm.openUpdate(book);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.form).toEqual(book);
    expect(wrapper.vm.dialogVisible).toBe(true);
  });

  it('doit appeler deleteBook avec l’id correct', async () => {
    wrapper.vm.del(2);
    expect(deleteBookMock).toHaveBeenCalledWith(2);
  });
});
