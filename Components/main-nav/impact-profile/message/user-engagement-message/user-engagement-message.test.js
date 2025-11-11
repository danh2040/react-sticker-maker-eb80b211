import { createLocalVue, mount } from '@vue/test-utils';
import { PiniaVuePlugin } from 'pinia';
import { createTestingPinia } from '@pinia/testing';
import { mockIntersectionObserver } from 'jsdom-testing-mocks';

import userEngagementMocks from '@ecosia/common-vitest/mocks/user-engagement';
import EButton from '@ecosia/common-vue2/components/button/index.vue';
import ELinkExternal from '@ecosia/common-vue2/components/link-external/index.vue';

import { useUserStore } from '@ecosia/store/user/index.js';
import { useUserEngagementStore } from '@ecosia/user-engagement-client2/user-engagement.store.js';

import EMainNavImpactProfileUserEngagementMessage from './index.vue';

const { $trackUserEngagementCardEvent } = userEngagementMocks;
const localVue = createLocalVue();
localVue.use(PiniaVuePlugin);

const mocks = {
  $trackUserEngagementCardEvent,
  $pinia: {
    state: {
      value: {
        userEngagement: true,
      },
    },
  },
};
const pinia = createTestingPinia({ stubActions: false });
const options = {
  pinia,
  mocks,
  propsData: {
    card: {
      description: 'This is the main text of the card!',
    },
  },
};

const userEngagementStore = useUserEngagementStore();
const userStore = useUserStore();

const intersectionObserver = mockIntersectionObserver();

describe('EMainNavImpactProfileUserEngagementMessage', () => {
  beforeEach(() => {
    userEngagementStore.$reset();
    userStore.$reset();
    vi.restoreAllMocks();

    userEngagementStore.$patch({ isEnabled: true });
  });

  describe('with only the required props', () => {
    it("doesn't render an image", () => {
      const wrapper = mount(EMainNavImpactProfileUserEngagementMessage, options);
      const imageElement = wrapper.find(byTestId('user-engagement-message-image'));
      expect(imageElement.exists()).toBe(false);
    });

    it("doesn't render a heading", () => {
      const wrapper = mount(EMainNavImpactProfileUserEngagementMessage, options);
      const headingElement = wrapper.find(byTestId('user-engagement-message-title'));
      expect(headingElement.exists()).toBe(false);
    });

    it('renders text', () => {
      const wrapper = mount(EMainNavImpactProfileUserEngagementMessage, options);
      const textElement = wrapper.find(byTestId('user-engagement-message-text'));
      expect(textElement.text()).toBe('This is the main text of the card!');
    });

    it("doesn't render a link", () => {
      const wrapper = mount(EMainNavImpactProfileUserEngagementMessage, options);
      const linkElement = wrapper.findComponent(ELinkExternal);
      expect(linkElement.exists()).toBe(false);
    });
  });

  describe('with an image sent as a prop', () => {
    const optionsWithImage = {
      ...options,
      propsData: {
        card: {
          ...options.propsData.card,
          imageUrl: 'http://example.com',
        },
      },
    };

    it('renders an image', () => {
      const wrapper = mount(EMainNavImpactProfileUserEngagementMessage, optionsWithImage);
      const imageElement = wrapper.find(byTestId('user-engagement-message-image'));
      expect(imageElement.exists()).toBe(true);
      expect(imageElement.attributes('src')).toBe('http://example.com');
    });
  });

  describe('with a link sent as a prop', () => {
    const optionsWithLink = {
      ...options,
      propsData: {
        card: {
          ...options.propsData.card,
          url: 'https://example.com',
          linkText: 'This is the link text',
        },
      },
    };

    it('renders a link', () => {
      const wrapper = mount(EMainNavImpactProfileUserEngagementMessage, optionsWithLink);
      const linkElement = wrapper.findComponent(ELinkExternal);
      expect(linkElement.exists()).toBe(true);
      expect(linkElement.attributes('href')).toBe('https://example.com');
      expect(linkElement.text()).toBe('This is the link text');
    });
  });

  describe('with a heading sent as a prop', () => {
    const optionsWithHeading = {
      ...options,
      propsData: {
        card: {
          ...options.propsData.card,
          title: 'This is the heading',
        },
      },
    };

    it('renders a heading', () => {
      const wrapper = mount(EMainNavImpactProfileUserEngagementMessage, optionsWithHeading);
      const headingElement = wrapper.find(byTestId('user-engagement-message-title'));
      expect(headingElement.exists()).toBe(true);
      expect(headingElement.text()).toBe('This is the heading');
    });
  });

  describe('on click of the close button', () => {
    it('emits the dismiss-message event', async () => {
      const wrapper = mount(EMainNavImpactProfileUserEngagementMessage, options);
      await wrapper.vm.$nextTick();
      await wrapper.findComponent(EButton).trigger('click');
      expect(wrapper.emitted()).toHaveProperty('dismiss-message');
    });
  });

  it("doesn't call braze analytics events", async () => {
    const wrapper = mount(EMainNavImpactProfileUserEngagementMessage, options);
    await wrapper.vm.$nextTick();
    expect($trackUserEngagementCardEvent).not.toHaveBeenCalled();
  });

  describe('when seen', () => {
    it('emits impression event', async () => {
      const wrapper = mount(EMainNavImpactProfileUserEngagementMessage, options);
      await intersectionObserver.enterNode(wrapper.element);
      expect(wrapper.emitted()).toHaveProperty('impression');
    });

    it('calls braze analytics impression event', async () => {
      const wrapper = mount(EMainNavImpactProfileUserEngagementMessage, options);
      await wrapper.vm.$nextTick();
      await intersectionObserver.enterNode(wrapper.element);
      expect($trackUserEngagementCardEvent).toHaveBeenCalledWith('impression', {
        description: 'This is the main text of the card!',
      });
    });
  });

  describe('on link click of the close button', () => {
    const optionsWithLink = {
      ...options,
      propsData: {
        card: {
          ...options.propsData.card,
          url: 'https://example.com',
          linkText: 'This is the link text',
        },
      },
    };

    it('calls braze analytics click event', async () => {
      const wrapper = mount(EMainNavImpactProfileUserEngagementMessage, optionsWithLink);
      await wrapper.vm.$nextTick();
      await wrapper.findComponent(ELinkExternal).trigger('click');
      expect($trackUserEngagementCardEvent).toHaveBeenCalledWith('click', {
        description: 'This is the main text of the card!',
        url: 'https://example.com',
        linkText: 'This is the link text',
      });
    });
  });
});
