import { shallowMount } from '@vue/test-utils';

import EList from './index.vue';

describe('EList', () => {
  describe('unordered list renders as ul', () => {
    itRendersAndIsVisible(shallowMount(EList, { }), 'ul');
  });

  describe('ordered list renders as ol', () => {
    itRendersAndIsVisible(shallowMount(EList, { propsData: { ordered: true } }), 'ol');
  });
});
