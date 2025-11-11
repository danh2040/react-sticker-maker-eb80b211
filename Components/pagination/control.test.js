import { mount } from '@vue/test-utils';

import EPaginationControl from './control.vue';

const propsData = { side: 'left' };

describe('EPaginationControl', () => {
  itRendersAndIsVisible(mount(EPaginationControl, { propsData }), 'a');
});
