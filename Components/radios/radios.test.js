import { mount } from '@vue/test-utils';

import ERadios from './index.vue';

describe('ERadios', () => {
  itRendersAndIsVisible(
    mount(ERadios, {
      propsData: {
        name: 'choices',
        model: 'model',
        options: [{
          label: 'First',
          value: '1',
        }],
      },
    }),
    'div',
    'radios',
  );

  it('renders radio buttons included in props', () => {
    const wrapper = mount(ERadios, {
      propsData: {
        name: 'choices',
        model: 'model',
        options: [{
          label: 'First',
          value: '1',
        }, {
          label: 'Second',
          value: '2',
        }],
      },
    });
    const radios = wrapper.findAll(byTestId('radios-radio'));
    const first = radios.at(0);
    const second = radios.at(1);
    const firstElement = first.find(byTestId('radio-input')).element;
    const secondElement = second.find(byTestId('radio-input')).element;
    expect(radios.length).toBe(2);
    expect(firstElement.checked).toBe(false);
    firstElement.click();
    expect(firstElement.checked).toBe(true);
    expect(secondElement.checked).toBe(false);
    secondElement.click();
    expect(firstElement.checked).toBe(false);
    expect(secondElement.checked).toBe(true);
  });

  it('overrides value with v-model', async () => {
    const wrapper = mount({
      name: 'Test',
      components: { ERadios },
      data() {
        return { value: null };
      },
      template: `
        <ERadios name="test" v-model="value" :options="['first', 'second']" />
      `,
    });
    const radios = wrapper.findAll(byTestId('radios-radio'));
    expect(radios.at(0).find(byTestId('radio-input')).element.checked).toBe(false);
    wrapper.setData({ value: 'first' });
    await wrapper.vm.$nextTick();
    expect(radios.at(0).find(byTestId('radio-input')).element.checked).toBe(true);
  });
});
