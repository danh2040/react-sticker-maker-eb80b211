import { mount, shallowMount } from '@vue/test-utils';
import flushPromises from 'flush-promises';

import EFooterCard from './index.vue';

const id = 'treeupdates';
const url = 'http://localhost';
const title = 'I am a card title';
const linkText = 'I am a link';
const imageUrl = 'image-url-from-braze';
const imageTag = 'treeupdates';
const propsData = { id, url, title, linkText, imageUrl, imageTag };

describe('EFooterCard', () => {
  itRendersAndIsVisible(shallowMount(EFooterCard, { propsData }), 'ecard-stub');

  it('renders content & link correctly', () => {
    const wrapper = shallowMount(EFooterCard, { propsData });
    const card = wrapper.find(byTestId('footer-card'));
    const cardTitle = wrapper.find(byTestId('footer-card-title'));
    const cardLink = wrapper.find(byTestId('footer-card-link'));

    expect(wrapper.attributes('as')).toBe('a');
    expect(card.attributes().href).toBe(url);
    expect(cardLink.attributes().href).toBe(url);
    expect(cardTitle.text()).toBe(title);
    expect(cardLink.text()).toBe(linkText);
  });

  it('renders img if imageUrl is provided', async () => {
    const wrapper = shallowMount(EFooterCard, { propsData });

    await flushPromises();

    expect(wrapper.find(byTestId('footer-card-illustration-custom')).exists()).toBe(true);
    expect(wrapper.find(byTestId(`footer-card-illustration-${imageTag}`)).exists()).toBe(false);
  });

  it('renders illustration component if no imageUrl is provided', async () => {
    propsData.imageUrl = '';
    const wrapper = shallowMount(EFooterCard, { propsData });

    await flushPromises();

    expect(wrapper.find(byTestId('footer-card-illustration-custom')).exists()).toBe(false);
    expect(wrapper.find(byTestId(`footer-card-illustration-${imageTag}`)).exists()).toBe(true);
  });

  it('renders card as div if no url provided', () => {
    const wrapper = shallowMount(EFooterCard, { propsData: { ...propsData, url: '' } });

    expect(wrapper.attributes('as')).toBe('div');
  });

  it('emits impression event when intersected', () => {
    const wrapper = shallowMount(EFooterCard, { propsData });
    expect(wrapper.emitted('impression')).toBeTruthy();
  });

  it('emits click event if card is clicked', async () => {
    const card = mount(EFooterCard, { propsData });

    await card.trigger('click');

    expect(card.emitted('click')).toBeTruthy();
  });

  it('emits click event if link is clicked', async () => {
    const wrapper = mount(EFooterCard, { propsData });
    const cardLink = wrapper.find(byTestId('footer-card-link'));

    await cardLink.trigger('click');

    expect(wrapper.emitted('click')).toBeTruthy();
  });

  it('renders bodytext', () => {
    const bodyText = 'some copy';
    const wrapper = shallowMount(EFooterCard, { propsData: { ...propsData, bodyText } });
    const cardBodyText = wrapper.find(byTestId('footer-card-body-text'));

    expect(cardBodyText.text()).toBe(bodyText);
    expect(cardBodyText.exists()).toBeTruthy();
  });

  it('does NOT render bodytext', () => {
    const wrapper = shallowMount(EFooterCard, { propsData });
    const cardBodyText = wrapper.find(byTestId('footer-card-body-text'));

    expect(cardBodyText.exists()).toBeFalsy();
  });
});
