import { mount, flushPromises } from '@vue/test-utils';
import { ref } from 'vue';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import BookCopiesView from '@/views/BookCopiesView.vue';

// Mock des services
const bookCopys = ref([
  {
    id: 1,
    available: true,
    state: 'New',
    book: {
      title: '1984',
      publishYear: 1949,
      isbn: '123456789',
      author: { firstName: 'George', lastName: 'Orwell' },
    },
  },
]);

const books = ref([
  {
    id: 1,
    title: '1984',
    publishYear: 1949,
    isbn: '123456789',
    author: { firstName: 'George', lastName: 'Orwell' },
  },
]);

const getAllBookCopiesMock = vi.fn();
const deleteBookCopyMock = vi.fn();
const getAllBooksMock = vi.fn();

vi.mock('@/composables/bookcopy/bookCopyService', () => ({
  useBookCopyService: () => ({
    bookCopys,
    getAllBookCopies: getAllBookCopiesMock,
    deleteBookCopy: deleteBookCopyMock,
  }),
}));

vi.mock('@/composables/book/bookService', () => ({
  useBookService: () => ({
    books,
    getAllBooks: getAllBooksMock,
  }),
}));

describe('BookCopiesView.vue', () => {
  let wrapper: ReturnType<typeof mount>;

  beforeEach(async () => {
    wrapper = mount(BookCopiesView, {
      global: {
        stubs: {
          DataTable: true,
          Column: true,
          PButton: true,
          BookCopyDialog: true, // stub le dialogue pour éviter document undefined
        },
      },
    });
    await flushPromises();
  });

  it('doit appeler getAllBookCopies mais pas getAllBooks si books déjà remplie', async () => {
    await flushPromises();
    expect(getAllBookCopiesMock).toHaveBeenCalled();
    expect(getAllBooksMock).not.toHaveBeenCalled();
  });

  it('doit appeler getAllBookCopies et getAllBooks si books vide au montage', async () => {
    books.value = [];
    mount(BookCopiesView, {
      global: { stubs: { DataTable: true, Column: true, PButton: true, BookCopyDialog: true } },
    });
    await flushPromises();
    expect(getAllBookCopiesMock).toHaveBeenCalled();
    expect(getAllBooksMock).toHaveBeenCalled();
  });

  it('doit initialiser form et ouvrir le dialogue avec openNew', async () => {
    wrapper.vm.openNew();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.form).toEqual({
      available: true,
      state: '',
      book: { title: '', publishYear: '', isbn: '', author: { firstName: '', lastName: '' } },
    });
    expect(wrapper.vm.dialogVisible).toBe(true);
  });

  it('doit copier les données de la copie et ouvrir le dialogue avec openUpdate', async () => {
    const copy = bookCopys.value[0];
    wrapper.vm.openUpdate(copy);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.form).toEqual(copy);
    expect(wrapper.vm.dialogVisible).toBe(true);
  });

  it('doit appeler deleteBookCopy avec l’id correct', async () => {
    wrapper.vm.del(1);
    expect(deleteBookCopyMock).toHaveBeenCalledWith(1);
  });
});
