import { shallowMount } from '@vue/test-utils';

import EError from './index.vue';

describe('EError', () => {
  itRendersAndIsVisible(shallowMount(EError, { slots: { default: 'error' } }), 'div', 'error');
});
