import { shallowMount } from '@vue/test-utils';

import EButtonGroup from './index.vue';

describe('EButtonGroup', () => {
  itRendersAndIsVisible(shallowMount(EButtonGroup), 'div', 'button-group');
});
