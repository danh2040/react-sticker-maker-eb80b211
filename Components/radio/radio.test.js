import Vue from 'vue';
import { mount, shallowMount } from '@vue/test-utils';

import ERadio from './index.vue';

const text = 'Text';
const options = {
  slots: { default: text },
  propsData: { name: 'choice', modelValue: 'model', value: 'value' },
};

const createComponent = () => Vue.component('EComponent', {
  components: { ERadio },
  data() {
    return { model: '' };
  },
  template: '<ERadio v-model="model" value="test">Test</ERadio>',
});

describe('ERadio', () => {
  itRendersAndIsVisible(shallowMount(ERadio, options), 'label', 'radio');

  it('renders content', () => {
    const wrapper = shallowMount(ERadio, options);
    expect(wrapper.text()).toBe(text);
  });

  describe('click', () => {
    it('sets radio checked when clicking the input', async () => {
      const wrapper = mount(createComponent());
      expect(wrapper.find(byTestId('radio-input')).element.checked).toBe(false);
      await wrapper.find(byTestId('radio-input')).trigger('click');
      expect(wrapper.find(byTestId('radio-input')).element.checked).toBe(true);
    });

    it('sets radio checked when clicking the label', async () => {
      const wrapper = mount(createComponent());
      expect(wrapper.find(byTestId('radio-input')).element.checked).toBe(false);
      await wrapper.find(byTestId('radio-label')).trigger('click');
      expect(wrapper.find(byTestId('radio-input')).element.checked).toBe(true);
    });
  });
});
