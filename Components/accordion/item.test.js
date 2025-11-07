import { mount } from '@vue/test-utils';

import EAccordionItem from '@ecosia/common-vue2/components/accordion/item.vue';

describe('Accordion', () => {
  const itemKey = 1;
  let getActiveItemIndex;
  let update;
  let options;

  beforeEach(() => {
    getActiveItemIndex = vi.fn();
    update = vi.fn();

    options = {
      propsData: {
        itemKey,
      },
      provide: {
        getActiveItemIndex,
        update,
      },
    };
  });

  itRendersAndIsVisible(mount(EAccordionItem, {
    propsData: {
      itemKey: 1,
    },
    provide: {
      getActiveItemIndex: () => {},
      update: () => {},
    },
  }), 'div');

  it('calls getActiveItemIndex to set active state', () => {
    options.provide.getActiveItemIndex.mockReturnValueOnce(itemKey);
    const wrapper = mount(EAccordionItem, options);
    expect(getActiveItemIndex).toHaveBeenCalled();
    expect(wrapper.vm.active).toBe(true);
  });

  it('toggles state to close', async () => {
    options.provide.getActiveItemIndex.mockReturnValueOnce(itemKey);
    const wrapper = mount(EAccordionItem, options);
    await wrapper.find(byTestId('accordion-item-button')).trigger('click');
    expect(update).toHaveBeenCalledWith(null);
    expect(wrapper.emitted().close).toBeTruthy();
  });

  it('toggles state to open', async () => {
    options.provide.getActiveItemIndex.mockReturnValueOnce(2);
    const wrapper = mount(EAccordionItem, options);
    await wrapper.find(byTestId('accordion-item-button')).trigger('click');
    expect(update).toHaveBeenCalledWith(itemKey);
    expect(wrapper.emitted().open).toBeTruthy();
  });
});
