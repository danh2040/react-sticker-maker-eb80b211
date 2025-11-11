import Vue from 'vue';
import { mount } from '@vue/test-utils';

import EListItem from '@ecosia/common-vue2/components/list-item/index.vue';

import ESearchSelect from './search-select.vue';

const propsData = {
  name: 'name',
  value: 'value',
  options: ['option 1', 'option 2', 'option 3', 'none of the above'],
};

const inputElementSelector = `${byTestId(propsData.name)} ${byTestId('input-input')}`;

describe('ESelect', () => {
  // temporarily suppressing Vue warnings due to this bug:
  // https://github.com/vuejs/vue-test-utils/issues/532
  // TODO: check if bug can be fixed in another way or goes away in future versions
  const vueConfigSilent = Vue.config.silent;

  beforeAll(() => {
    Vue.config.silent = true;
  });

  afterAll(() => {
    Vue.config.silent = vueConfigSilent;
  });

  itRendersAndIsVisible(mount(ESearchSelect, { propsData }), 'div', 'search-select');

  it('filters the options when typing in the input', async () => {
    const wrapper = mount(ESearchSelect, { propsData });
    const input = wrapper.find(inputElementSelector);
    // Open the dropdown
    await input.trigger('mousedown');
    // Find 4 options
    expect(wrapper.findAllComponents(EListItem).length).toBe(4);
    // Type 'option'
    await input.setValue('option');
    await input.trigger('keyup', { key: 'space' }); // otherwise it defaults to ESC key.
    await wrapper.vm.$nextTick();
    // Find 3 "option N"
    expect(wrapper.findAllComponents(EListItem).length).toBe(3);
    // Type 'option 3'
    await input.setValue('option 3');
    await input.trigger('keyup', { key: 'space' }); // otherwise it defaults to ESC key.
    await wrapper.vm.$nextTick();
    // Find only 1 option
    expect(wrapper.findAllComponents(EListItem).length).toBe(1);
  });

  it('filters duplicate labels', async () => {
    const propsDataDuplicates = {
      name: 'name',
      value: 'value',
      options: [{ label: 'option 1' }, { label: 'option 2' }, { label: 'option 3' }, { label: 'option 3' }],
    };
    const wrapper = mount(ESearchSelect, { propsData: propsDataDuplicates });
    const input = wrapper.find(inputElementSelector);
    // Open the dropdown
    await input.trigger('mousedown');
    // Find 4 options
    expect(wrapper.findAllComponents(EListItem).length).toBe(4);
    // Type 'option'
    await input.setValue('option 3');
    await input.trigger('keyup', { key: 'space' }); // otherwise it defaults to ESC key.
    await wrapper.vm.$nextTick();
    // Find 3 "option N"
    expect(wrapper.findAllComponents(EListItem).length).toBe(1);
  });
});
