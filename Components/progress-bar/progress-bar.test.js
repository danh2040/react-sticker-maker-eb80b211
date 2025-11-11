import { mount } from '@vue/test-utils';

import EProgressBar from './index.vue';

const options = {
  propsData: {
    goal: 10000,
    standing: 3000,
  },
};

describe('EProgressBar', () => {
  itRendersAndIsVisible(mount(EProgressBar, options), 'div', 'progress-bar__container');

  it.each([
    [0, 3000, 10000, '30.0'],
    [0, 1, 2, '50.0'],
    [0, 36, 35, '102.9'],
    [1000, 3000, 10000, '22.2'],
    [10, 36, 35, '104.0'],
  ])('with standing: %d & goal: %d, the % progress should be correctly calculated to be %p', async (startPoint, standing, goal, expected) => {
    const opts = {
      propsData: {
        startPoint,
        goal,
        standing,
      },
    };
    const wrapper = mount(EProgressBar, opts);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.progress).toEqual(expected);
  });
});
