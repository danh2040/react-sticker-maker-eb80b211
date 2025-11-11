import { mount, shallowMount } from '@vue/test-utils';

import startCase from '@ecosia/js-utils/start-case.js';

import EField, { allowedTypes } from './index.vue';

const vueComponentsTypes = ['button', 'radio', 'textarea', 'select', 'segmented-button'];
const nativeTypes = allowedTypes.filter(
  (type) => !vueComponentsTypes.includes(type),
);

describe('EField', () => {
  itRendersAndIsVisible(
    shallowMount(EField, {
      propsData: {
        name: 'name',
        value: 'value',
        type: 'textarea',
      },
    }),
    'div',
    'field',
  );

  it('renders props', () => {
    const wrapper = shallowMount(EField, {
      propsData: {
        name: 'name',
        value: 'value',
        type: 'textarea',
      },
    });
    const input = wrapper.find('.field__input');
    expect(input.element.getAttribute('name')).toBe('name');
    expect(input.props('value')).toBe('value');
  });

  it('overrides value with v-model', () => {
    const wrapper = mount(EField, {
      propsData: {
        name: 'Test',
        type: 'text',
        value: '',
      },
    });

    const inputField = wrapper.find('input');

    expect(wrapper.classes('field')).toBe(true);
    expect(wrapper).toBeVisible();
    expect(wrapper.find('input').element.value).toBe('');
    inputField.setValue('hello');
    expect(wrapper.find('input').element.value).toBe('hello');
  });

  it.each(nativeTypes)('overrides default type with %p', (type) => {
    const wrapper = mount(EField, {
      propsData: {
        name: 'Test',
        type: `${type}`,
        value: '',
      },
    });

    expect(wrapper.classes('field')).toBe(true);
    expect(wrapper).toBeVisible();
    expect(wrapper.find('input').element.type).toBe(type);
  });

  it.each(vueComponentsTypes)('renders %p component when type is given', (type) => {
    const wrapper = mount(EField, {
      propsData: {
        name: 'Test',
        type: `${type}`,
        variant: 'solid-white',
      },
    });

    // replace possible spaces for multi worded types
    let componentName = `E${startCase(type).replace(' ', '')}`;

    // The radio type will create the ERadios component
    if (type === 'radio') {
      componentName = `${componentName}s`;
    }

    const input = wrapper.findComponent({ name: componentName });

    expect(input.exists()).toBe(true);
    expect(wrapper.classes('field')).toBe(true);
    expect(wrapper).toBeVisible();
  });

  describe('has no description', () => {
    it('has no aria-describedby id', () => {
      const wrapper = mount(EField, {
        propsData: {
          name: 'name',
          value: 'value',
        },
      });

      const input = wrapper.find('input');

      expect(input.attributes('aria-describedby')).toBe('');
    });
  });

  describe('has a description', () => {
    const options = {
      propsData: {
        name: 'Test',
        type: 'text',
        value: '',
        label: 'my label',
      },
      slots: {
        description: 'my description',
      },
    };

    it('renders label and description', () => {
      const wrapper = shallowMount(EField, options);

      const label = wrapper.find('.field__label');
      const description = wrapper.find('.field__description');

      expect(description).toBeVisible();
      expect(label).toBeVisible();
      expect(label.text()).toBe('my label');
      expect(description.text()).toBe('my description');
    });

    it('has correctly aria-describedby id for description', () => {
      const wrapper = mount(EField, options);

      const description = wrapper.find('.field__description');
      const input = wrapper.find('input');

      expect(description).toBeVisible();
      expect(description.attributes('id')).toBe('e-field-Test-description');
      expect(input.attributes('aria-describedby')).toBe('e-field-Test-description');
    });
  });

  it('renders label with a "for" attribute whose value is the input element\'s id', () => {
    const wrapper = mount(EField, {
      propsData: {
        name: 'Test',
        type: 'text',
        value: '',
        label: 'my label',
      },
    });

    const label = wrapper.find('.field__label');
    const input = wrapper.find('input');

    expect(label.attributes('for')).toEqual(input.attributes('id'));
  });

  it('sets aria label attribute if prop present', () => {
    const wrapper = mount(EField, {
      propsData: {
        name: 'Test',
        type: 'text',
        value: '',
        label: 'my label',
        ariaLabel: 'some aria label',
      },
    });

    const input = wrapper.find('input');

    expect(input.attributes('aria-label')).toEqual('some aria label');
  });

  it('uses label as aria label attribute if no prop present', () => {
    const wrapper = mount(EField, {
      propsData: {
        name: 'Test',
        type: 'text',
        value: '',
        label: 'my label',
      },
    });

    const input = wrapper.find('input');

    expect(input.attributes('aria-label')).toEqual('my label');
  });
});
