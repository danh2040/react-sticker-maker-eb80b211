import { createLocalVue, mount } from '@vue/test-utils';
import { PiniaVuePlugin } from 'pinia';
import { createTestingPinia } from '@pinia/testing';

import EHero from './index.vue';

const localVue = createLocalVue();
localVue.use(PiniaVuePlugin);

const $colorMode = { value: 'light' };
const mocks = { $colorMode };

const options = {
  propsData: {
    title: 'A title',
    subtitle: 'A subtitle',
  },
  localVue,
  pinia: createTestingPinia(),
  mocks,
};

describe('EHero', () => {
  itRendersAndIsVisible(mount(EHero, options), 'section', 'hero');

  it('has a h1 title if one is provided', () => {
    const wrapper = mount(EHero, options);
    const title = wrapper.find(byTestId('hero-title'));
    expect(title.element).toHaveHtmlTag('h1');
    expect(title.text()).toContain(options.propsData.title);
    expect(title.element.classList).toHaveLength(1);
  });

  it('handles long title edge cases', () => {
    options.propsData.title = '12345678911234567892';
    const wrapper = mount(EHero, options);
    const title = wrapper.find(byTestId('hero-title'));
    expect(title.element.classList).toHaveLength(2);
    expect(title.element.classList).toContain('hero__title--long');
  });

  it('has a h2 subtitle if one is provided', () => {
    const wrapper = mount(EHero, options);
    const subtitle = wrapper.find(byTestId('hero-subtitle'));
    expect(subtitle.element).toHaveHtmlTag('h2');
    expect(subtitle.text()).toContain(options.propsData.subtitle);
  });

  it('has no h1 title if one is not provided', () => {
    const noTitleOptions = { ...options, propsData: {} };
    const wrapper = mount(EHero, noTitleOptions);
    const title = wrapper.find(byTestId('hero-title'));
    expect(title.exists()).toBe(false);
  });

  it('has no h2 subtitle if one is not provided', () => {
    const noSubtitleOptions = { ...options, propsData: {} };
    const wrapper = mount(EHero, noSubtitleOptions);
    const subtitle = wrapper.find(byTestId('hero-subtitle'));
    expect(subtitle.exists()).toBe(false);
  });

  it('has no right section if isDivided is false', () => {
    const wrapper = mount(EHero, options);
    const heroRight = wrapper.find(byTestId('hero-right'));
    expect(heroRight.exists()).toBe(false);
  });

  it('has a right section if isDivided is true', () => {
    const isDividedOptions = {
      ...options,
      propsData: { ...options.propsData, isDivided: true },
    };
    const wrapper = mount(EHero, isDividedOptions);
    const heroRight = wrapper.find(byTestId('hero-right'));
    expect(heroRight.exists()).toBe(true);
  });
});
