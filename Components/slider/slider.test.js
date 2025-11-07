import { mount, shallowMount } from '@vue/test-utils';

import ESlider, { INTERVAL_CHANGE_SLIDE, translateFunc } from './index.vue';

const slides = [{
  title: 'Slide 1 title',
  description: 'Slide 1 description',
}, {
  title: 'Slide 2 title',
  description: 'Slide 2 description',
}, {
  title: 'Slide 3 title',
  description: 'Slide 3 description',
}];
const propsData = {
  slides,
};

describe('Extension Section', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(ESlider, { propsData });
  });

  itRendersAndIsVisible(
    mount(ESlider, { propsData }),
    'div',
    'slider',
  );

  it('switch next slide on click Next', async () => {
    const { activeIndex: currentIndex } = wrapper.vm;
    await wrapper.find(byTestId('slider-control-next')).trigger('click');
    expect(wrapper.vm.activeIndex).toBe(currentIndex + 1);
    const innerSlider = wrapper.find('.slider__inner');
    expect(innerSlider.element.style.transform).toBe(
      `translateX(${translateFunc(currentIndex + 1, slides.length)}%)`,
    );
  });

  it('switch previous slide on click Previous icon', async () => {
    await wrapper.find(byTestId('slider-control-next')).trigger('click');
    await wrapper.find(byTestId('slider-control-previous')).trigger('click');
    expect(wrapper.vm.activeIndex).toBe(0);
    const innerSlider = wrapper.find(byTestId('slider-inner'));
    expect(innerSlider.element.style.transform).toBe(
      `translateX(${translateFunc(wrapper.vm.activeIndex, wrapper.vm.slides.length)}%)`,
    );
  });

  it('check changeSlide method', () => {
    expect(wrapper.vm.activeIndex).toEqual(0);
    wrapper.vm.changeSlide();
    expect(wrapper.vm.activeIndex).toEqual(1);
  });

  it('change slides intervally', () => {
    vi.useFakeTimers();
    expect(wrapper.vm.activeIndex).toEqual(0);

    wrapper.vm.initialAutoChangeSlide();
    vi.advanceTimersByTime(INTERVAL_CHANGE_SLIDE);

    expect(wrapper.vm.activeIndex).toEqual(1);
  });

  it.each(
    ['slider-control-next', 'slider-control-previous'],
  )('clear interval when click on Next and Previous icons', async (testId) => {
    const spy = vi.spyOn(global, 'clearInterval').mockImplementation(() => {});
    wrapper = mount(ESlider, { propsData });
    await wrapper.find(byTestId(testId)).trigger('click');
    expect(spy).toHaveBeenCalled();
  });

  it('clear interval when destroyed', () => {
    const spy = vi.spyOn(global, 'clearInterval').mockImplementation(() => {});
    wrapper = shallowMount(ESlider, { propsData });
    wrapper.destroy();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
