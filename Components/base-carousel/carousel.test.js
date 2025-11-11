import { shallowMount } from '@vue/test-utils';
import { mockIntersectionObserver } from 'jsdom-testing-mocks';

import EBaseCarousel, { scrollStates } from './index.vue';

const intersectionObserver = mockIntersectionObserver();

describe('BaseCarousel', () => {
  beforeAll(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runAllTimers();
  });

  itRendersAndIsVisible(
    shallowMount(EBaseCarousel),
    'div',
  );

  it.each([
    'previous',
    'next',
  ])('hides %s-control slot', async (control) => {
    const scopedSlot = `<button data-test-id="${control}-button" type="button" v-show="props.visible">${control}</button>`;
    const scopedSlots = { [`${control}-control`]: scopedSlot };
    const wrapper = shallowMount(EBaseCarousel, { scopedSlots });
    wrapper.setData({ scrollState: control === 'next' ? scrollStates.END : scrollStates.START });
    const button = wrapper.find(byTestId(`${control}-button`));

    expect(button).not.toBeVisible();
  });

  it('triggers the scroll handler and updates component data', async () => {
    const wrapper = await shallowMount(EBaseCarousel);
    expect(wrapper.vm.scrollState).toBe(scrollStates.NONE);
    wrapper.vm.getCurrentScrollPosition = vi.fn();
    const content = wrapper.find(byTestId('carousel-content'));
    intersectionObserver.enterNode(wrapper.element);
    await content.trigger('scroll');

    expect(wrapper.vm.scrollState).toBe(scrollStates.MIDDLE);
    expect(wrapper.emitted('scroll-state')[0][0]).toBe('middle');
  });
});
