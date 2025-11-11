import { createLocalVue, mount, shallowMount } from '@vue/test-utils';
import { PiniaVuePlugin } from 'pinia';
import { createTestingPinia } from '@pinia/testing';

import { useGlobalStore } from '@ecosia/store/global/index.js';
import { useUserStore } from '@ecosia/store/user/index.js';

import ERating from './index.vue';

const localVue = createLocalVue();
localVue.use(PiniaVuePlugin);
const pinia = createTestingPinia({ stubActions: false });

const stubs = { EIcon: { template: '<svg />' } };
const propsData = { value: 4.7 };
const options = { localVue, pinia, propsData, stubs };
const filterStars = (stars, type) => stars.filter((star) => star.attributes('data-test-id') === `rating-star${type ? `-${type}` : ''}`);

describe('Rating', () => {
  const globalStore = useGlobalStore(pinia);
  const userStore = useUserStore(pinia);

  beforeEach(() => {
    // Ensures consistent number formatting in all environments
    globalStore.$patch({
      locale: 'en',
    });
  });

  afterEach(() => {
    globalStore.$reset();
    userStore.$reset();
  });

  itRendersAndIsVisible(shallowMount(ERating, options), 'data');

  it('warns on missing value', () => {
    expect(() => {
      try {
        shallowMount(ERating, { localVue, pinia });
      } catch (err) {
        // prevents error from reading undefined variable
      }
    })
      .toHaveMissingProp('value');
  });

  it('prevents more than one decimal rating values', () => {
    const wrapper = shallowMount(ERating, { localVue, pinia, propsData: { value: 4.7333 } });
    expect(wrapper.find(byTestId('rating-value')).text()).toBe(String(options.propsData.value));
  });

  it('shows decimals for round numbers (tripadvisor)', () => {
    const wrapper = shallowMount(ERating, { localVue, pinia, propsData: { value: 4.0, variant: 'tripadvisor' } });
    expect(wrapper.find(byTestId('rating-value')).text()).toBe('4.0');
  });

  it('does not show decimals for round numbers', () => {
    const wrapper = shallowMount(ERating, { localVue, pinia, propsData: { value: 4.0 } });
    expect(wrapper.find(byTestId('rating-value')).text()).toBe('4');
  });

  // covers https://ecosia.atlassian.net/browse/SEAII-1991
  it('renders stars', async () => {
    const wrapper = shallowMount(ERating, options);
    expect(wrapper.find(byTestId('rating-value')).text()).toBe(String(options.propsData.value));
    const stars = wrapper.findAll(byTestIdPrefix('rating-star'));
    expect(stars.length).toBe(5);
    expect(filterStars(stars, 'fill').length).toBe(4);
    expect(filterStars(stars, 'half').length).toBe(1);
    expect(filterStars(stars, '').length).toBe(0);
    wrapper.setProps({ value: 2.8 });
    await wrapper.vm.$nextTick();
    expect(filterStars(stars, 'fill').length).toBe(3);
    expect(filterStars(stars, 'half').length).toBe(0);
    expect(filterStars(stars, '').length).toBe(2);
  });

  it('renders without value if showValue is false', () => {
    const wrapper = shallowMount(ERating, {
      ...options,
      propsData: { ...propsData, showValue: false },
    });
    expect(wrapper.find(byTestId('rating-value')).exists()).toBe(false);
  });

  it('renders reviews if set', () => {
    const reviews = 7;
    const wrapper = shallowMount(ERating, { ...options, propsData: { ...propsData, reviews } });
    expect(wrapper.find(byTestId('rating-reviews-text')).text()).toBe(String(reviews));
    expect(wrapper.find(byTestId('rating-reviews-link')).exists()).toBe(false);
  });

  it('renders reviews url if set and triggers reviews-click event', () => {
    const reviews = 12;
    const listeners = { 'reviews-click': vi.fn() };
    const reviewsUrl = 'http://local.ecosia.org';
    const wrapper = mount(ERating, {
      ...options,
      listeners,
      propsData: { ...propsData, reviews, reviewsUrl },
    });
    const link = wrapper.find(byTestId('rating-reviews-link'));
    expect(link.attributes()).toMatchObject({
      href: reviewsUrl,
      target: '_self',
    });
    expect(link.text()).toContain(reviews.toString());
    expect(wrapper.find(byTestId('rating-reviews-text')).exists()).toBe(false);

    link.trigger('click');
    expect(listeners['reviews-click']).toHaveBeenCalled();
  });

  it('renders without parens around review count', () => {
    const wrapper = shallowMount(ERating, {
      ...options,
      propsData: { ...propsData, reviews: 12345, parens: false },
    });
    expect(wrapper.find(byTestId('rating-reviews')).text()).toEqual('12,345');
  });
});
