import { mount } from '@vue/test-utils';

import EButton from '@ecosia/common-vue2/components/button/index.vue';
import ELinkExternal from '@ecosia/common-vue2/components/link-external/index.vue';

import EMainNavImpactProfileImageMessageWrapper from './image-message-wrapper.vue';

const mockCloseButtonAriaLabel = 'Close the "test" message';
const options = {
  propsData: {
    closeButtonAriaLabel: mockCloseButtonAriaLabel,
    linkTestId: 'fake-link-test-id',
    linkText: 'Fake link text click me!',
    linkUrl: 'https://example.com',
  },
};

describe('EMainNavImpactProfileImageMessageWrapper', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("doesn't render an image container", async () => {
    const wrapper = mount(EMainNavImpactProfileImageMessageWrapper, options);
    await wrapper.vm.$nextTick();
    const imageContainerElement = wrapper.find(byTestId('image-message-wrapper-image'));
    expect(imageContainerElement.exists()).toBe(false);
  });

  describe('a image is supplied to the slot', () => {
    const optionsWithImageInSlot = {
      ...options,
      slots: {
        image: '<img src="https://example.com/dog.jpg" alt="" />',
      },
    };

    it('renders an image container', async () => {
      const wrapper = mount(EMainNavImpactProfileImageMessageWrapper, optionsWithImageInSlot);
      await wrapper.vm.$nextTick();
      const imageContainerElement = wrapper.find(byTestId('image-message-wrapper-image'));
      expect(imageContainerElement.exists()).toBe(true);

      const imageElement = wrapper.find('img');
      expect(imageElement.exists()).toBe(true);
    });
  });

  it('renders the link correctly', async () => {
    const wrapper = mount(EMainNavImpactProfileImageMessageWrapper, options);
    await wrapper.vm.$nextTick();
    const linkComponent = await wrapper.findComponent(ELinkExternal);

    expect(linkComponent.exists()).toBe(true);
    expect(linkComponent.text()).toBe('Fake link text click me!');
    expect(linkComponent.attributes('href')).toBe('https://example.com');
    expect(linkComponent.attributes('data-test-id')).toBe('fake-link-test-id');
  });

  describe('on click of the link', () => {
    it('emits the link-click event', async () => {
      const wrapper = mount(EMainNavImpactProfileImageMessageWrapper, options);
      await wrapper.vm.$nextTick();
      await wrapper.findComponent(ELinkExternal).trigger('click');
      expect(wrapper.emitted()).toHaveProperty('link-click');
    });
  });

  describe('on click of the close button', () => {
    it('emits the close event', async () => {
      const wrapper = mount(EMainNavImpactProfileImageMessageWrapper, options);
      await wrapper.vm.$nextTick();
      await wrapper.findComponent(EButton).trigger('click');
      expect(wrapper.emitted()).toHaveProperty('close');
    });

    it('adds an aria-label to the close button', () => {
      const wrapper = mount(EMainNavImpactProfileImageMessageWrapper, options);
      const closeButtonElement = wrapper.findComponent(EButton);
      expect(
        closeButtonElement.attributes('aria-label'),
      ).toBe(
        mockCloseButtonAriaLabel,
      );
    });
  });
});
