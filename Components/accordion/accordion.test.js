import { mount } from '@vue/test-utils';

import EAccordion from '@ecosia/common-vue2/components/accordion/index.vue';

describe('Accordion', () => {
  itRendersAndIsVisible(mount(EAccordion), 'div');

  it('renders slot', () => {
    const slotContent = 'Slot content';
    const wrapper = mount(EAccordion, {
      slots: {
        default: slotContent,
      },
    });
    expect(wrapper.html()).toContain(slotContent);
  });
});
