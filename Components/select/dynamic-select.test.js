import Vue from 'vue';
import { mount } from '@vue/test-utils';

import EDynamicSelect from './dynamic-select.vue';

vi.useFakeTimers();
vi.mock('@ecosia/js-utils/debounce.js', () => ({
  default: vi.fn((fn) => {
    fn.cancel = vi.fn();
    return fn;
  }),
}));

const propsData = {
  name: 'trees',
  value: 'one',
  options: [
    { value: 'one', label: 'One Tree' },
    { value: 'two', label: 'Two Trees' },
    { value: 'three', label: 'Three Trees' },
  ],
  searchFunction: () => [],
  debounceTime: 250,
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

  itRendersAndIsVisible(mount(EDynamicSelect, { propsData }), 'div');

  it('renders the initial value', async () => {
    const wrapper = mount(EDynamicSelect, { propsData });
    const input = wrapper.find(inputElementSelector);
    await wrapper.vm.$nextTick();
    expect(input.element.value).toBe('One Tree');
  });

  it('calls the external search function when searching', async () => {
    const searchFunction = vi.fn(() => propsData.options);
    const wrapper = mount(EDynamicSelect, { propsData: {
      ...propsData,
      searchFunction,
    } });
    const input = wrapper.find(inputElementSelector);

    await input.setValue('two');
    await input.trigger('keyup');

    // Fast forward debounce timers
    vi.runAllTimers();
    expect(searchFunction).toHaveBeenCalledTimes(1);
  });

  it('uses the external function to filter', async () => {
    const searchFunction = vi.fn();
    searchFunction.mockResolvedValue(propsData.options);

    const wrapper = mount(EDynamicSelect, { propsData: {
      name: 'trees',
      options: [],
      value: null,
      searchFunction,
    } });
    const input = wrapper.find(inputElementSelector);
    expect(wrapper.findAll(byTestId('select-element-option'))).toHaveLength(0);
    await input.setValue('Tree');
    await input.trigger('keyup');
    await input.trigger('mousedown');
    await wrapper.vm.$nextTick();
    expect(wrapper.findAll(byTestId('select-element-option'))).toHaveLength(3);
  });
});
