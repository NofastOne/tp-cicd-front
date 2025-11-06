// Stub global pour PrimeVue components qui utilisent document
import { vi } from 'vitest';

vi.mock('primevue/datatable', () => ({
  default: { template: '<div />' },
}));
vi.mock('primevue/column', () => ({
  default: { template: '<div />' },
}));
vi.mock('primevue/dialog', () => ({
  default: { template: '<div />' },
}));
vi.mock('primevue/button', () => ({
  default: { template: '<button />' },
}));
vi.mock('primevue/inputtext', () => ({
  default: { template: '<input />' },
}));
