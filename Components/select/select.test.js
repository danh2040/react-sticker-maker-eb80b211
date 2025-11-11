import Vue from 'vue';
import { mount, shallowMount } from '@vue/test-utils';

import ESelect from './index.vue';

const propsData = {
  name: 'name',
  value: 'value',
  options: ['option 1', 'option 2', 'option 3'],
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

  itRendersAndIsVisible(shallowMount(ESelect, { propsData }), 'div', 'select');

  // renders without options
  itRendersAndIsVisible(shallowMount(ESelect), 'div', 'select');

  it('renders options as array of strings', () => {
    const options = ['one', 'two'];
    const wrapper = shallowMount(ESelect, { propsData: { options } });
    const values = wrapper.findAll(byTestId('select-element-option')).wrappers.map((wrp) => wrp.element.value);
    expect(options).toEqual(values);
  });

  it('renders options as array of objects', () => {
    const options = [{
      value: 'one',
      label: 'One',
    }, {
      value: 'two',
      label: 'Two',
    }];
    const wrapper = shallowMount(ESelect, { propsData: { options } });
    const values = wrapper.findAll(byTestId('select-element-option')).wrappers.map((wrp) => wrp.element.value);
    expect(options.map(({ value }) => value)).toEqual(values);
  });

  it('shows 1.5 options if optionsShown is 2', async () => {
    const wrapper = mount(ESelect, { propsData: { ...propsData, optionsShown: 2 } });
    await wrapper.find(inputElementSelector).trigger('mousedown');
    const list = wrapper.find(byTestId('select-options'));
    expect(list.element.style.getPropertyValue('--shown')).toBe('1.5');
  });

  it('shows all options if optionsShown is all', async () => {
    const options = ['one', 'two', 'three', 'four', 'five', 'six'];
    const wrapper = mount(ESelect, { propsData: { ...propsData, options, optionsShown: 'all' } });
    await wrapper.find(inputElementSelector).trigger('mousedown');
    const list = wrapper.find(byTestId('select-options'));
    expect(list.element.style.getPropertyValue('--shown')).toBe('');
  });

  it('selects option', async () => {
    const wrapper = mount(ESelect, { propsData });
    await wrapper.find(inputElementSelector).trigger('mousedown');
    const option = wrapper.find(byTestId('option 1'));
    await option.trigger('click');
    // We need to open the select dropdown again because
    // if an option get selected the dropdown will be closed
    // and the options will not be visible anymore
    await wrapper.find(inputElementSelector).trigger('mousedown');
    const optionSelected = wrapper.find(byTestId('option 1'));
    expect(optionSelected.classes('select__option--selected')).toBe(true);
  });

  it('selects options on input stop', async () => {
    const wrapper = mount(ESelect, { propsData });
    const selectSpy = vi.spyOn(wrapper.vm, 'select');

    const select = wrapper.find('.select__element');
    await select.trigger('input.stop');
    expect(selectSpy).toHaveBeenCalled();
  });

  it('does not select option if disabled', () => {
    const wrapper = mount(ESelect, { propsData: { ...propsData, disabled: true } });
    wrapper.find(byTestId(propsData.name)).trigger('mousedown');
    expect(wrapper.find(byTestId('select-options')).exists()).toBe(false);
  });

  it('shows the options if the open() method is called', async () => {
    const wrapper = mount(ESelect, { propsData });
    await wrapper.vm.open();
    expect(wrapper.vm.isOpen).toBe(true);
    expect(wrapper.find(byTestId('select-options')).exists()).toBe(true);
    expect(wrapper.find('.select__option').exists()).toBe(true);
  });

  it.each(['ArrowDown', 'ArrowUp'])('if closed, %s opens the dropdown', async (key) => {
    const wrapper = shallowMount(ESelect, { propsData });
    const openSpy = vi.fn();

    wrapper.vm.open = openSpy;
    await wrapper.trigger('keydown', { key });

    expect(openSpy).toHaveBeenCalled();
  });

  it.each(['Enter', ' '])('if closed but focused, "%s" opens the dropdown', async (key) => {
    const wrapper = mount(ESelect, { propsData });
    wrapper.find(inputElementSelector).trigger('focus');
    await wrapper.trigger('keyup', { key: 'Escape' });
    const openSpy = vi.fn();
    wrapper.vm.open = openSpy;

    await wrapper.trigger('keyup', { key });
    expect(openSpy).toHaveBeenCalled();
  });

  it.each(['Enter', ' '])('if open, "%s" selects the highlighted option', async (key) => {
    const wrapper = mount(ESelect, { propsData });
    wrapper.find(inputElementSelector).trigger('focus');
    await wrapper.trigger('keyup', { key: 'Enter' });
    await wrapper.trigger('keyup', { key: 'End' });
    await wrapper.trigger('keyup', { key });
    expect(wrapper.find(inputElementSelector).text()).toBe('option 3');
  });

  it.each(['ArrowDown', 'ArrowUp'])('if open, %s changes the highlighted option', async (key) => {
    const wrapper = mount(ESelect, { propsData });
    wrapper.find(inputElementSelector).trigger('mousedown');

    const method = key === 'ArrowUp' ? 'arrowUp' : 'arrowDown';
    const arrowSpy = vi.spyOn(wrapper.vm, method);
    const openSpy = vi.spyOn(wrapper.vm, 'open');
    const navigateSpy = vi.spyOn(wrapper.vm, 'navigate');

    await wrapper.trigger('keydown', { key });
    expect(arrowSpy).toHaveBeenCalled();
    expect(openSpy).not.toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalled();
  });

  it('home/end keys highlight first/last option', async () => {
    const wrapper = shallowMount(ESelect, { propsData });
    const navigateSpy = vi.spyOn(wrapper.vm, 'navigate');

    await wrapper.trigger('keyup', { key: 'End' });
    expect(navigateSpy).toHaveBeenCalled();
    expect(wrapper.vm.$data.highlightedIndex).toBe(2);

    await wrapper.trigger('keyup', { key: 'Home' });
    expect(navigateSpy).toHaveBeenCalled();
    expect(wrapper.vm.$data.highlightedIndex).toBe(0);
  });

  it('if open, Esc key closes the dropdown', async () => {
    const wrapper = shallowMount(ESelect, { propsData });
    const closeSpy = vi.spyOn(wrapper.vm, 'close');

    await wrapper.trigger('keyup', { key: 'Escape' });

    expect(closeSpy).toHaveBeenCalled();
    expect(wrapper.find(byTestId('select-options')).exists()).toBe(false);
    expect(wrapper.find('.select__option').exists()).toBe(false);
  });

  it('if open, Enter key selects the highlighted option', async () => {
    const wrapper = mount(ESelect, { propsData });
    wrapper.find(inputElementSelector).trigger('mousedown');

    const selectSpy = vi.spyOn(wrapper.vm, 'select');
    await wrapper.trigger('keyup', { key: 'Enter' });

    expect(selectSpy).toHaveBeenCalledWith('option 1');
  });

  it('if open, a click stop on the list item closes and selects the option', async () => {
    const wrapper = mount(ESelect, { propsData });
    const selectAndCloseSpy = vi.spyOn(wrapper.vm, 'selectAndClose');
    await wrapper.setData({ isOpen: true });

    const option = wrapper.find(byTestId(propsData.options[0]));
    await option.trigger('click.stop');

    expect(selectAndCloseSpy).toHaveBeenCalledWith(propsData.options[0]);
  });

  it('navigating up/down stops at first/last option and doesn\'t wrap', async () => {
    const wrapper = mount(ESelect, { propsData });
    await wrapper.trigger('keyup', { key: 'Enter' });
    expect(wrapper.find(byTestId('select-options'))).toBeVisible();

    [...'12345'].forEach(() => wrapper.vm.navigate('down'));
    await wrapper.vm.$nextTick();
    let items = wrapper.findAll('.list-item');
    expect(items.at(2).props().highlighted).toBe(true);

    [...'54321'].forEach(() => wrapper.vm.navigate('up'));
    await wrapper.vm.$nextTick();
    items = wrapper.findAll('.list-item');
    expect(items.at(0).props().highlighted).toBe(true);
  });

  it('if searchable and closed without selecting an option, clears input and picks no option', async () => {
    const listeners = { 'option-selected': vi.fn() };
    const wrapper = mount(ESelect, {
      propsData: {
        name: 'name',
        options: [
          { label: 'Option 1', value: 'option1' },
          { label: 'Option 2', value: 'option2' },
          { label: 'Option 3', value: 'option3' },
        ],
        value: '',
        searchable: true,
      },
      listeners,
    });
    await wrapper.trigger('keyup', { key: 'Enter' });
    expect(wrapper.find(byTestId('select-options'))).toBeVisible();

    const inputElement = wrapper.find(inputElementSelector);
    // some incomplete input
    inputElement.setValue('option');

    await wrapper.trigger('blur');
    expect(listeners['option-selected']).not.toHaveBeenCalled();
  });
});
