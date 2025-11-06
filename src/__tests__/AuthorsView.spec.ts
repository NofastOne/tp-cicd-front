import { mount, flushPromises } from '@vue/test-utils';
import { ref } from 'vue';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AuthorsView from '@/views/AuthorsView.vue';
import AuthorDialog from '@/components/AuthorDialog.vue';

// Mock du composable
const mockAuthors = ref([
  { id: 1, firstName: 'Victor', lastName: 'Hugo' },
  { id: 2, firstName: 'George', lastName: 'Orwell' },
]);

const getAllAuthorsMock = vi.fn();
const deleteAuthorMock = vi.fn();

vi.mock('@/composables/author/authorService', () => ({
  useAuthorService: () => ({
    authors: mockAuthors,
    getAllAuthors: getAllAuthorsMock,
    deleteAuthor: deleteAuthorMock,
  }),
}));

describe('AuthorsView.vue', () => {
  let wrapper: ReturnType<typeof mount>;

  beforeEach(async () => {
    wrapper = mount(AuthorsView, {
      global: {
        stubs: {
          DataTable: true,
          Column: true,
          PButton: true,
          AuthorDialog: AuthorDialog,
        },
      },
    });
    await flushPromises();
  });

  it('doit appeler getAllAuthors au montage', async () => {
    await flushPromises();
    expect(getAllAuthorsMock).toHaveBeenCalled();
  });

  it('doit initialiser selectAuthor et ouvrir le dialogue avec openNew', async () => {
    wrapper.vm.openNew();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.selectAuthor).toEqual({ firstName: '', lastName: '' });
    expect(wrapper.vm.dialogVisible).toBe(true);
  });

  it('doit copier les données de l’auteur et ouvrir le dialogue avec openUpdate', async () => {
    const author = { id: 1, firstName: 'Victor', lastName: 'Hugo' };
    wrapper.vm.openUpdate(author);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.selectAuthor).toEqual(author);
    expect(wrapper.vm.dialogVisible).toBe(true);
  });

  it('doit appeler deleteAuthor avec l’id correct', async () => {
    wrapper.vm.del(2);
    expect(deleteAuthorMock).toHaveBeenCalledWith(2);
  });
});
