import { shallowMount } from '@vue/test-utils';

import EMainNavMenuCounter from './counter.vue';

const createOptions = (propsData) => {
  return {
    propsData: {
      value: 1,
      previousValue: 0,
      ...propsData,
    },
  };
};

describe('EMainNavMenuCounter', () => {
  it("doesn't have any classes by default", () => {
    const options = createOptions();
    const wrapper = shallowMount(EMainNavMenuCounter, options);
    expect(wrapper.classes()).toEqual(['counter']);
  });

  describe('is text animation disabled', () => {
    const options = createOptions({ isTextAnimationDisabled: true });

    it('sets the class to have the text animation disabled', () => {
      const wrapper = shallowMount(EMainNavMenuCounter, options);
      expect(wrapper.classes()).toContain('counter--is-text-animation-disabled');
    });
  });

  describe('is animation delayed', () => {
    const options = createOptions({ isAnimationDelayed: true });

    it('sets the class to have animation delayed', () => {
      const wrapper = shallowMount(EMainNavMenuCounter, options);
      expect(wrapper.classes()).toContain('counter--is-animation-delayed');
    });
  });
});
