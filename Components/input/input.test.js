import { mount } from '@vue/test-utils';

import EInput from './index.vue';

describe('EInput', () => {
  itRendersAndIsVisible(mount(EInput, {
    propsData: {
      name: 'name',
      value: 'text',
    },
  }), 'div', 'input');

  it('renders value', () => {
    const wrapper = mount(EInput, {
      propsData: {
        name: 'name',
        value: 'text',
      },
    });
    expect(wrapper.find(byTestId('input-input')).element.value).toBe('text');
  });

  it('overrides value with v-model', async () => {
    const wrapper = mount({
      name: 'Test',
      components: { EInput },
      data() {
        return { value: '' };
      },
      template: '<EInput name="test" v-model="value" />',
    });
    expect(wrapper).toBeVisible();
    expect(wrapper.find(byTestId('input-input')).element.value).toBe('');
    wrapper.vm.value = 'hello';
    await wrapper.vm.$nextTick();
    expect(wrapper.find(byTestId('input-input')).element.value).toBe('hello');
  });

  it.each([['name', 'Name'], ['type', 'text'], ['placeholder', 'Placeholder']])('renders with attribute %s', (attr, value) => {
    const wrapper = mount(EInput, {
      propsData: {
        [attr]: value,
      },
    });

    expect(wrapper.find(byTestId('input-input')).element.getAttribute(attr)).toEqual(value);
  });

  // TODO: write tests for classes
});
