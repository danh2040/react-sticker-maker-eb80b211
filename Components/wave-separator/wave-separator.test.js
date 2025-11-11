import '@ecosia/common-vue2/directives/intersect.js';

import { mount, shallowMount } from '@vue/test-utils';

import EWaveSeparator from './index.vue';

describe('WaveSeparator', () => {
  itRendersAndIsVisible(mount(EWaveSeparator), 'div');

  it('renders visible class', async () => {
    const wrapper = mount(EWaveSeparator);
    expect(wrapper.classes().includes('wave-separator--visible')).toBe(false);
    wrapper.vm.show();
    await wrapper.vm.$nextTick();
    expect(wrapper.classes().includes('wave-separator--visible')).toBe(true);
  });

  it('warns on invalid wave', () => {
    expect(() => shallowMount(EWaveSeparator, { propsData: { variant: 'thirtiray' } })).toHaveInvalidProp('variant');
  });
});
