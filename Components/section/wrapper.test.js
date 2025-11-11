import { shallowMount } from '@vue/test-utils';

import ESectionWrapper from './wrapper.vue';

describe('SectionWrapper', () => {
  itRendersAndIsVisible(
    shallowMount(ESectionWrapper),
    'section',
    'section-wrapper',
  );
});
