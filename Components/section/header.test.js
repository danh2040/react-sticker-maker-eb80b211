import { shallowMount } from '@vue/test-utils';

import ESectionHeader from './header.vue';

describe('SectionHeader', () => {
  const props = {
    title: 'Ecosia the Search Engine that plants trees',
    subtitle: 'We plant trees',
  };

  itRendersAndIsVisible(
    shallowMount(ESectionHeader, { props }),
    'div',
    'section-header',
  );
});
