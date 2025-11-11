import { mount } from '@vue/test-utils';

import { sendCoreAnalyticsEvent } from '@ecosia/common-js/client/analytics.js';

import EAISearchButton from './index.vue';

vi.mock('@ecosia/common-js/client/analytics.js', () => ({
  sendCoreAnalyticsEvent: vi.fn(),
}));

const aiSearchUrl = 'https://www.ecosia-staging.xyz/ai-search';

const options = {
  propsData: { url: aiSearchUrl, variant: 'solid-white' },
  mocks: {
    $config: {
      aiSearchUrl: aiSearchUrl,
    },
  },
};

describe('AI Search Button', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(EAISearchButton, options);
  });

  itRendersAndIsVisible(mount(EAISearchButton, options), 'div');

  it('has the correct attributes', async () => {
    const link = wrapper.find('a');
    expect(link.attributes('href')).toBe(aiSearchUrl);
    expect(link.attributes('aria-label')).toBe('common.header.verticals.ai_search');
  });

  it('renders the text if viewport is desktop or greater without tooltip', async () => {
    await wrapper.setData({ isDesktopUp: true });
    const link = wrapper.find('a');
    expect(link.text()).toContain('common.header.verticals.ai_search');
    expect(wrapper.find(byTestId('tooltip-content')).exists()).toBe(false);
  });

  it('renders the tooltip instead of the inside button text if viewport is smaller than desktop', async () => {
    await wrapper.setData({ isDesktopUp: false });
    const link = wrapper.find('a');
    expect(wrapper.find(byTestId('tooltip-content')).exists()).toBe(true);
    expect(link.text()).not.toContain('common.header.verticals.ai_search');
  });

  it('tracks the AI search click', () => {
    const link = wrapper.find('a');
    link.trigger('click');

    expect(sendCoreAnalyticsEvent).toHaveBeenCalledTimes(1);
    expect(sendCoreAnalyticsEvent).toHaveBeenCalledWith('aiSearchButtonClick');
  });
});
