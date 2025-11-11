import { shallowMount } from '@vue/test-utils';

import ETextarea, { AUTOSCALE_MAX_HEIGHT, resizeOptions } from './index.vue';

describe('ETextarea', () => {
  const getTextArea = (wrapper) => wrapper.find('textarea');

  itRendersAndIsVisible(shallowMount(ETextarea, {
    propsData: {
      name: 'name',
      value: 'value',
      autoScale: true,
    },
  }), 'div');

  it('renders attributes and props', () => {
    const wrapper = shallowMount(ETextarea, {
      propsData: {
        name: 'name',
        value: 'value',
        autoScale: true,
      },
    });

    const textArea = getTextArea(wrapper);
    expect(textArea.attributes('name')).toBe('name');
    expect(wrapper.props('value')).toBe('value');

    const longValue = 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.';
    textArea.setValue(longValue);
    expect(textArea.element.value).toBe(longValue);
  });

  it('renders value', () => {
    const value = 'Test';
    const wrapper = shallowMount(ETextarea, {
      propsData: {
        name: 'name',
        value: 'value',
      },
    });

    const textArea = getTextArea(wrapper);
    textArea.setValue(value);
    expect(textArea.element.value).toBe(value);
  });

  describe('autoscale feature', () => {
    const autoScaleProps = {
      name: 'name',
      value: 'value',
      autoscale: true,
    };

    it('updates its own height when autoscale is enabled', async () => {
      const wrapper = shallowMount(ETextarea, { propsData: autoScaleProps });

      const scrollHeight = 50;
      const textArea = getTextArea(wrapper);

      Object.defineProperty(textArea.element, 'scrollHeight', {
        get() {
          return scrollHeight;
        },
      });

      textArea.setValue('Excepteur elit ut consectetur aliqua eiusmod irure ut ad ad. Ut est reprehenderit minim ex consequat dolor occaecat eiusmod. Consectetur nostrud eu ex consectetur fugiat magna sint exercitation amet. Irure labore esse velit nulla dolor in exercitation sit.');
      await textArea.trigger('input');

      expect(textArea.element.style.height).toBe(`${scrollHeight}px`);
    });

    it('does not get bigger than AUTOSCALE_MAX_HEIGHT', async () => {
      const wrapper = shallowMount(ETextarea, { propsData: autoScaleProps });

      const scrollHeight = AUTOSCALE_MAX_HEIGHT + 100;
      const textArea = getTextArea(wrapper);

      Object.defineProperty(textArea.element, 'scrollHeight', {
        get() {
          return scrollHeight;
        },
      });

      textArea.setValue('Excepteur elit ut consectetur aliqua eiusmod irure ut ad ad. Ut est reprehenderit minim ex consequat dolor occaecat eiusmod. Consectetur nostrud eu ex consectetur fugiat magna sint exercitation amet. Irure labore esse velit nulla dolor in exercitation sit.');
      await textArea.trigger('input');

      expect(textArea.element.style.height).toBe(`${AUTOSCALE_MAX_HEIGHT}px`);
    });
  });

  describe('resize control', () => {
    const props = {
      name: 'resize',
      value: 'text',
    };

    it('applies default resize policy', () => {
      const wrapper = shallowMount(ETextarea, { propsData: props });
      expect(wrapper.find(`textarea--resize--${resizeOptions[0]}`)).toBeTruthy();
    });

    it.each([
      [props, resizeOptions[0]],
      [props, resizeOptions[1]],
    ])('applies correct resize value', (compProps, resizeValue) => {
      const wrapper = shallowMount(ETextarea, { propsData: {
        ...compProps, resize: resizeValue,
      },
      });
      expect(wrapper.find(`textarea--resize--${resizeValue}`)).toBeTruthy();
    });
  });

  describe('clear button', () => {
    const props = {
      name: 'clearable',
      value: 'text',
    };

    it.each([
      [props, false, false],
      [props, true, true],
    ])('correctly renders clear button', (compProps, isClearable, exists) => {
      const wrapper = shallowMount(ETextarea, { propsData: {
        ...compProps, clearable: isClearable,
      },
      });

      expect(wrapper.find(byTestId('textarea-clear-btn')).exists()).toBe(exists);
    });
  });
});
