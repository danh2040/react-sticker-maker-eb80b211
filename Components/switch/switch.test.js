import { mount } from '@vue/test-utils';

import ESwitch from './index.vue';

const propsData = {
  name: 'test',
  label: 'This is a label',
  description: 'This is a description',
  value: true,
};

describe('ESwitch', () => {
  let wrapper;

  itRendersAndIsVisible(mount(ESwitch, { propsData }), 'div');

  beforeEach(() => {
    wrapper = mount(ESwitch, { propsData });
  });

  it('has enabled indicator class', () => {
    wrapper = mount(
      ESwitch,
      {
        propsData: {
          ...propsData,
          value: true,
        },
      },
    );

    const classListArray = [...wrapper.element.classList];
    expect(classListArray).toContain('switch--on');
  });

  it('has disabled indicator class', () => {
    wrapper = mount(
      ESwitch,
      {
        propsData: {
          ...propsData,
          value: false,
        },
      },
    );

    const classListArray = [...wrapper.element.classList];
    expect(classListArray).toContain('switch--off');
  });

  it('emits update with new value', async () => {
    const checkbox = wrapper.find(byTestId('checkbox-input'));

    await checkbox.trigger('click');

    expect(wrapper.emitted('update')).toBeTruthy();
    expect(wrapper.emitted('update')[0][0]).toEqual(false);
  });
});
