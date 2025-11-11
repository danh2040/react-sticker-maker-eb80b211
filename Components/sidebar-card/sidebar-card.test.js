import { mount, shallowMount } from '@vue/test-utils';
import flushPromises from 'flush-promises';

import ESidebarCard from './index.vue';

const url = 'http://localhost';
const title = 'I am a sideline card title';
const description = 'I am a sideline card description';
const linkText = 'I am a link';
const imageUrl = 'image-url-from-braze';
const propsData = { url, description, title, linkText, imageUrl };

describe('ESidebarCard', () => {
  itRendersAndIsVisible(shallowMount(ESidebarCard, { propsData }), 'ecard-stub');

  it('renders content & link correctly', () => {
    const wrapper = shallowMount(ESidebarCard, { propsData });
    const cardTitle = wrapper.find(byTestId('sidebar-card-title'));
    const cardLink = wrapper.find(byTestId('sidebar-card-link'));
    const cardDescription = wrapper.find(byTestId('sidebar-card-description'));

    expect(wrapper.attributes('as')).toBe('div');
    expect(cardLink.attributes().href).toBe(url);
    expect(cardTitle.text()).toBe(title);
    expect(cardDescription.text()).toBe(description);
    expect(cardLink.text()).toBe(linkText);
  });

  it('adds medium font size class to description if smallerText prop is true', () => {
    const props = { ...propsData, smallerText: true };
    const wrapper = shallowMount(ESidebarCard, { propsData: props });
    const cardDescription = wrapper.find(byTestId('sidebar-card-description'));

    expect(cardDescription.classes()).toContain('sidebar-card__description--m');
  });

  it('renders only description and image', async () => {
    const wrapper = shallowMount(ESidebarCard, { propsData: { imageUrl, description } });
    const cardTitle = wrapper.find(byTestId('sidebar-card-title'));
    const cardLink = wrapper.find(byTestId('sidebar-card-link'));
    const cardDescription = wrapper.find(byTestId('sidebar-card-description'));

    await flushPromises();
    expect(cardDescription.text()).toBe(description);
    expect(wrapper.find('img').exists()).toBe(true);
    expect(cardTitle.exists()).toBe(false);
    expect(cardLink.exists()).toBe(false);
  });

  it('renders img if imageUrl is provided', async () => {
    const wrapper = shallowMount(ESidebarCard, { propsData });

    await flushPromises();

    expect(wrapper.find('img').exists()).toBe(true);
  });

  it('renders dismiss button always', async () => {
    const wrapper = shallowMount(ESidebarCard, { propsData });

    expect(wrapper.find(byTestId('sidebar-card-dismiss')).exists()).toBe(true);
  });

  it('emits impression event when intersected', () => {
    const wrapper = shallowMount(ESidebarCard, { propsData });
    expect(wrapper.emitted('impression')).toBeTruthy();
  });

  it('emits click event if link is clicked', async () => {
    const wrapper = mount(ESidebarCard, { propsData });
    const cardLink = wrapper.find(byTestId('sidebar-card-link'));

    await cardLink.trigger('click');

    expect(wrapper.emitted('click')).toBeTruthy();
  });

  it('hides card and emits dismiss event if dismiss button is clicked', async () => {
    const wrapper = mount(ESidebarCard, { propsData });
    const dismissButton = wrapper.find(byTestId('sidebar-card-dismiss'));

    await dismissButton.trigger('click');

    expect(wrapper.isVisible()).toBe(false);
    expect(wrapper.emitted('dismiss')).toBeTruthy();
  });
});
