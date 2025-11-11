import { shallowMount } from '@vue/test-utils';

import EDivider from './index.vue';

describe('EDivider', () => {
  itRendersAndIsVisible(shallowMount(EDivider), 'hr');
});
